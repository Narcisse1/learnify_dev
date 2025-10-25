import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Course } from '../../types/course'
import { getAllCourses, getCourseById } from '../../services/courseService'

interface CoursesState {
  courses: Course[]
  selectedCourse: Course | null
  loading: boolean
  error: string | null
  lastFetched: number | null
  cacheTimeout: number // 5 minutes in milliseconds
}

const initialState: CoursesState = {
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
}

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { courses: CoursesState }
      const now = Date.now()
      
      // Check if cache is still valid
      if (
        state.courses.lastFetched &&
        now - state.courses.lastFetched < state.courses.cacheTimeout &&
        state.courses.courses.length > 0
      ) {
        return state.courses.courses // Return cached data
      }
      
      const courses = await getAllCourses()
      return courses
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch courses')
    }
  }
)

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const course = await getCourseById(id)
      return course
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch course')
    }
  }
)

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearSelectedCourse: (state) => {
      state.selectedCourse = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch all courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false
        state.courses = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false
        state.selectedCourse = action.payload
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedCourse, clearError } = coursesSlice.actions
export default coursesSlice.reducer
