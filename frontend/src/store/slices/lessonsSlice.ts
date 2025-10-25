import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Lesson } from '../../types/lesson'
import { getLessonsByCourseId } from '../../services/lessonService'

interface LessonsState {
  lessonsByCourse: Record<number, Lesson[]>
  loading: boolean
  error: string | null
  lastFetched: Record<number, number>
  cacheTimeout: number // 5 minutes in milliseconds
}

const initialState: LessonsState = {
  lessonsByCourse: {},
  loading: false,
  error: null,
  lastFetched: {},
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
}

// Async thunk
export const fetchLessonsByCourse = createAsyncThunk(
  'lessons/fetchLessonsByCourse',
  async (courseId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { lessons: LessonsState }
      const now = Date.now()
      
      // Check if cache is still valid
      if (
        state.lessons.lastFetched[courseId] &&
        now - state.lessons.lastFetched[courseId] < state.lessons.cacheTimeout &&
        state.lessons.lessonsByCourse[courseId]
      ) {
        return { courseId, lessons: state.lessons.lessonsByCourse[courseId] }
      }
      
      const lessons = await getLessonsByCourseId(courseId)
      return { courseId, lessons }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch lessons')
    }
  }
)

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonsByCourse.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchLessonsByCourse.fulfilled,
        (state, action: PayloadAction<{ courseId: number; lessons: Lesson[] }>) => {
          state.loading = false
          state.lessonsByCourse[action.payload.courseId] = action.payload.lessons
          state.lastFetched[action.payload.courseId] = Date.now()
        }
      )
      .addCase(fetchLessonsByCourse.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = lessonsSlice.actions
export default lessonsSlice.reducer
