"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { mockDb, isSupabaseConfigured } from "./lib/supabase";
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
  Layers
} from "lucide-react";

// Pre-defined CP problems for NextWave students
const PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum (Sorted Array)",
    difficulty: "Easy",
    timeLimit: "1.0s",
    memoryLimit: "256MB",
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.
    
Return the indices of the two numbers, \`[index1, index2]\`, added by one as an integer array of length 2.

Your solution must use only **O(1) extra space** and run in **O(N) time** complexity.`,
    sampleInput: "[2, 7, 11, 15], target = 9",
    defaultCode: `#include <vector>
#include <iostream>
using namespace std;

// Find two indices that sum to target
vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;
    
    while (left < right) {
        int current_sum = numbers[left] + numbers[right];
        if (current_sum == target) {
            return {left + 1, right + 1}; // 1-indexed return
        }
        if (current_sum < target) {
            left++; // Bug: What if pointers are handled incorrectly?
        } else {
            right--;
        }
    }
    return {};
}`,
    defaultTraceInput: `{"initialState": [2, 7, 11, 15], "target": 9}`
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    timeLimit: "0.5s",
    memoryLimit: "128MB",
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log N)** runtime complexity.`,
    sampleInput: "[-1, 0, 3, 5, 9, 12], target = 9",
    defaultCode: `#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    // Bug: Standard binary search loop condition
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        }
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    defaultTraceInput: `{"initialState": [-1, 0, 3, 5, 9, 12], "target": 9}`
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number (Recursion + Memo)",
    difficulty: "Easy",
    timeLimit: "1.0s",
    memoryLimit: "256MB",
    description: `The Fibonacci numbers, commonly denoted \`F(n)\`, form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.
    
Compute \`F(n)\`. Solve this using **recursion with memoization** to avoid the exponential O(2^N) complexity bottleneck and reduce it to **O(N)**.`,
    sampleInput: "n = 6",
    defaultCode: `#include <vector>
using namespace std;

int fibHelper(int n, vector<int>& memo) {
    if (n <= 1) return n;
    
    if (memo[n] != -1) return memo[n];
    
    // Buggy recursion without memo storage:
    return fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
}

int fib(int n) {
    vector<int> memo(n + 1, -1);
    return fibHelper(n, memo);
}`,
    defaultTraceInput: `{"initialState": [0, 1, 1, 2, 3, 5, 8], "n": 6}`
  }
];

const PRESETS_TEMPLATES = [
  {
    id: "dsu",
    name: "Disjoint Set Union (DSU)",
    description: "Standard DSU boilerplate with Path Compression and Union by Rank.",
    code: `struct DSU {
    vector<int> parent, rank;
    DSU(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for(int i=0; i<n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i)
            return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            if (rank[root_i] < rank[root_j])
                swap(root_i, root_j);
            parent[root_j] = root_i;
            if (rank[root_i] == rank[root_j])
                rank[root_i]++;
        }
    }
};`
  },
  {
    id: "segtree",
    name: "Segment Tree",
    description: "Standard Segment tree for Range Sum query, point updates.",
    code: `struct SegTree {
    int size;
    vector<long long> sums;
    void init(int n) {
        size = 1;
        while(size < n) size *= 2;
        sums.assign(2 * size, 0LL);
    }
    void build(vector<int>& a, int x, int lx, int rx) {
        if (rx - lx == 1) {
            if (lx < (int)a.size()) sums[x] = a[lx];
            return;
        }
        int m = (lx + rx) / 2;
        build(a, 2 * x + 1, lx, m);
        build(a, 2 * x + 2, m, rx);
        sums[x] = sums[2 * x + 1] + sums[2 * x + 2];
    }
    void set(int i, int v, int x, int lx, int rx) {
        if (rx - lx == 1) {
            sums[x] = v;
            return;
        }
        int m = (lx + rx) / 2;
        if (i < m) set(i, v, 2 * x + 1, lx, m);
        else set(i, v, 2 * x + 2, m, rx);
        sums[x] = sums[2 * x + 1] + sums[2 * x + 2];
    }
    long long sum(int l, int r, int x, int lx, int rx) {
        if (lx >= r || l >= rx) return 0;
        if (lx >= l && rx <= r) return sums[x];
        int m = (lx + rx) / 2;
        return sum(l, r, 2 * x + 1, lx, m) + sum(l, r, 2 * x + 2, m, rx);
    }
};`
  },
  {
    id: "dijkstra",
    name: "Dijkstra Shortest Path",
    description: "C++ Dijkstra template using std::priority_queue.",
    code: `vector<long long> dijkstra(int start, int n, vector<vector<pair<int, int>>>& adj) {
    vector<long long> dist(n, 1e18); // Infinity
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while(!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        for(auto& edge : adj[u]) {
            int v = edge.first;
            int w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
};`
  }
];

export default function CrackCodeDashboard() {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [code, setCode] = useState(selectedProblem.defaultCode);
  const [traceInput, setTraceInput] = useState(selectedProblem.defaultTraceInput);
  const [activeTab, setActiveTab] = useState("problem"); // problem, coach, hints, stress, optimize, history
  const [clientApiKey, setClientApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Authentication & Stats States
  const [studentUser, setStudentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [authTab, setAuthTab] = useState("login"); // login / signup
  const [submissionsList, setSubmissionsList] = useState([]);

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
    { title: "Hint 1: Logic & Approach", content: "To solve this in O(N) time with O(1) space, look into the two-pointer technique on sorted arrays.", unlocked: false },
    { title: "Hint 2: Edge Case & Bug Spotting", "content": "Think about whether left and right pointers can cross or access out-of-bound indexes.", unlocked: false },
    { title: "Hint 3: Optimization & Fix", "content": "Check your update criteria inside the loop to make sure pointers move in the correct direction.", unlocked: false }
  ]);

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
      // Auto open auth modal for first time guests
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

  // Sync editor code when problem changes
  useEffect(() => {
    setCode(selectedProblem.defaultCode);
    setTraceInput(selectedProblem.defaultTraceInput);
    setStressTests([]);
    setOptimizationData(null);
    
    try {
      const parsed = JSON.parse(selectedProblem.defaultTraceInput);
      setTracerData({
        structureType: "array",
        initialState: parsed.initialState || [2, 7, 11, 15],
        steps: [
          {
            pointers: { left: 0, right: (parsed.initialState?.length || 4) - 1 },
            activeIndices: [0, (parsed.initialState?.length || 4) - 1],
            successIndices: [],
            message: "Ready to run dry-run trace simulation."
          }
        ]
      });
      setCurrentStepIdx(0);
    } catch (e) {
      // fallback
    }
  }, [selectedProblem]);

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
    
    // Creates or gets existing profile
    await mockDb.getProfile(user.id, user.name);
    await loadProfile(user.id);
    
    setShowAuthModal(false);
    setUsernameInput("");
  };

  const handleLogout = () => {
    setStudentUser(null);
    setProfileData(null);
    localStorage.removeItem("crackcode_student_user");
    setShowAuthModal(true);
  };

  const handleAnalyze = async (customTestInput = null) => {
    if (!studentUser) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setIsPlaying(false);
    setCurrentStepIdx(0);

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
        // Save submission history
        const hasCorrectState = data.tracerData?.steps?.some(s => s.successIndices && s.successIndices.length > 0);
        const subStatus = hasCorrectState ? "Correct" : "Debug Mode";

        await mockDb.saveSubmission(
          studentUser.id,
          selectedProblem.title,
          code,
          "C++",
          subStatus
        );
        loadSubmissions();
        loadProfile(studentUser.id); // Reload streak and points

        // Update analysis feedback
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

        // Update visualization trace data
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
          <span className="badge">NextWave CP Coach</span>
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
          <div style={{ position: "relative" }}>
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
          </div>

          {/* Preset Problem Selector */}
          <select
            value={selectedProblem.id}
            onChange={(e) =>
              setSelectedProblem(PROBLEMS.find((p) => p.id === e.target.value))
            }
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--foreground)",
              border: "1px solid var(--border-color)",
              padding: "6px 12px",
              borderRadius: "6px",
              outline: "none",
              cursor: "pointer",
              fontSize: "0.85rem"
            }}
          >
            {PROBLEMS.map((prob) => (
              <option key={prob.id} value={prob.id}>
                {prob.title} ({prob.difficulty})
              </option>
            ))}
          </select>

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
              Solved
            </button>
          </div>

          <div className="panel-content">
            {/* Tab: Problem Details */}
            {activeTab === "problem" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="problem-card">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <h2 className="problem-title">{selectedProblem.title}</h2>
                    <span
                      className="badge"
                      style={{
                        borderColor: selectedProblem.difficulty === "Easy" ? "var(--accent-green)" : "var(--accent-amber)",
                        color: selectedProblem.difficulty === "Easy" ? "var(--accent-green)" : "var(--accent-amber)",
                        background: "transparent"
                      }}
                    >
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                    <span>Time Limit: {selectedProblem.timeLimit}</span>
                    <span>Memory Limit: {selectedProblem.memoryLimit}</span>
                  </div>

                  <p
                    className="problem-text"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: selectedProblem.description }}
                  />
                </div>

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
                          <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{sub.problem_id}</span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              color: sub.status === "Correct" ? "var(--accent-green)" : "var(--accent-cyan)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {sub.status === "Correct" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
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
              <div className="editor-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAnalyze()}
                  disabled={loading}
                >
                  <Sparkles size={16} />
                  {loading ? "Analyzing..." : "Analyze & Trace Code"}
                </button>
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
          </div>

          {/* Visual Algorithm Tracer Drawer */}
          <div className="viz-panel">
            <div className="viz-header">
              <div className="viz-title">
                <Eye size={14} />
                <span>Visual Algorithm Tracer (C++ Debug Mode)</span>
              </div>
              
              {/* Playback controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Step indicator */}
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Step {currentStepIdx + 1} / {tracerData.steps.length}
                </span>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx((p) => Math.max(0, p - 1));
                    }}
                    style={{ padding: "4px 8px" }}
                    disabled={currentStepIdx === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ padding: "4px 8px", borderColor: isPlaying ? "var(--accent-cyan)" : "transparent" }}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx((p) => Math.min(tracerData.steps.length - 1, p + 1));
                    }}
                    style={{ padding: "4px 8px" }}
                    disabled={currentStepIdx === tracerData.steps.length - 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIdx(0);
                    }}
                    style={{ padding: "4px 8px" }}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="viz-body">
              {/* Floating debug text */}
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

              {/* Dynamic visualizer canvas */}
              <div style={{ marginTop: "40px", width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
                {/* 1D Array visualization */}
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

                {/* 2D Grid Matrix visualization */}
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

                {/* General stack trace / list visualization */}
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
              {/* Preset templates list */}
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

              {/* Custom AI generator */}
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
          </div>
        </div>
      )}

    </div>
  );
}
