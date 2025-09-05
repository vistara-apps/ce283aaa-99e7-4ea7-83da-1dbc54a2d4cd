import { useState, useRef, useCallback } from "react";
import { useGeolocation } from "react-use";
import { v4 as uuidv4 } from "uuid";
import { RecordedIncident } from "@/lib/types";

interface UseRecordingOptions {
  onIncidentStart?: (incident: RecordedIncident) => void;
  onIncidentStop?: (incident: RecordedIncident) => void;
  onError?: (error: Error) => void;
}

export function useRecording(options: UseRecordingOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentIncident, setCurrentIncident] =
    useState<RecordedIncident | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const location = useGeolocation();

  const startRecording = useCallback(
    async (userId: string) => {
      try {
        // Request permissions for audio/video recording
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: "environment", // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        streamRef.current = stream;
        chunksRef.current = [];

        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9,opus",
        });

        mediaRecorderRef.current = mediaRecorder;

        // Handle data available
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        // Handle recording stop
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const duration = Date.now() - startTimeRef.current;

          if (currentIncident) {
            const updatedIncident: RecordedIncident = {
              ...currentIncident,
              duration: Math.floor(duration / 1000), // Convert to seconds
              recordingUrl: URL.createObjectURL(blob),
            };

            setCurrentIncident(updatedIncident);
            options.onIncidentStop?.(updatedIncident);
          }

          // Clean up
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        };

        // Start recording
        mediaRecorder.start(1000); // Collect data every second
        startTimeRef.current = Date.now();
        setIsRecording(true);

        // Create incident record
        const incident: RecordedIncident = {
          incidentId: uuidv4(),
          userId,
          timestamp: new Date(),
          location: {
            latitude: location.latitude || 0,
            longitude: location.longitude || 0,
            address: await getAddressFromCoordinates(
              location.latitude || 0,
              location.longitude || 0,
            ),
          },
          alertSent: false,
        };

        setCurrentIncident(incident);
        options.onIncidentStart?.(incident);

        // Start duration counter
        durationIntervalRef.current = setInterval(() => {
          setRecordingDuration(
            Math.floor((Date.now() - startTimeRef.current) / 1000),
          );
        }, 1000);
      } catch (error) {
        console.error("Error starting recording:", error);
        options.onError?.(error as Error);
      }
    },
    [location, currentIncident, options],
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  const sendAlert = useCallback(async () => {
    if (currentIncident) {
      try {
        // Send emergency alert to trusted contacts
        const response = await fetch("/api/incidents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...currentIncident,
            alertSent: true,
          }),
        });

        if (response.ok) {
          setCurrentIncident((prev) =>
            prev ? { ...prev, alertSent: true } : null,
          );
        }
      } catch (error) {
        console.error("Error sending alert:", error);
        options.onError?.(error as Error);
      }
    }
  }, [currentIncident, options]);

  const uploadRecording = useCallback(
    async (blob: Blob): Promise<string | null> => {
      try {
        // This would integrate with Pinata for IPFS storage
        const formData = new FormData();
        formData.append(
          "file",
          blob,
          `incident-${currentIncident?.incidentId}.webm`,
        );

        // For now, return a mock URL
        // In production, this would upload to Pinata/IPFS
        return `https://ipfs.io/ipfs/mock-hash-${currentIncident?.incidentId}`;
      } catch (error) {
        console.error("Error uploading recording:", error);
        return null;
      }
    },
    [currentIncident],
  );

  return {
    isRecording,
    currentIncident,
    recordingDuration,
    startRecording,
    stopRecording,
    sendAlert,
    uploadRecording,
    hasLocationPermission:
      location.latitude !== null && location.longitude !== null,
    locationError: location.error,
  };
}

async function getAddressFromCoordinates(
  lat: number,
  lng: number,
): Promise<string | undefined> {
  try {
    // Use a reverse geocoding service (like Google Maps API or OpenStreetMap)
    // For now, return a mock address
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Error getting address:", error);
    return undefined;
  }
}
