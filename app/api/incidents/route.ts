import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase";
import { z } from "zod";

const createIncidentSchema = z.object({
  userId: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  recordingUrl: z.string().optional(),
  alertSent: z.boolean().default(false),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

const getIncidentsSchema = z.object({
  userId: z.string(),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createIncidentSchema.parse(body);

    const incident = await supabaseHelpers.createIncident(validatedData);

    // If alert should be sent, trigger emergency alerts
    if (validatedData.alertSent) {
      try {
        // Get user's trusted contacts
        const user = await supabaseHelpers.getUserById(validatedData.userId);

        // Send alerts to all trusted contacts
        const alertPromises =
          user.trusted_contacts?.map(async (contact: any) => {
            return supabaseHelpers.createEmergencyAlert({
              incidentId: incident.incident_id,
              contactId: contact.contact_id,
            });
          }) || [];

        await Promise.all(alertPromises);
      } catch (alertError) {
        console.error("Error sending emergency alerts:", alertError);
        // Don't fail the incident creation if alerts fail
      }
    }

    return NextResponse.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error("Error creating incident:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create incident" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const validatedParams = getIncidentsSchema.parse({ userId, limit, offset });

    if (!validatedParams.userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const incidents = await supabaseHelpers.getUserIncidents(
      validatedParams.userId,
    );

    // Apply pagination
    const paginatedIncidents = incidents.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedIncidents,
      pagination: {
        total: incidents.length,
        limit,
        offset,
        hasMore: offset + limit < incidents.length,
      },
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request parameters",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch incidents" },
      { status: 500 },
    );
  }
}
