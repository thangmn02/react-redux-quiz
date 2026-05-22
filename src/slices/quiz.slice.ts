import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { IResult } from '../types/question.type'
import type { IPayloadSettingQuestion } from '../types/dashboard.type'

export interface QuizState {
  questions: IResult[];
  currentQuestionIndex: number;
  score: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  status: 'idle',
  error: null
}

export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (settings: IPayloadSettingQuestion, { rejectWithValue }) => {
    try {
      const { category, difficulty, type, amount } = settings;
      const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`);
      if (!res.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await res.json();
      if (data.response_code !== 0) {
        throw new Error('Could not find enough questions for these settings. Please try a different setup.');
      }
      return data.results as IResult[];
    } catch (e: any) {
      return rejectWithValue(e.message || 'Failed to fetch questions');
    }
  }
)

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    answerQuestion: (state, action: PayloadAction<{ selectedAnswer: string }>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion) {
        if (action.payload.selectedAnswer === currentQuestion.correct_answer) {
          state.score += 1;
        }
        state.currentQuestionIndex += 1;
      }
    },
    skipQuestion: (state) => {
      state.currentQuestionIndex += 1;
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  }
})

export const { answerQuestion, skipQuestion, resetQuiz } = quizSlice.actions;

export default quizSlice.reducer;
