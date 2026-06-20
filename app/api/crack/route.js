import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      code,
      problem,
      customInput,
      clientApiKey,
      chatMessage,
      history,
      action = "analyze" // "analyze" | "stressTest" | "optimize" | "customizeTemplate"
    } = await req.json();

    // Determine which API key to use
    const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is missing. Please configure it in your environment or enter it in the header." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Elite Socratic system prompts for each action type
    const systemPrompt = `You are CrackCode, an elite competitive programming coach at NextWave.
Your goal is to guide students to fix their C++ code bugs, optimize complexity, and visualize code execution.

IMPORTANT: You must respond ONLY with a valid JSON object matching the requested schema. Do not output any markdown code fence blocks (e.g. do NOT wrap your response in \`\`\`json). Return a raw JSON string.

Based on the requested action, return a JSON object conforming EXACTLY to the following schemas:

### ACTION: "analyze" (or default if no chatMessage)
{
  "socraticFeedback": {
    "analysis": "Your detailed Socratic analysis of the code's logic. Ask guiding questions, point out general issues, do not give away the full code.",
    "edgeCases": ["Edge Case 1", "Edge Case 2", "Edge Case 3"],
    "hints": [
      { "title": "Hint 1: Logic & Approach", "content": "Study hints..." },
      { "title": "Hint 2: Edge Case & Bug Spotting", "content": "Edge case hints..." },
      { "title": "Hint 3: Optimization & Fix", "content": "Optimization recommendations..." }
    ]
  },
  "tracerData": {
    "structureType": "array" | "grid" | "list", 
    "initialState": [values] or [[grid rows]] or [values for list],
    "steps": [
      {
        "pointers": { "left": 0, "right": 3 } or { "row": 1, "col": 2 } or variables,
        "activeIndices": [indices] or [[r, c]] or [],
        "successIndices": [indices] or [[r, c]] or [],
        "message": "Step description explaining current state"
      }
    ]
  }
}
Note: For dry-run traces:
- Make sure the input array/grid is small (size 4 to 8 elements/cells) to keep the visualizer readable.
- If the problem deals with arrays, structureType must be "array". If it deals with 2D matrices/grids (like flood fill or DP tables), structureType must be "grid". If it's a general trace of variables (like DP memo states, counts, sums), structureType must be "list".

### ACTION: "stressTest"
{
  "socraticFeedback": {
    "analysis": "Socratic review of where the student's logic fails under stress cases (bounds, sizes, empty inputs)."
  },
  "stressTests": [
    {
      "input": "e.g. nums = [5, 5], target = 10",
      "expectedOutput": "e.g. [1, 2]",
      "buggyOutput": "e.g. [] or TLE or Crash",
      "status": "Failed" | "Passed",
      "explanation": "Why the bug occurs on this edge case input."
    }
  ]
}

### ACTION: "optimize"
{
  "currentComplexity": { "time": "e.g. O(N^2)", "space": "e.g. O(1)" },
  "optimalComplexity": { "time": "e.g. O(N)", "space": "e.g. O(N)" },
  "optimizationRoute": [
    "Identify redundant inner loops",
    "Store prefix sums to answer range queries in O(1)",
    "Implement two-pointer sweep to reduce complexity"
  ],
  "socraticFeedback": {
    "analysis": "Explain the time/space complexity bottleneck Socratically. Guide them on why this optimization works."
  },
  "optimizedSkeleton": "// C++ boilerplate code skeleton demonstrating the optimal structure (do not write the full correct solution, just the classes/types and logic comments)"
}

### ACTION: "customizeTemplate"
{
  "customTemplate": "// Customized C++ code template (e.g. customized DSU, Dijkstra with custom weight types, Segment Tree with Range Minimum Query)",
  "socraticFeedback": {
    "analysis": "How this template is constructed, its big-O complexity, and instructions on how to use it inside a solution class."
  }
}

### ACTION: "chat" (when chatMessage is provided and action is default)
{
  "socraticFeedback": {
    "analysis": "Your Socratic answer to their chat question. Maintain a coaching tone. Do not write the full corrected code for them. Ask them questions to lead them to the answer."
  }
}`;

    let userPrompt = "";
    if (chatMessage) {
      const historyStr = (history || [])
        .map((m) => `${m.role === "user" ? "Student" : "Coach"}: ${m.text}`)
        .join("\n");

      userPrompt = `
Problem:
${problem}

Student's C++ Code:
\`\`\`cpp
${code}
\`\`\`

Conversation History:
${historyStr}

New Student Question:
${chatMessage}

Provide your Socratic response. Maintain the JSON structure response format matching action "chat".`;
    } else if (action === "stressTest") {
      userPrompt = `
Problem Statement:
${problem}

Student's Buggy C++ Code:
\`\`\`cpp
${code}
\`\`\`

Generate a set of 3 to 5 realistic stress test cases that target edge constraints, extreme sizes, or duplicates. Determine the expected correct output and predict the buggy C++ code's output. Maintain the JSON response for action "stressTest".`;
    } else if (action === "optimize") {
      userPrompt = `
Problem Statement:
${problem}

Student's Current C++ Code:
\`\`\`cpp
${code}
\`\`\`

Analyze the time and space complexity of the student's solution. Compare it with the optimal complexity for this problem. Outline the optimization path and provide a skeletal structure of the optimized solution. Maintain the JSON response for action "optimize".`;
    } else if (action === "customizeTemplate") {
      userPrompt = `
Customization Request:
${customInput || "DSU (Disjoint Set Union) standard template"}

Problem Context:
${problem || "General C++ library"}

Generate a customized, clean, and highly-optimized C++ template class matching this request. Include inline comments. Maintain the JSON response for action "customizeTemplate".`;
    } else {
      // Default: analyze
      userPrompt = `
Problem Statement:
${problem || "Find two numbers in sorted array that sum to target."}

Student C++ Code:
\`\`\`cpp
${code}
\`\`\`

Test Input to Trace:
${customInput || "[2, 7, 11, 15] with target 9"}

Provide the initial Socratic analysis, 3 progressive hints, and step-by-step dry-run execution trace. Make sure structureType reflects the variable trace type (array, grid, list). Maintain the JSON response for action "analyze".`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText);

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: `AI Execution Failed: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
