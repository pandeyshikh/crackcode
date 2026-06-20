import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize Supabase if variables are configured, otherwise fallback to local-storage mocking.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock database service that mimics Supabase database operations using localStorage
export const mockDb = {
  async getSubmissions(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const data = localStorage.getItem(`crackcode_submissions_${userId}`) || "[]";
      return JSON.parse(data);
    }
  },

  async saveSubmission(userId, problemId, code, language, status) {
    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: userId,
      problem_id: problemId,
      code,
      language,
      status,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("submissions")
        .insert([newRecord])
        .select();
      if (error) throw error;
      
      // Update statistics in background if status is Correct
      if (status === "Correct") {
        await this.updateProfileStats(userId);
      }
      return data[0];
    } else {
      const existing = await this.getSubmissions(userId);
      const updated = [newRecord, ...existing];
      localStorage.setItem(`crackcode_submissions_${userId}`, JSON.stringify(updated));
      
      if (status === "Correct" || status === "Debug Mode") {
        await this.updateProfileStats(userId);
      }
      return newRecord;
    }
  },

  async getProfile(userId, defaultName = "Student") {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error && error.code !== "PGRST116") throw error; // PGRST116 is code for no rows returned
      if (data) return data;
    }
    
    // LocalStorage fallback
    const key = `crackcode_profile_${userId}`;
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      const defaultProfile = {
        id: userId,
        name: defaultName,
        solved_count: 0,
        streak: 0,
        level: "Pupil",
        last_solve_date: null
      };
      localStorage.setItem(key, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
  },

  async saveProfile(profile) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(profile)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      localStorage.setItem(`crackcode_profile_${profile.id}`, JSON.stringify(profile));
      return profile;
    }
  },

  async updateProfileStats(userId) {
    const profile = await this.getProfile(userId);
    profile.solved_count = (profile.solved_count || 0) + 1;
    
    const todayStr = new Date().toISOString().split("T")[0];
    if (!profile.last_solve_date) {
      profile.streak = 1;
    } else {
      const lastSolve = new Date(profile.last_solve_date);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today - lastSolve);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        profile.streak = (profile.streak || 0) + 1;
      } else if (diffDays > 1) {
        profile.streak = 1; // Streak broken
      }
      // If diffDays is 0 (already solved today), streak stays the same
    }
    profile.last_solve_date = todayStr;

    // Recalculate level based on solved count
    const solved = profile.solved_count;
    if (solved >= 10) {
      profile.level = "Grandmaster";
    } else if (solved >= 6) {
      profile.level = "Candidate Master";
    } else if (solved >= 3) {
      profile.level = "Specialist";
    } else {
      profile.level = "Pupil";
    }

    await this.saveProfile(profile);
    return profile;
  }
};

