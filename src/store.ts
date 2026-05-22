import { configureStore } from '@reduxjs/toolkit'

import dashboardSliced from './slices/dashboard.slice';
import quizSliced from './slices/quiz.slice';
import leaderboardSliced from './slices/leaderboard.slice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardSliced,
    quiz: quizSliced,
    leaderboard: leaderboardSliced
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch