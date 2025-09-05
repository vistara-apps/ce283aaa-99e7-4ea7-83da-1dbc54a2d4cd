import { NextRequest, NextResponse } from "next/server";
import { supabaseHelpers } from "@/lib/supabase";
import { US_STATES, EMERGENCY_PHRASES } from "@/lib/constants";
import { z } from "zod";

const getGuidesSchema = z.object({
  language: z.enum(["en", "es"]).optional().default("en"),
  state: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get("language") as "en" | "es") || "en";
    const state = searchParams.get("state");

    const validatedParams = getGuidesSchema.parse({ language, state });

    // Try to get guides from database first
    let guides;
    try {
      guides = await supabaseHelpers.getStateGuides(validatedParams.language);
    } catch (error) {
      console.warn("Database not available, using fallback data:", error);
      // Fallback to mock data if database is not available
      guides = generateMockGuides(
        validatedParams.language,
        validatedParams.state,
      );
    }

    // Filter by state if specified
    if (validatedParams.state) {
      const stateName = US_STATES.find(
        (s) => s.code === validatedParams.state,
      )?.name;
      if (stateName) {
        guides = guides.filter((guide: any) => guide.state_name === stateName);
      }
    }

    return NextResponse.json({
      success: true,
      data: guides,
    });
  } catch (error) {
    console.error("Error fetching guides:", error);

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
      { success: false, error: "Failed to fetch guides" },
      { status: 500 },
    );
  }
}

function generateMockGuides(language: "en" | "es", stateFilter?: string) {
  const statesToGenerate = stateFilter
    ? US_STATES.filter((s) => s.code === stateFilter)
    : US_STATES;

  return statesToGenerate.map((state) => ({
    guide_id: `guide_${state.code}_${language}`,
    state_name: state.name,
    content_url: `/guides/${state.code}_${language}.json`,
    language,
    price: 1.99,
    content: {
      whatToSay: EMERGENCY_PHRASES[language].polite,
      whatNotToSay: EMERGENCY_PHRASES[language].avoid,
      yourRights: generateStateRights(state.name, language),
      emergencyContacts: ["911", "1-800-LEGAL"],
      stateSpecificInfo: generateStateSpecificInfo(state.name, language),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function generateStateRights(stateName: string, language: "en" | "es") {
  const baseRights = {
    en: [
      "You have the right to remain silent",
      "You have the right to refuse searches of your person, vehicle, or home",
      "You have the right to ask if you're free to leave",
      "You have the right to an attorney",
      "You have the right to refuse field sobriety tests (in most states)",
      "You have the right to record police interactions in public",
    ],
    es: [
      "Tienes derecho a permanecer en silencio",
      "Tienes derecho a rechazar registros de tu persona, vehículo o hogar",
      "Tienes derecho a preguntar si eres libre de irte",
      "Tienes derecho a un abogado",
      "Tienes derecho a rechazar pruebas de sobriedad (en la mayoría de los estados)",
      "Tienes derecho a grabar interacciones policiales en público",
    ],
  };

  return baseRights[language];
}

function generateStateSpecificInfo(stateName: string, language: "en" | "es") {
  const stateInfo = {
    en: {
      stopAndIdentify: `${stateName} is a "stop and identify" state - you may be required to provide identification if lawfully detained.`,
      recordingLaws: `In ${stateName}, you have the right to record police interactions in public spaces.`,
      searchLaws: `${stateName} follows federal guidelines for vehicle searches during traffic stops.`,
      arrestProcedures: `${stateName} law enforcement must follow specific procedures during arrests.`,
    },
    es: {
      stopAndIdentify: `${stateName} es un estado de "parar e identificar" - es posible que debas proporcionar identificación si eres detenido legalmente.`,
      recordingLaws: `En ${stateName}, tienes derecho a grabar interacciones policiales en espacios públicos.`,
      searchLaws: `${stateName} sigue las pautas federales para registros de vehículos durante paradas de tráfico.`,
      arrestProcedures: `Las fuerzas del orden de ${stateName} deben seguir procedimientos específicos durante los arrestos.`,
    },
  };

  return stateInfo[language];
}
