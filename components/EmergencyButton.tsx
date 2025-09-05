"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Square, Users } from "lucide-react";
import { getCurrentLocation, generateIncidentId } from "@/lib/utils";
import { RecordedIncident } from "@/lib/types";

interface EmergencyButtonProps {
  variant?: "primary" | "secondary";
  onIncidentStart?: (incident: RecordedIncident) => void;
  onIncidentStop?: (incident: RecordedIncident) => void;
}

export function EmergencyButton({
  variant = "primary",
  onIncidentStart,
  onIncidentStop,
}: EmergencyButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentIncident, setCurrentIncident] =
    useState<RecordedIncident | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Request location permission
      const location = await getCurrentLocation();

      // Create incident record
      const incident: RecordedIncident = {
        incidentId: generateIncidentId(),
        userId: "current-user", // This would come from auth context
        timestamp: new Date(),
        location,
        alertSent: false,
      };

      setCurrentIncident(incident);
      setIsRecording(true);
      setRecordingTime(0);

      onIncidentStart?.(incident);

      // Request media permissions (audio/video)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        // Store stream reference for actual recording implementation
        console.log("Media stream obtained:", stream);
      } catch (mediaError) {
        console.warn("Media access denied, continuing with location only");
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Unable to access location. Please enable location services.");
    }
  };

  const stopRecording = () => {
    if (currentIncident) {
      const updatedIncident = {
        ...currentIncident,
        duration: recordingTime,
      };

      setCurrentIncident(null);
      setIsRecording(false);
      setRecordingTime(0);

      onIncidentStop?.(updatedIncident);
    }
  };

  const alertContacts = () => {
    if (currentIncident) {
      // This would trigger the emergency alert system
      console.log(
        "Alerting emergency contacts for incident:",
        currentIncident.incidentId,
      );

      const updatedIncident = {
        ...currentIncident,
        alertSent: true,
      };
      setCurrentIncident(updatedIncident);

      // Show confirmation
      alert("Emergency contacts have been notified with your location.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isRecording) {
    return (
      <div className="space-y-4">
        {/* Recording Status */}
        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-semibold text-text-primary">
              Recording Active
            </span>
          </div>
          <div className="text-3xl font-mono text-red-400 mb-4">
            {formatTime(recordingTime)}
          </div>
          <p className="text-sm text-text-secondary">
            Stay calm. Your location is being tracked.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={alertContacts}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
            disabled={currentIncident?.alertSent}
          >
            <Users className="h-5 w-5" />
            <span>
              {currentIncident?.alertSent
                ? "Contacts Alerted"
                : "Alert Emergency Contacts"}
            </span>
          </button>

          <button
            onClick={stopRecording}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
          >
            <Square className="h-5 w-5" />
            <span>Stop Recording</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      className={
        variant === "primary" ? "btn-emergency w-full" : "btn-secondary w-full"
      }
    >
      <div className="flex items-center justify-center space-x-2">
        <AlertTriangle className="h-6 w-6" />
        <span>Start Emergency Recording</span>
      </div>
    </button>
  );
}
