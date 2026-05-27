import axios from "axios";

/**
 * Uses Google Gemini API (gemini-2.5-flash) to clean, standardise,
 * and professionally polish the JSON output from the CV Recommender endpoint.
 *
 * @param rawData The raw JSON response from the CV Recommender API.
 * @returns The cleaned JSON response.
 */
export async function cleanAnalysisResult(rawData: any): Promise<any> {
   const apiKey = process.env.GEMINI_API_KEY;
   if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Skipping AI cleaning.");
      return rawData;
   }

   const prompt = `
You are a professional CV and Career Profile Data Cleaning Assistant.
Your task is to take the following raw JSON containing parsed CV details and career recommendations, clean the content, correct any spelling mistakes/typos, format the text professionally, and return the cleaned data in the EXACT same JSON structure.

Rules for cleaning:
1. Preserve the exact structure, keys, and value types of the input JSON. Do not add any new keys outside the input schema unless repairing missing standard fields.
2. In 'domains', clean and standardise the 'domain' name and 'sector'. Correct spelling and casing.
3. In 'recommendations', clean the 'title' (correct typos, capitalize properly). CRITICAL: Filter out and completely remove any recommendations that are clearly spam, noise, advertisements, promotions, or invalid/generic job titles (e.g. "get rm2000 referral", "earn cash", etc.). If any items are filtered out, adjust the 'rank' property of the remaining items sequentially (1, 2, 3, etc.).
4. In 'educations', clean the 'level' (e.g., standardise 'S1'/'Strata 1' to 'Bachelor', 'S2' to 'Master', etc., or keep them clean and consistent), 'major', and 'institution' (correct typos, use standard names where possible). Keep 'startYear' and 'endYear' as integers.
5. In 'experiences', clean the 'title', 'company', and significantly polish the 'description' to be grammatically correct, professional, and clear. Keep 'startDate' and 'endDate' formatted as ISO strings or null.
6. Translate/standardise terms to professional English or clean standard Indonesian where appropriate (making it sound professional and polished).
7. Ensure that the job is relevant and realistic
8. Ensure that the returned output is valid JSON matching the schema of the input.

Input JSON:
${JSON.stringify(rawData, null, 2)}
`;

   try {
      const response = await axios.post(
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
         {
            contents: [
               {
                  parts: [
                     {
                        text: prompt
                     }
                  ]
               }
            ],
            generationConfig: {
               responseMimeType: "application/json"
            }
         },
         {
            headers: {
               "Content-Type": "application/json"
            },
            timeout: 20000 // 20 seconds timeout
         }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
         throw new Error("Empty response from Gemini API");
      }

      const cleanedData = JSON.parse(text.trim());
      
      // Ensure we preserve metadata or other top-level keys that might not have been returned
      return {
         ...rawData,
         ...cleanedData
      };
   } catch (error: any) {
      console.error("Error in cleanAnalysisResult:", error.message || error);
      // Fallback to the original data in case of error
      return rawData;
   }
}
