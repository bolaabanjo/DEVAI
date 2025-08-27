
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is set.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const explainBug = async (codeOrError: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert software engineer and debugger.
      Explain the following error message and/or code snippet in plain English.
      Provide a step-by-step breakdown of what the error means and suggest potential fixes.
      Format your response in clean, readable Markdown.

      Error/Code:
      \`\`\`
      ${codeOrError}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error explaining bug:", error);
    return "Sorry, I encountered an error while analyzing the issue. Please check the console for details.";
  }
};

interface CommitDetails {
    type: string;
    scope?: string;
    description: string;
}

export const generateCommitMessage = async (details: CommitDetails): Promise<string> => {
    try {
        const prompt = `
        You are an expert at writing git commit messages following the Conventional Commits specification.
        Based on the following information, generate a complete and concise commit message.
        - Type: ${details.type}
        - Scope: ${details.scope || 'not provided'}
        - Description of changes: ${details.description}

        Your response should be ONLY the commit message itself (e.g., "feat(api): add new user endpoint"), without any extra explanation, markdown formatting, or introductory text.
        If the description is long, create a subject line and a body. The subject line should be under 50 characters.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating commit message:", error);
        return "Sorry, I encountered an error while generating the commit message.";
    }
};
