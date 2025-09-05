import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateScriptSchema = z.object({
  language: z.enum(["en", "es"]).default("en"),
  state: z.string(),
  scenario: z
    .enum(["traffic_stop", "street_encounter", "home_visit", "arrest"])
    .default("traffic_stop"),
  tone: z.enum(["polite", "assertive", "minimal"]).default("polite"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = generateScriptSchema.parse(body);

    const { language, state, scenario, tone } = validatedData;

    const systemPrompt = `You are a legal rights expert specializing in police interactions. Generate appropriate scripts for citizens during police encounters. Always prioritize safety and legal compliance.

Context:
- State: ${state}
- Scenario: ${scenario}
- Language: ${language}
- Tone: ${tone}

Provide responses in the following JSON format:
{
  "whatToSay": ["phrase1", "phrase2", ...],
  "whatNotToSay": ["phrase1", "phrase2", ...],
  "explanation": "Brief explanation of the approach",
  "stateSpecificNotes": "Any state-specific considerations"
}`;

    const userPrompt = `Generate a script for a ${scenario} scenario in ${state}. The tone should be ${tone}. ${language === "es" ? "Respond in Spanish." : "Respond in English."}

Focus on:
1. Constitutional rights
2. De-escalation
3. Legal compliance
4. Personal safety
5. State-specific laws where applicable

Ensure all phrases are:
- Legally sound
- Respectful
- Clear and concise
- Appropriate for the scenario
- Culturally sensitive`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      parsedResponse = {
        whatToSay: [
          language === "es"
            ? "Estoy ejerciendo mi derecho a permanecer en silencio."
            : "I am exercising my right to remain silent.",
          language === "es"
            ? "No consiento a ningún registro."
            : "I do not consent to any searches.",
          language === "es" ? "¿Soy libre de irme?" : "Am I free to leave?",
          language === "es"
            ? "Me gustaría hablar con un abogado."
            : "I would like to speak to a lawyer.",
        ],
        whatNotToSay: [
          language === "es"
            ? "No hice nada malo"
            : "I didn't do anything wrong",
          language === "es"
            ? "No puedes hacerme esto"
            : "You can't do this to me",
          language === "es" ? "Esto es acoso" : "This is harassment",
        ],
        explanation:
          language === "es"
            ? "Mantén la calma y sé respetuoso mientras ejerces tus derechos."
            : "Stay calm and respectful while exercising your rights.",
        stateSpecificNotes: `${state} follows standard constitutional protections for police encounters.`,
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedResponse,
    });
  } catch (error) {
    console.error("Error generating script:", error);

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
      { success: false, error: "Failed to generate script" },
      { status: 500 },
    );
  }
}
