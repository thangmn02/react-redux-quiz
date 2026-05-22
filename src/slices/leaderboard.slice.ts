import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface LeaderboardEntry {
  firstName: string;
  lastName: string;
  email: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface LeaderboardState {
  entries: LeaderboardEntry[];
}

const loadLeaderboardFromLocalStorage = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem('leaderboard');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse leaderboard from localStorage', e);
  }
  return [];
}

const initialState: LeaderboardState = {
  entries: loadLeaderboardFromLocalStorage()
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    addLeaderboardEntry: (state, action: PayloadAction<LeaderboardEntry>) => {
      state.entries.push(action.payload);
      // Sort in descending order of score ratio (percentage of correct answers)
      state.entries.sort((a, b) => {
        const percentA = a.totalQuestions > 0 ? (a.score / a.totalQuestions) : 0;
        const percentB = b.totalQuestions > 0 ? (b.score / b.totalQuestions) : 0;
        if (percentB !== percentA) {
          return percentB - percentA;
        }
        return b.score - a.score;
      });
      try {
        localStorage.setItem('leaderboard', JSON.stringify(state.entries));
      } catch (e) {
        console.error('Failed to save leaderboard to localStorage', e);
      }
    }
  }
})

export const { addLeaderboardEntry } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
