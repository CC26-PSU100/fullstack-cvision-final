import dotenv from "dotenv";
import path from "path";

// Load environment variables from the backend directory's .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

import { cleanAnalysisResult } from "./services/aiCleaner";

// Sample mock data with typos, improper formatting, and raw values from user example
const sampleRawData = {
  "recommendations": [
    {
      "rank": 1,
      "title": "cloud technical support engineer",
      "score": 0.2124,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 2,
      "title": "devops engineer intern",
      "score": 0.1746,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 3,
      "title": "senior si db developer",
      "score": 0.1667,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 4,
      "title": "get rm2000 referral",
      "score": 0.1635,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 5,
      "title": "cybersecurity engineer",
      "score": 0.1582,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 6,
      "title": "engineer information technology",
      "score": 0.1526,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 7,
      "title": "technical software engineer",
      "score": 0.1526,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 8,
      "title": "network engineer",
      "score": 0.1521,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 9,
      "title": "devops engineer",
      "score": 0.1518,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 10,
      "title": "application security engineer",
      "score": 0.1513,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 11,
      "title": "field test engineer",
      "score": 0.1491,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 12,
      "title": "security solution engineer",
      "score": 0.1488,
      "category": "Engineering"
    },
    {
      "rank": 13,
      "title": "senior programmer cobol",
      "score": 0.1476,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 14,
      "title": "internship students",
      "score": 0.1474,
      "category": "Information & Communication Technology"
    },
    {
      "rank": 15,
      "title": "infrastructure specialist",
      "score": 0.1471,
      "category": "Information & Communication Technology"
    }
  ],
  "domains": [
    {
      "domain": "Technology & IT",
      "confidence": 96,
      "sector": "Technical"
    },
    {
      "domain": "Engineering",
      "confidence": 4,
      "sector": "Technical"
    }
  ]
};

async function test() {
   console.log("=== Original JSON Data ===");
   console.log(JSON.stringify(sampleRawData, null, 2));
   console.log("\n==========================");

   const apiKey = process.env.DEEPSEEK_API_KEY;
   if (!apiKey) {
      console.error("\n[Error] DEEPSEEK_API_KEY is not defined in backend/.env.");
      console.log("Please define DEEPSEEK_API_KEY in your .env file to run the AI cleanup test.\n");
      return;
   }

   console.log("\nSending data to DeepSeek API for cleaning...");
   const startTime = Date.now();
   const cleanedData = await cleanAnalysisResult(sampleRawData);
   const duration = ((Date.now() - startTime) / 1000).toFixed(2);

   console.log(`\n=== Cleaned JSON Data (Received in ${duration}s) ===`);
   console.log(JSON.stringify(cleanedData, null, 2));
   console.log("==================================================");
}

test();
