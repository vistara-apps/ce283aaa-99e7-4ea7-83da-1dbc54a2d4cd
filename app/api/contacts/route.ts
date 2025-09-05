import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase";
import { z } from "zod";

const createContactSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
  farcasterId: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required"),
});

const updateContactSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .optional(),
  farcasterId: z.string().optional(),
  relationship: z.string().min(1, "Relationship is required").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createContactSchema.parse(body);

    const contact = await supabaseHelpers.createTrustedContact(validatedData);

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);

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
      { success: false, error: "Failed to create contact" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await supabaseHelpers.getUserById(userId);
    const contacts = user.trusted_contacts || [];

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = updateContactSchema.parse(body);

    const contact = await supabaseHelpers.updateTrustedContact(
      contactId,
      validatedData,
    );

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);

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
      { success: false, error: "Failed to update contact" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 },
      );
    }

    await supabaseHelpers.deleteTrustedContact(contactId);

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 500 },
    );
  }
}
