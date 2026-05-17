import { configureStore } from '@reduxjs/toolkit'

import dashboardSliced from './slices/dashboard.slice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardSliced
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch