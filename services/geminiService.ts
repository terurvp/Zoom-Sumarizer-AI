import { GoogleGenAI } from "@google/genai";
import { SummaryLanguage } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateZoomSummary = async (base64Data: string, mimeType: string, language: SummaryLanguage): Promise<string> => {
  const ai = getGeminiClient();
  
  // Using gemini-2.5-flash for efficient multimodal processing
  const modelId = "gemini-2.5-flash";

  let languageInstruction = "The summary should follow the language of the audio content.";
  let summaryStructure = `
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

  if (language === 'ja') {
    languageInstruction = "The summary MUST be written in Japanese (日本語).";
    summaryStructure = `
    # 会議要約
    
    ## 1. エグゼクティブサマリー
    (会議の主な目的と成果の簡潔な要約)
    
    ## 2. 主な議論ポイント
    (議論された最も重要なトピックの箇条書き)
    
    ## 3. 決定事項
    (参加者によって合意された具体的な決定事項)
    
    ## 4. アクションアイテム
    (タスクのリスト、言及されている場合は担当者と期限)
    - [ ] タスク: ... | 担当: ...
    
    ## 5. 雰囲気とトーン
    (会議の雰囲気の簡潔な説明)
    `;
  } else if (language === 'en') {
    languageInstruction = "The summary MUST be written in English.";
  }

  const prompt = `
    You are an expert executive assistant. I have uploaded a recording of a Zoom meeting.
    
    Please analyze the audio/video and provide a comprehensive summary formatted in Markdown.
    
    ${languageInstruction}
    
    The output should strictly follow this structure:
    ${summaryStructure}
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