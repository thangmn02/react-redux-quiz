import { createSlice} from '@reduxjs/toolkit'

export interface DashboardState {
  category: string,
  difficulty: string,
  type: string,
  amount: number
}

const initialState: DashboardState = {
  category: '',
  difficulty: '',
  type: '',
  amount: 0
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    settingQuestion: (state, action) => {
      state.category = action.payload.category;
      state.difficulty = action.payload.difficulty;
      state.type = action.payload.type;
      state.amount = action.payload.amount
    }
  }
})

export const { settingQuestion } = dashboardSlice.actions;

export default dashboardSlice.reducer;
