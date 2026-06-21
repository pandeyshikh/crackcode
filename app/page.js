"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { mockDb, isSupabaseConfigured, supabase } from "./lib/supabase";
import { PROBLEMS_LIST, FEATURED_DETAILS } from "./lib/problems";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Send,
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  Code,
  Eye,
  Settings,
  Flame,
  User,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  TrendingUp,
  Cpu,
  Trophy,
  LogOut,
  Maximize2,
  Minimize2,
  Layers,
  Terminal,
  Search,
  Filter,
  Check,
  Award
} from "lucide-react";

export default function CrackCodeDashboard() {
  const [problems, setProblems] = useState(PROBLEMS_LIST);
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS_LIST[0]);
  const [code, setCode] = useState("");
  const [traceInput, setTraceInput] = useState("");
  
  // Left Panel tabs: problem, coach, hints, stress, optimize, history
  const [activeTab, setActiveTab] = useState("problem"); 
  const [clientApiKey, setClientApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic Problem Setter loading state
  const [generatingProblem, setGeneratingProblem] = useState(false);

  // Authentication & Stats States
  const [studentUser, setStudentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [authTab, setAuthTab] = useState("login"); // login / signup
  const [submissionsList, setSubmissionsList] = useState([]);

  // Google Sign-In simulation states
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // Search & Filters for 189 problems
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showProblemListDropdown, setShowProblemListDropdown] = useState(false);

  // Template Library states
  const [showTemplateHub, setShowTemplateHub] = useState(false);
  const [templateCustomInput, setTemplateCustomInput] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Socratic Feedback States
  const [analysisText, setAnalysisText] = useState(
    "Welcome to CrackCode! Paste your C++ code on the right and click 'Analyze & Trace' to receive Socratic guidance and start dry-running."
  );
  const [edgeCases, setEdgeCases] = useState([
    "Single element array",
    "Target sum is negative",
    "Duplicate elements"
  ]);
  const [hints, setHints] = useState([
    { title: "Hint 1: Logic & Approach", content: "To solve this, analyze pointer sweeps or recursive subproblems depending on the problem class.", unlocked: false },
    { title: "Hint 2: Edge Case & Bug Spotting", "content": "Double check boundary overflows and empty list conditions.", unlocked: false },
    { title: "Hint 3: Optimization & Fix", "content": "Look for redundant nested traversals and swap with hashing or binary search.", unlocked: false }
  ]);

  // Sandbox Console Output states (Run Code)
  const [consoleTab, setConsoleTab] = useState("tracer"); // "tracer" | "console"
  const [consoleOutput, setConsoleOutput] = useState({
    status: "Idle",
    compileOutput: "",
    stdout: "",
    returnValue: ""
  });
  const [runLoading, setRunLoading] = useState(false);

  // Submit Judgment states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    status: "Accepted",
    score: 100,
    testCases: [],
    feedback: ""
  });

  // Stress test states
  const [stressTests, setStressTests] = useState([]);
  const [stressLoading, setStressLoading] = useState(false);
  
  // Complexity / Optimization states
  const [optimizationData, setOptimizationData] = useState(null);
  const [optLoading, setOptLoading] = useState(false);

  // Chat History
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", text: "Hello! I am your NextWave AI CP Coach. Let's crack this code. What part of the algorithm is confusing or failing?" }
  ]);

  // Visualizer Tracer States
  const [tracerData, setTracerData] = useState({
    structureType: "array",
    initialState: [2, 7, 11, 15],
    steps: [
      {
        pointers: { left: 0, right: 3 },
        activeIndices: [0, 3],
        successIndices: [],
        message: "Ready to run dry-run trace simulation."
      }
    ]
  });
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms per step

  const playTimerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Load client configurations and saved submissions
  useEffect(() => {
    const savedKey = localStorage.getItem("crackcode_gemini_api_key");
    if (savedKey) setClientApiKey(savedKey);

    const savedUser = localStorage.getItem("crackcode_student_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setStudentUser(user);
      loadProfile(user.id);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Sync submissions list when studentUser changes
  useEffect(() => {
    if (studentUser) {
      loadSubmissions();
      loadProfile(studentUser.id);
    } else {
      setSubmissionsList([]);
      setProfileData(null);
    }
  }, [studentUser]);

  // Load details dynamically for a problem
  useEffect(() => {
    loadProblemContent(selectedProblem);
  }, [selectedProblem]);

  const loadProblemContent = async (problem) => {
    if (problem.featured && FEATURED_DETAILS[problem.id]) {
      const details = FEATURED_DETAILS[problem.id];
      setCode(details.defaultCode);
      setTraceInput(details.defaultTraceInput);
      setStressTests([]);
      setOptimizationData(null);
      setConsoleTab("tracer");
      setupDefaultTracer(details.defaultTraceInput);
      return;
    }

    // If it's a non-featured problem and not loaded yet, query the AI Problem Setter
    if (!problem.description) {
      setGeneratingProblem(true);
      const keyToUse = process.env.GEMINI_API_KEY || clientApiKey;
      if (!keyToUse) {
        // Fallback placeholder if no API key is set yet
        problem.description = `### ${problem.title}\nCategory: ${problem.category}\n\n*Configure your Gemini API Key in the top right to generate this C++ challenge and function skeletons automatically using AI!*`;
        problem.defaultCode = `// Configure API Key to generate skeleton\n#include <iostream>\nusing namespace std;`;
        problem.defaultTraceInput = `{"initialState": [1, 2, 3]}`;
        
        setCode(problem.defaultCode);
        setTraceInput(problem.defaultTraceInput);
        setGeneratingProblem(false);
        setupDefaultTracer(problem.defaultTraceInput);
        return;
      }

      try {
        const res = await fetch("/api/crack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientApiKey,
            action: "generateProblem",
            problemTitle: problem.title,
            problemCategory: problem.category
          })
        });
        const data = await res.json();
        if (res.ok && data.description) {
          problem.description = data.description;
          problem.defaultCode = data.defaultCode;
          problem.defaultTraceInput = data.defaultTraceInput;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setGeneratingProblem(false);
      }
    }

    setCode(problem.defaultCode || "");
    setTraceInput(problem.defaultTraceInput || "");
    setStressTests([]);
    setOptimizationData(null);
    setConsoleTab("tracer");
    setupDefaultTracer(problem.defaultTraceInput || "");
  };

  const setupDefaultTracer = (traceInputStr) => {
    try {
      const parsed = JSON.parse(traceInputStr);
      const initialArr = parsed.initialState || [1, 2, 3];
      setTracerData({
        structureType: Array.isArray(initialArr[0]) ? "grid" : "array",
        initialState: initialArr,
        steps: [
          {
            pointers: {},
            activeIndices: [],
            successIndices: [],
            message: "Click 'Analyze & Trace Code' to generate visualization run."
          }
        ]
      });
      setCurrentStepIdx(0);
    } catch (e) {
      // fallback
    }
  };

  const loadProfile = async (userId) => {
    try {
      const p = await mockDb.getProfile(userId);
      setProfileData(p);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSubmissions = async () => {
    try {
      if (studentUser) {
        const list = await mockDb.getSubmissions(studentUser.id);
        setSubmissionsList(list);
      }
    } catch (e) {
      console.error("Failed to load submissions", e);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < tracerData.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, tracerData, playbackSpeed]);

  const saveApiKey = (key) => {
    setClientApiKey(key);
    localStorage.setItem("crackcode_gemini_api_key", key);
    setShowKeyInput(false);
  };

  const clearApiKey = () => {
    setClientApiKey("");
    localStorage.removeItem("crackcode_gemini_api_key");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const userId = usernameInput.trim().toLowerCase().replace(/\s+/g, "_");
    const user = { id: userId, name: usernameInput.trim() };
    
    setStudentUser(user);
    localStorage.setItem("crackcode_student_user", JSON.stringify(user));
    
    await mockDb.getProfile(user.id, user.name);
    await loadProfile(user.id);
    
    setShowAuthModal(false);
    setUsernameInput("");
  };

  const handleGoogleAuth = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } catch (e) {
        console.warn("Real Google login failed, running demo mode:", e);
        setShowGoogleChooser(true);
      }
    } else {
      setShowGoogleChooser(true);
    }
  };

  const handleSelectGoogleAccount = async (account) => {
    const user = { 
      id: account.email.replace(/[@.]/g, "_"), 
      name: account.name, 
      email: account.email 
    };
    
    setStudentUser(user);
    localStorage.setItem("crackcode_student_user", JSON.stringify(user));
    
    const p = await mockDb.getProfile(user.id, user.name);
    if (p.solved_count === 0 && p.streak === 0) {
      p.solved_count = account.solved;
      p.streak = account.streak;
      p.level = account.level;
      await mockDb.saveProfile(p);
    }
    
    await loadProfile(user.id);
    setShowGoogleChooser(false);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setStudentUser(null);
    setProfileData(null);
    localStorage.removeItem("crackcode_student_user");
    setShowAuthModal(true);
  };

  // Compile and Execute code locally (Run Code)
  const handleRunCode = async () => {
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }
    setRunLoading(true);
    setConsoleTab("console");
    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem: selectedProblem.description,
          customInput: traceInput,
          clientApiKey,
          action: "run"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setConsoleOutput(data);
      } else {
        alert(data.error || "Execution failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunLoading(false);
    }
  };

  // Submit code to Online Judge evaluation
  const handleSubmitCode = async () => {
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }
    setSubmitLoading(true);
    setShowSubmitModal(true);
    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem: selectedProblem.description,
          clientApiKey,
          action: "submit"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult(data);

        // Record submission in database
        const subStatus = data.status;
        await mockDb.saveSubmission(
          studentUser.id,
          selectedProblem.title,
          code,
          "C++",
          subStatus
        );
        loadSubmissions();
        loadProfile(studentUser.id);
      } else {
        alert(data.error || "Submission failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAnalyze = async (customTestInput = null) => {
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setIsPlaying(false);
    setCurrentStepIdx(0);
    setConsoleTab("tracer");

    const testInputToSend = customTestInput || traceInput;

    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem: selectedProblem.description,
          customInput: testInputToSend,
          clientApiKey,
          action: "analyze"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save trace metadata log
        await mockDb.saveSubmission(
          studentUser.id,
          selectedProblem.title,
          code,
          "C++",
          "Debug Mode"
        );
        loadSubmissions();

        if (data.socraticFeedback) {
          setAnalysisText(data.socraticFeedback.analysis);
          setEdgeCases(data.socraticFeedback.edgeCases || []);
          if (data.socraticFeedback.hints) {
            setHints(data.socraticFeedback.hints.map(h => ({ ...h, unlocked: false })));
          }
          setChatHistory((prev) => [
            ...prev,
            { role: "assistant", text: data.socraticFeedback.analysis }
          ]);
          setActiveTab("coach");
        }

        if (data.tracerData && data.tracerData.steps && data.tracerData.steps.length > 0) {
          setTracerData(data.tracerData);
          setCurrentStepIdx(0);
        }
      } else {
        alert(data.error || "Failed to analyze code");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while contacting Gemini backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem: selectedProblem.description,
          customInput: traceInput,
          clientApiKey,
          chatMessage: userMsg,
          history: chatHistory.slice(-6),
          action: "chat"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.socraticFeedback) {
          setChatHistory((prev) => [
            ...prev,
            { role: "assistant", text: data.socraticFeedback.analysis }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStressTest = async () => {
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }
    setStressLoading(true);
    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem: selectedProblem.description,
          clientApiKey,
          action: "stressTest"
        })
      });
      const data = await res.json();
      if (res.ok && data.stressTests) {
        setStressTests(data.stressTests);
        if (data.socraticFeedback && data.socraticFeedback.analysis) {
          setAnalysisText(data.socraticFeedback.analysis);
        }
      } else {
        alert(data.error || "Failed to generate stress tests");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStressLoading(false);
    }
  };

  const handleAnalyzeComplexity = async () => {
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }
    setOptLoading(true);
    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem: selectedProblem.description,
          clientApiKey,
          action: "optimize"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOptimizationData(data);
      } else {
        alert(data.error || "Failed to analyze complexity");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOptLoading(false);
    }
  };

  const handleRequestCustomTemplate = async () => {
    if (!templateCustomInput.trim()) return;
    setLoadingTemplate(true);
    try {
      const res = await fetch("/api/crack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: selectedProblem.description,
          customInput: templateCustomInput,
          clientApiKey,
          action: "customizeTemplate"
        })
      });
      const data = await res.json();
      if (res.ok && data.customTemplate) {
        setCode(data.customTemplate);
        setShowTemplateHub(false);
        setTemplateCustomInput("");
      } else {
        alert(data.error || "Failed to generate template");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const toggleHint = (index) => {
    setHints((prev) =>
      prev.map((h, i) => (i === index ? { ...h, unlocked: !h.unlocked } : h))
    );
  };

  const loadStressTestCase = (inputStr) => {
    setTraceInput(inputStr);
    setActiveTab("problem");
    handleAnalyze(inputStr);
  };

  // Filter 189 problems by query and tags
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prob.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || prob.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ["All", ...new Set(PROBLEMS_LIST.map((p) => p.category))];

  const currentStep = tracerData.steps[currentStepIdx] || {
    pointers: {},
    activeIndices: [],
    successIndices: [],
    message: "Trace indices ready."
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <div className="logo-text">CrackCode</div>
          <span className="badge">NextWave CP Judge</span>
        </div>

        {/* Dynamic Achievements HUD */}
        {profileData && (
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <div className="streak-indicator" title="Solve Streak">
              <Flame size={16} />
              <span>{profileData.streak} Day Streak</span>
            </div>
            
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Trophy size={14} style={{ color: "var(--accent-cyan)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                {profileData.solved_count} Solved
              </span>
            </div>

            <span className={`rank-badge ${profileData.level.toLowerCase().replace(" ", "_")}`}>
              {profileData.level}
            </span>
          </div>
        )}

        <div className="editor-actions" style={{ gap: "12px" }}>
          {/* Active Problem Selector Button */}
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowProblemListDropdown(!showProblemListDropdown)}
              style={{ fontSize: "0.85rem", gap: "6px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              <BookOpen size={14} />
              <span>Select Problem ({filteredProblems.length})</span>
            </button>

            {showProblemListDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "12px",
                  width: "360px",
                  boxShadow: "var(--shadow-glow)",
                  zIndex: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", background: "var(--bg-primary)", borderRadius: "4px", padding: "4px 8px", border: "1px solid var(--border-color)" }}>
                  <Search size={14} style={{ color: "var(--text-muted)", marginRight: "6px" }} />
                  <input
                    type="text"
                    placeholder="Search 189 DSA problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: "transparent", border: "none", color: "white", fontSize: "0.8rem", outline: "none", width: "100%" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ background: "var(--bg-tertiary)", color: "white", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.75rem", padding: "4px" }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    style={{ background: "var(--bg-tertiary)", color: "white", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.75rem", padding: "4px" }}
                  >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {filteredProblems.map((prob) => (
                    <div
                      key={prob.id}
                      onClick={() => {
                        setSelectedProblem(prob);
                        setShowProblemListDropdown(false);
                      }}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        background: selectedProblem.id === prob.id ? "rgba(0, 240, 255, 0.1)" : "transparent",
                        border: "1px solid",
                        borderColor: selectedProblem.id === prob.id ? "var(--accent-cyan)" : "transparent",
                        color: selectedProblem.id === prob.id ? "var(--accent-cyan)" : "var(--foreground)",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "220px" }}>
                        {prob.title}
                      </span>
                      <span style={{ fontSize: "0.65rem", color: prob.difficulty === "Easy" ? "var(--accent-green)" : prob.difficulty === "Medium" ? "var(--accent-amber)" : "var(--accent-rose)" }}>
                        {prob.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Template Hub Button */}
          <button
            className="btn btn-secondary"
            onClick={() => setShowTemplateHub(true)}
            style={{ padding: "6px 12px", fontSize: "0.85rem", gap: "6px" }}
          >
            <BookOpen size={14} />
            <span>Templates</span>
          </button>

          {/* User Auth Profile Button */}
          <button
            className="btn btn-secondary"
            onClick={() => {
              if (!studentUser) setShowAuthModal(true);
              else handleLogout();
            }}
            style={{ padding: "6px 12px", fontSize: "0.85rem", gap: "6px" }}
          >
            <User size={14} />
            <span>{studentUser ? studentUser.name : "Sign In"}</span>
            {studentUser && <LogOut size={12} style={{ marginLeft: "4px", opacity: 0.6 }} />}
          </button>

          {/* API Key settings panel */}
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{ padding: "6px 12px", fontSize: "0.85rem", gap: "6px" }}
            >
              <Settings size={14} />
              {clientApiKey ? "Key OK" : "Config Key"}
            </button>

            {showKeyInput && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "42px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "16px",
                  width: "280px",
                  boxShadow: "var(--shadow-glow)",
                  zIndex: 200
                }}
              >
                <h4 style={{ fontSize: "0.85rem", marginBottom: "8px" }}>
                  Gemini API Key configuration
                </h4>
                <input
                  type="password"
                  placeholder="Enter key (AI Studio)"
                  defaultValue={clientApiKey}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "white",
                    fontSize: "0.8rem",
                    marginBottom: "12px",
                    outline: "none"
                  }}
                />
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  {clientApiKey && (
                    <button
                      className="btn btn-text"
                      onClick={clearApiKey}
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      const input = e.target.parentElement.previousSibling;
                      saveApiKey(input.value);
                    }}
                    style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                  >
                    Save Key
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="workspace">
        
        {/* Left Panel: Problem, Coach Chat, Hints, Stress Tester, Complexity, History */}
        <div className="left-panel">
          <div className="tab-header" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            <button
              className={`tab-btn ${activeTab === "problem" ? "active" : ""}`}
              onClick={() => setActiveTab("problem")}
            >
              <Code size={14} style={{ marginRight: "6px" }} />
              Problem
            </button>
            <button
              className={`tab-btn ${activeTab === "coach" ? "active" : ""}`}
              onClick={() => setActiveTab("coach")}
            >
              <Flame size={14} style={{ marginRight: "6px" }} />
              Coach
            </button>
            <button
              className={`tab-btn ${activeTab === "hints" ? "active" : ""}`}
              onClick={() => setActiveTab("hints")}
            >
              <AlertTriangle size={14} style={{ marginRight: "6px" }} />
              Hints
            </button>
            <button
              className={`tab-btn ${activeTab === "stress" ? "active" : ""}`}
              onClick={() => setActiveTab("stress")}
            >
              <Layers size={14} style={{ marginRight: "6px" }} />
              Stress Test
            </button>
            <button
              className={`tab-btn ${activeTab === "optimize" ? "active" : ""}`}
              onClick={() => setActiveTab("optimize")}
            >
              <TrendingUp size={14} style={{ marginRight: "6px" }} />
              Optimize
            </button>
            <button
              className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <History size={14} style={{ marginRight: "6px" }} />
              History
            </button>
          </div>

          <div className="panel-content">
            {/* Tab: Problem Details */}
            {activeTab === "problem" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {generatingProblem ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: "12px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid var(--accent-cyan)", borderTopColor: "transparent", animation: "pulse 1.5s infinite" }}></div>
                    <span style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
                      AI Problem Setter generating challenge...
                    </span>
                  </div>
                ) : (
                  <div className="problem-card">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <h2 className="problem-title">{selectedProblem.title}</h2>
                      <span
                        className="badge"
                        style={{
                          borderColor: selectedProblem.difficulty === "Easy" ? "var(--accent-green)" : selectedProblem.difficulty === "Medium" ? "var(--accent-amber)" : "var(--accent-rose)",
                          color: selectedProblem.difficulty === "Easy" ? "var(--accent-green)" : selectedProblem.difficulty === "Medium" ? "var(--accent-amber)" : "var(--accent-rose)",
                          background: "transparent"
                        }}
                      >
                        {selectedProblem.difficulty}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                      <span>Category: {selectedProblem.category}</span>
                      <span>Time Limit: {selectedProblem.timeLimit}</span>
                    </div>

                    <p
                      className="problem-text"
                      style={{ whiteSpace: "pre-line" }}
                      dangerouslySetInnerHTML={{ __html: selectedProblem.description }}
                    />
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: "0.85rem", marginBottom: "8px", fontWeight: "600" }}>
                    Visualizer Trace Input (JSON format)
                  </h3>
                  <textarea
                    value={traceInput}
                    onChange={(e) => setTraceInput(e.target.value)}
                    style={{
                      width: "100%",
                      height: "80px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "var(--font-mono)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      padding: "10px",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab: Socratic Coach Chat */}
            {activeTab === "coach" && (
              <div className="chat-container">
                <div className="chat-messages">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`chat-bubble ${
                        msg.role === "user" ? "bubble-user" : "bubble-bot"
                      }`}
                    >
                      <div className="bubble-header">
                        {msg.role === "user" ? "You (Student)" : "AI Coach"}
                      </div>
                      <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                    </div>
                  ))}
                  {loading && (
                    <div className="chat-bubble bubble-bot" style={{ opacity: 0.7 }}>
                      <div className="bubble-header">AI Coach</div>
                      <p>Analyzing code execution and drafting feedback...</p>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                <div className="chat-input-area">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask the coach for a hint, explain step 3, etc."
                    className="chat-input"
                    disabled={loading}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                    style={{ padding: "8px 12px" }}
                    disabled={loading}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Hints & Edge Cases */}
            {activeTab === "hints" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>
                    🚨 Critical Edge Cases to Cover
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {edgeCases.map((edge, i) => (
                      <span key={i} className="edge-case-badge">
                        <AlertTriangle size={12} />
                        {edge}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>
                    🎓 Socratic Hints (Lockable)
                  </h3>
                  <div className="hint-container">
                    {hints.map((hint, i) => (
                      <div
                        key={i}
                        className={`hint-card ${!hint.unlocked ? "locked" : ""}`}
                      >
                        <div className="hint-header" onClick={() => toggleHint(i)}>
                          <span>{hint.title}</span>
                          {hint.unlocked ? (
                            <Unlock size={14} style={{ color: "var(--accent-green)" }} />
                          ) : (
                            <Lock size={14} style={{ color: "var(--text-muted)" }} />
                          )}
                        </div>
                        {hint.unlocked && (
                          <div className="hint-content">
                            <p>{hint.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Stress Tester */}
            {activeTab === "stress" && (
              <div className="stress-tester-container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>🚀 Stress Tester</h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      AI compiles and stress tests your code against edge cases.
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleGenerateStressTest}
                    disabled={stressLoading}
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                  >
                    <Sparkles size={14} />
                    {stressLoading ? "Testing..." : "Generate Cases"}
                  </button>
                </div>

                <div className="stress-test-grid">
                  {stressTests.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0", fontSize: "0.85rem" }}>
                      No stress tests generated yet. Click above to analyze potential failure points.
                    </div>
                  ) : (
                    stressTests.map((t, idx) => (
                      <div
                        key={idx}
                        className={`stress-card ${t.status === "Failed" ? "failed" : "passed"}`}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "white" }}>
                            Case #{idx + 1}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              color: t.status === "Failed" ? "var(--accent-rose)" : "var(--accent-green)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {t.status === "Failed" ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                            {t.status === "Failed" ? "Bug Spotted" : "Passed"}
                          </span>
                        </div>

                        <div className="stress-io-grid">
                          <div className="stress-io-box">
                            <div className="stress-io-title">Input Case</div>
                            <div style={{ whiteSpace: "pre-line", color: "var(--text-muted)" }}>{t.input}</div>
                          </div>
                          <div className="stress-io-box">
                            <div className="stress-io-title">Expected vs Got</div>
                            <div>
                              <span style={{ color: "var(--accent-green)" }}>{t.expectedOutput}</span>
                              <span style={{ color: "var(--text-muted)" }}> | </span>
                              <span style={{ color: "var(--accent-rose)" }}>{t.buggyOutput}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: "0.8rem", marginTop: "10px", color: "var(--foreground)", background: "rgba(0,0,0,0.2)", padding: "6px 8px", borderRadius: "4px" }}>
                          {t.explanation}
                        </div>

                        <button
                          className="btn btn-secondary"
                          onClick={() => loadStressTestCase(t.input)}
                          style={{ width: "100%", fontSize: "0.75rem", padding: "4px 0", marginTop: "10px" }}
                        >
                          <Eye size={12} />
                          Load & Trace in Visualizer
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab: Complexity & Optimization */}
            {activeTab === "optimize" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>📈 Time Complexity Optimizer</h3>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Identify asymptotic bottleneck and view optimization pathways.
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleAnalyzeComplexity}
                    disabled={optLoading}
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                  >
                    <Cpu size={14} />
                    {optLoading ? "Estimating..." : "Analyze Asymptotics"}
                  </button>
                </div>

                {optimizationData ? (
                  <>
                    <div className="complexity-grid">
                      <div className="complexity-card">
                        <div className="complexity-label">Current Complexity</div>
                        <div className="complexity-value">{optimizationData.currentComplexity?.time || "O(N²)"}</div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          Space: {optimizationData.currentComplexity?.space || "O(1)"}
                        </span>
                      </div>
                      <div className="complexity-card optimal">
                        <div className="complexity-label">Optimal Complexity</div>
                        <div className="complexity-value">{optimizationData.optimalComplexity?.time || "O(N)"}</div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          Space: {optimizationData.optimalComplexity?.space || "O(N)"}
                        </span>
                      </div>
                    </div>

                    <div className="problem-card">
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>AI Socratic Analysis</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                        {optimizationData.socraticFeedback?.analysis}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px" }}>Optimization Steps</h4>
                      <div className="opt-route-list">
                        {(optimizationData.optimizationRoute || []).map((step, idx) => (
                          <div key={idx} className="opt-route-item">
                            <span className="opt-route-step">{idx + 1}</span>
                            <span style={{ color: "var(--foreground)", fontSize: "0.8rem" }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {optimizationData.optimizedSkeleton && (
                      <div>
                        <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "6px" }}>Optimized Structure Boilerplate</h4>
                        <pre style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px", fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent-purple)", overflowX: "auto" }}>
                          {optimizationData.optimizedSkeleton}
                        </pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0", fontSize: "0.85rem" }}>
                    Click 'Analyze Asymptotics' to evaluate code growth complexity.
                  </div>
                )}
              </div>
            )}

            {/* Tab: Submissions history */}
            {activeTab === "history" && (
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px" }}>
                  💾 Solve Submission History
                </h3>
                {submissionsList.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "24px" }}>
                    No successful solves logged yet. Correct solves will update your score.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {submissionsList.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setCode(sub.code)}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "6px",
                          padding: "10px 12px",
                          cursor: "pointer",
                          transition: "border-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-cyan)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                            {sub.problem_id}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              color: sub.status === "Accepted" || sub.status === "Correct" ? "var(--accent-green)" : "var(--accent-cyan)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {sub.status === "Accepted" || sub.status === "Correct" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            {sub.status}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          <span>Lang: {sub.language}</span>
                          <span>{new Date(sub.created_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Monaco Editor & Visual Tracer */}
        <div className="right-panel">
          
          {/* Editor Workspace */}
          <div className="editor-container">
            <div className="editor-header">
              <div className="editor-title">
                <Code size={16} />
                <span>solution.cpp (C++)</span>
              </div>
            </div>

            {/* Monaco React Editor */}
            <div style={{ flex: 1, width: "100%", height: "100%" }}>
              <Editor
                height="100%"
                language="cpp"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val)}
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Geist Mono', monospace",
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 12 },
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on"
                }}
              />
            </div>

            {/* Bottom Actions Control Bar (LeetCode Style) */}
            <div
              style={{
                height: "44px",
                background: "var(--bg-secondary)",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
                zIndex: 10
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setConsoleTab(consoleTab === "console" ? "tracer" : "console")}
                style={{ padding: "5px 10px", fontSize: "0.75rem", gap: "4px" }}
              >
                <Terminal size={12} />
                <span>Console Log</span>
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn"
                  onClick={handleRunCode}
                  disabled={runLoading || loading}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--border-color)",
                    color: "white",
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    fontWeight: "600"
                  }}
                >
                  {runLoading ? "Running..." : "Run Code"}
                </button>

                <button
                  className="btn"
                  onClick={handleSubmitCode}
                  disabled={submitLoading || loading}
                  style={{
                    background: "var(--accent-green)",
                    color: "#0b0f19",
                    padding: "5px 14px",
                    fontSize: "0.75rem",
                    fontWeight: "700"
                  }}
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => handleAnalyze()}
                  disabled={loading}
                  style={{ padding: "5px 12px", fontSize: "0.75rem", gap: "4px" }}
                >
                  <Sparkles size={12} />
                  <span>Analyze & Trace</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Algorithm Tracer / Output Console Tab Drawer */}
          <div className="viz-panel" style={{ gridTemplateRows: "44px 1fr" }}>
            <div className="viz-header">
              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  className={`tab-btn ${consoleTab === "tracer" ? "active" : ""}`}
                  onClick={() => setConsoleTab("tracer")}
                  style={{ padding: "8px 12px", fontSize: "0.75rem", borderBottomWidth: "2px" }}
                >
                  <Eye size={12} style={{ marginRight: "4px" }} />
                  Algorithm Visualizer
                </button>
                <button
                  className={`tab-btn ${consoleTab === "console" ? "active" : ""}`}
                  onClick={() => setConsoleTab("console")}
                  style={{ padding: "8px 12px", fontSize: "0.75rem", borderBottomWidth: "2px" }}
                >
                  <Terminal size={12} style={{ marginRight: "4px" }} />
                  Sandbox Output Console
                </button>
              </div>
              
              {/* Playback controls (Visible only on Tracer tab) */}
              {consoleTab === "tracer" && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Step {currentStepIdx + 1} / {tracerData.steps.length}
                  </span>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx((p) => Math.max(0, p - 1));
                      }}
                      style={{ padding: "3px 6px" }}
                      disabled={currentStepIdx === 0}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsPlaying(!isPlaying)}
                      style={{ padding: "3px 6px", borderColor: isPlaying ? "var(--accent-cyan)" : "transparent" }}
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx((p) => Math.min(tracerData.steps.length - 1, p + 1));
                      }}
                      style={{ padding: "3px 6px" }}
                      disabled={currentStepIdx === tracerData.steps.length - 1}
                    >
                      <ChevronRight size={14} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx(0);
                      }}
                      style={{ padding: "3px 6px" }}
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="viz-body">
              {/* Tab: Algorithm Tracer */}
              {consoleTab === "tracer" && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "16px",
                      right: "16px",
                      background: "rgba(11, 15, 25, 0.9)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--accent-cyan)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "var(--shadow-glow)",
                      zIndex: 10
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--accent-cyan)",
                        animation: isPlaying ? "pulse 1.5s infinite" : "none"
                      }}
                    />
                    <span>{currentStep.message}</span>
                  </div>

                  <div style={{ marginTop: "40px", width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
                    {tracerData.structureType === "array" && (
                      <div className="array-container">
                        {tracerData.initialState.map((val, idx) => {
                          const isActive = currentStep.activeIndices?.includes(idx);
                          const isSuccess = currentStep.successIndices?.includes(idx);
                          
                          const activePointers = [];
                          if (currentStep.pointers) {
                            Object.entries(currentStep.pointers).forEach(([name, pos]) => {
                              if (Number(pos) === idx) activePointers.push(name);
                            });
                          }

                          return (
                            <div
                              key={idx}
                              className={`array-box ${isActive ? "active" : ""} ${isSuccess ? "success" : ""}`}
                              style={{ transform: isActive ? "scale(1.08)" : "scale(1.0)" }}
                            >
                              {activePointers.map((ptrName, pIdx) => (
                                <span
                                  key={ptrName}
                                  className="pointer-label"
                                  style={{ top: `-${26 + pIdx * 18}px` }}
                                >
                                  {ptrName}
                                </span>
                              ))}
                              <span>{val}</span>
                              <span className="array-index">idx: {idx}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {tracerData.structureType === "grid" && (
                      <div className="grid-container">
                        {tracerData.initialState.map((rowVal, rIdx) => (
                          <div key={rIdx} className="grid-row">
                            {rowVal.map((val, cIdx) => {
                              const isActive = currentStep.activeIndices?.some(coord => coord[0] === rIdx && coord[1] === cIdx);
                              const isSuccess = currentStep.successIndices?.some(coord => coord[0] === rIdx && coord[1] === cIdx);
                              
                              const activePointers = [];
                              if (currentStep.pointers) {
                                Object.entries(currentStep.pointers).forEach(([name, pos]) => {
                                  if (pos && typeof pos === "object" && pos.row === rIdx && pos.col === cIdx) {
                                    activePointers.push(name);
                                  }
                                });
                              }

                              return (
                                <div
                                  key={cIdx}
                                  className={`grid-cell ${isActive ? "active" : ""} ${isSuccess ? "success" : ""}`}
                                >
                                  {activePointers.map((ptrName, pIdx) => (
                                    <span
                                      key={ptrName}
                                      className="grid-cell-pointer"
                                      style={{ top: `-${14 + pIdx * 14}px` }}
                                    >
                                      {ptrName}
                                    </span>
                                  ))}
                                  <span>{val}</span>
                                  <span style={{ fontSize: "0.55rem", position: "absolute", bottom: "1px", right: "2px", opacity: 0.4 }}>
                                    {rIdx},{cIdx}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}

                    {tracerData.structureType === "list" && (
                      <div className="variables-inspector">
                        {Object.entries(currentStep.pointers || {}).map(([varName, varVal]) => (
                          <div key={varName} className="variable-card active">
                            <span className="variable-name">{varName}</span>
                            <span className="variable-value">
                              {typeof varVal === "object" ? JSON.stringify(varVal) : String(varVal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tab: Sandbox Output Console */}
              {consoleTab === "console" && (
                <div style={{ width: "100%", height: "100%", padding: "12px", fontFamily: "var(--font-mono)", fontSize: "0.85rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                    <span>Execution Status: <strong style={{ color: consoleOutput.status === "Success" ? "var(--accent-green)" : "var(--accent-rose)" }}>{consoleOutput.status}</strong></span>
                    <span style={{ color: "var(--text-muted)" }}>C++ compiler sandbox v1.0</span>
                  </div>

                  {consoleOutput.compileOutput && (
                    <div style={{ background: "rgba(244, 63, 94, 0.05)", border: "1px solid var(--accent-rose)", padding: "10px", borderRadius: "6px", color: "var(--accent-rose)", whiteSpace: "pre-wrap" }}>
                      <strong>Compiler Diagnostics:</strong><br />
                      {consoleOutput.compileOutput}
                    </div>
                  )}

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>[Standard Output (stdout)]</span>
                      <pre style={{ background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "6px", minHeight: "60px", color: "white", marginTop: "4px" }}>
                        {consoleOutput.stdout || "(no stdout)"}
                      </pre>
                    </div>

                    <div>
                      <span style={{ color: "var(--text-muted)" }}>[Function Return Value]</span>
                      <pre style={{ background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: "6px", color: "var(--accent-cyan)", marginTop: "4px" }}>
                        {consoleOutput.returnValue !== undefined ? String(consoleOutput.returnValue) : "(null)"}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Slide-out CP Template Drawer */}
      {showTemplateHub && (
        <>
          <div className="template-drawer-overlay" onClick={() => setShowTemplateHub(false)} />
          <div className="template-drawer">
            <div className="template-drawer-header">
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={18} style={{ color: "var(--accent-purple)" }} />
                Boilerplate Library
              </h3>
              <button className="btn btn-text" onClick={() => setShowTemplateHub(false)}>✕</button>
            </div>
            
            <div className="template-drawer-body">
              <div>
                <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600" }}>
                  Standard Boilerplates
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {PRESETS_TEMPLATES.map((t) => (
                    <div
                      key={t.id}
                      className="template-card"
                      onClick={() => {
                        setCode(t.code);
                        setShowTemplateHub(false);
                      }}
                    >
                      <h5 style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--accent-cyan)", marginBottom: "4px" }}>
                        {t.name}
                      </h5>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "8px" }}>
                <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600" }}>
                  AI Custom Boilerplate Generator
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                  Describe the structure you need, and the AI will configure the C++ struct.
                </p>
                <textarea
                  value={templateCustomInput}
                  onChange={(e) => setTemplateCustomInput(e.target.value)}
                  placeholder="e.g. Segment tree for Range Minimum Query with point update operations"
                  style={{
                    width: "100%",
                    height: "80px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "white",
                    padding: "8px 10px",
                    fontSize: "0.8rem",
                    outline: "none",
                    resize: "none",
                    marginBottom: "10px"
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleRequestCustomTemplate}
                  disabled={loadingTemplate || !templateCustomInput.trim()}
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem" }}
                >
                  <Sparkles size={14} />
                  {loadingTemplate ? "Configuring Struct..." : "Generate Custom Struct"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Online Judge Submission Verdict Modal */}
      {showSubmitModal && (
        <div className="google-chooser-overlay" style={{ zIndex: 450 }}>
          <div className="google-chooser-modal" style={{ width: "450px", background: "var(--bg-secondary)", color: "white", border: "1px solid var(--border-color)" }}>
            <div className="google-chooser-header" style={{ textAlign: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              {submitLoading ? (
                <>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "3px solid var(--accent-amber)", borderTopColor: "transparent", animation: "spin 1s linear infinite", margin: "0 auto 10px" }}></div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--accent-amber)" }}>Evaluating Solution...</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Running compiled code against test suites</p>
                </>
              ) : (
                <>
                  {submitResult.status === "Accepted" ? (
                    <Award size={36} style={{ color: "var(--accent-green)", margin: "0 auto 10px" }} />
                  ) : (
                    <AlertTriangle size={36} style={{ color: "var(--accent-rose)", margin: "0 auto 10px" }} />
                  )}
                  <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: submitResult.status === "Accepted" ? "var(--accent-green)" : "var(--accent-rose)" }}>
                    {submitResult.status}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Submission Score: <strong>{submitResult.score}/100</strong>
                  </p>
                </>
              )}
            </div>

            {!submitLoading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "10px 0" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600" }}>Test Case Diagnostics</span>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
                  {(submitResult.testCases || []).map((t, idx) => (
                    <div key={idx} style={{ background: "var(--bg-primary)", padding: "8px 12px", borderRadius: "6px", border: "1px solid", borderColor: t.passed ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", textAlign: "left", gap: "2px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>Test Case #{idx + 1}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Input: {t.input}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Got: {t.got}</span>
                        {t.passed ? (
                          <CheckCircle2 size={14} style={{ color: "var(--accent-green)" }} />
                        ) : (
                          <XCircle size={14} style={{ color: "var(--accent-rose)" }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid var(--border-color)", textAlign: "left" }}>
                  {submitResult.feedback}
                </div>
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowSubmitModal(false)}
                disabled={submitLoading}
                style={{ fontSize: "0.8rem", padding: "6px 14px" }}
              >
                Close Verdict
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Auth Login / Signup Modal */}
      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: "800", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                CrackCode CP Coach
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Sign in to save solves, check streaks, and unlock rank level badges.
              </p>
            </div>

            <div className="auth-tabs">
              <button
                className={`auth-tab-btn ${authTab === "login" ? "active" : ""}`}
                onClick={() => setAuthTab("login")}
              >
                Log In
              </button>
              <button
                className={`auth-tab-btn ${authTab === "signup" ? "active" : ""}`}
                onClick={() => setAuthTab("signup")}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="auth-input-group">
                <label>Competitive Programmer Alias / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tourist_NextWave"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div className="auth-input-group">
                <label>Password (Mock Credentials)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="auth-input"
                  defaultValue="123456"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 0", marginTop: "6px" }}>
                {authTab === "login" ? "Enter Dashboard" : "Create CP Profile"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", margin: "10px 0", width: "100%" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
              <span style={{ padding: "0 10px", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
            </div>

            <button
              type="button"
              className="btn btn-google"
              onClick={handleGoogleAuth}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      )}

      {/* Google Account Chooser Simulation Overlay */}
      {showGoogleChooser && (
        <div className="google-chooser-overlay">
          <div className="google-chooser-modal">
            <div className="google-chooser-header">
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: "8px" }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Choose an account</h3>
              <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>to continue to CrackCode</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {MOCK_GOOGLE_ACCOUNTS.map((acc) => (
                <div 
                  key={acc.email} 
                  className="google-account-item"
                  onClick={() => handleSelectGoogleAccount(acc)}
                >
                  <div className="google-avatar">{acc.avatar}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{acc.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{acc.email}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-text" 
              onClick={() => setShowGoogleChooser(false)}
              style={{ marginTop: "10px", fontSize: "0.8rem", color: "#4b5563" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
