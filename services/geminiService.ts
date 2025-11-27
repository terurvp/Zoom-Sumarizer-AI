import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateZoomSummary = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = getGeminiClient();
  
  // Using gemini-2.5-flash for efficient multimodal processing
  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are an expert executive assistant. I have uploaded a recording of a Zoom meeting.
    
    Please analyze the audio/video and provide a comprehensive summary formatted in Markdown.
    
    The output should strictly follow this structure:
    
    # Meeting Summary
    
    ## 1. Executive Overview
    (A brief paragraph summarizing the main purpose and outcome of the meeting)
    
    ## 2. Key Discussion Points
    (Bulleted list of the most important topics discussed)
    
    ## 3. Decisions Made
    (Specific decisions agreed upon by the participants)
    
    ## 4. Action Items
    (A list of tasks, assigned owners if mentioned, and deadlines if mentioned)
    - [ ] Task: ... | Owner: ...
    
    ## 5. Sentiment & Tone
    (Brief description of the meeting's atmosphere)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }
    });

    return response.text || "No summary could be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. The file might be too large or the content unclear.");
  }
};
