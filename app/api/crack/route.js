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
      action = "analyze", // "analyze" | "stressTest" | "optimize" | "customizeTemplate" | "run" | "submit" | "generateProblem"
      problemTitle,
      problemCategory
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

    // Socratic System Prompts
    const systemPrompt = `You are CrackCode, an elite competitive programming coach and sandbox compiler at NextWave.
Your goal is to help students debug C++ code, execute simulations, evaluate submissions, and set up CP challenges.

IMPORTANT: You must respond ONLY with a valid JSON object matching the requested action schema. Do not output any markdown code fence blocks (e.g. do NOT wrap your response in \`\`\`json). Return a raw JSON string.

Based on the requested action, return a JSON object conforming EXACTLY to the following schemas:

### ACTION: "analyze"
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

### ACTION: "run"
{
  "status": "Success" | "Compile Error" | "Runtime Error",
  "compileOutput": "Compiler warnings or errors, if any. Leave empty on success.",
  "stdout": "Any output printed during execution.",
  "returnValue": "Returned value of the main function (e.g., array value, number, boolean string)."
}

### ACTION: "submit"
{
  "status": "Accepted" | "Wrong Answer" | "Compile Error" | "Time Limit Exceeded",
  "score": 100 or number (0-100),
  "testCases": [
    {
      "input": "test case input values",
      "expected": "expected correct output",
      "got": "output returned by student's code",
      "passed": true | false
    }
  ],
  "feedback": "Overall summary of the submission: did it fail on edge cases, size limits, negative bounds, etc."
}

### ACTION: "generateProblem"
{
  "description": "A detailed, beautiful markdown problem description with constraints, sample inputs, and outputs.",
  "defaultCode": "// Complete C++ template boilerplate function signature for this specific problem\\n#include <vector>\\nusing namespace std;\\n...",
  "defaultTraceInput": "{\\"initialState\\": [2, 7, 11], \\"target\\": 9}"
}

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
  "optimizationRoute": ["step 1", "step 2"],
  "socraticFeedback": { "analysis": "explain logic bottleneck" },
  "optimizedSkeleton": "// C++ boilerplate"
}

### ACTION: "customizeTemplate"
{
  "customTemplate": "// C++ template",
  "socraticFeedback": { "analysis": "instructions" }
}

### ACTION: "chat"
{
  "socraticFeedback": {
    "analysis": "Socratic answer to question. Ask questions to lead them to the answer."
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

Provide your Socratic response. Maintain the JSON response for action "chat".`;
    } else if (action === "run") {
      userPrompt = `
You are a C++ execution sandbox. Execute the C++ function written in this code:
\`\`\`cpp
${code}
\`\`\`

Using the custom trace inputs provided here:
${customInput}

Run the logic step-by-step. If there is a compilation error (e.g. missing types, syntax error), set status to "Compile Error" and fill in compileOutput. Otherwise, return the stdout outputs and the function return value. Maintain the JSON format for action "run".`;
    } else if (action === "submit") {
      userPrompt = `
You are an Online Judge evaluating a C++ solution.
Problem Details:
${problem}

Student's Submitted C++ Code:
\`\`\`cpp
${code}
\`\`\`

Test this code against 3 to 4 distinct test cases:
1. The sample test case.
2. An edge case (empty bounds, null states, large numbers).
3. A performance scale case (duplicates, random arrays).

Perform compilation check and dry run. If the code fails any case, set status to "Wrong Answer" or "Time Limit Exceeded" and score accordingly (e.g., 25, 50, 75). If all cases pass, set status to "Accepted" and score to 100. Maintain the JSON format for action "submit".`;
    } else if (action === "generateProblem") {
      userPrompt = `
You are an expert problem setter. Generate a C++ competitive programming challenge description for:
Problem Title: ${problemTitle}
Category: ${problemCategory}

Format the description in clean Markdown containing:
- Problem Statement
- Constraints (e.g. Array size up to 10^5)
- Input & Output Formats
- Sample Input & Output with explanation.

Generate a C++ template function boilerplate (include necessary headers, standard namespaces, class/function definition).
Generate a defaultTraceInput JSON string that matches the structure type. Maintain the JSON format for action "generateProblem".`;
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
      userPrompt = `
Problem Statement:
${problem || "Find two numbers in sorted array that sum to target."}

Student C++ Code:
\`\`\`cpp
${code}
\`\`\`

Test Input to Trace:
${customInput || "[2, 7, 11, 15] with target 9"}

Provide the initial Socratic analysis, 3 hints, and step-by-step dry-run execution trace. Maintain the JSON response for action "analyze".`;
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
