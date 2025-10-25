import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

interface ProgressState {
  completedLessons: Record<number, boolean> // lessonId -> completed
  lastUpdated: number | null
  syncing: boolean
  syncError: string | null
  pendingSync: number[] // Lesson IDs pending sync to backend
}

// Load initial state from localStorage
const loadProgressFromStorage = (): ProgressState => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('learnify_progress')
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          completedLessons: parsed.completedLessons || {},
          lastUpdated: parsed.lastUpdated || null,
          syncing: false,
          syncError: null,
          pendingSync: parsed.pendingSync || [],
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error)
  }
  return {
    completedLessons: {},
    lastUpdated: null,
    syncing: false,
    syncError: null,
    pendingSync: [],
  }
}

const initialState: ProgressState = loadProgressFromStorage()

// Persist to localStorage helper
const persistToStorage = (state: ProgressState) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const dataToStore = {
        completedLessons: state.completedLessons,
        lastUpdated: state.lastUpdated,
        pendingSync: state.pendingSync,
      }
      localStorage.setItem('learnify_progress', JSON.stringify(dataToStore))
    }
  } catch (error) {
    console.warn('Failed to save progress to localStorage:', error)
  }
}

// Async thunk for syncing progress to backend (placeholder for future implementation)
export const syncProgressToBackend = createAsyncThunk(
  'progress/syncToBackend',
  async (lessonIds: number[], { rejectWithValue }) => {
    try {
      // TODO: Implement actual API call to sync progress
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 500))
      return lessonIds
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Sync failed')
    }
  }
)

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // Optimistic update - updates UI immediately
    markLessonComplete: (state, action: PayloadAction<number>) => {
      const lessonId = action.payload
      state.completedLessons[lessonId] = true
      state.lastUpdated = Date.now()
      
      // Add to pending sync queue
      if (!state.pendingSync.includes(lessonId)) {
        state.pendingSync.push(lessonId)
      }
      
      persistToStorage(state)
    },
    markLessonIncomplete: (state, action: PayloadAction<number>) => {
      const lessonId = action.payload
      state.completedLessons[lessonId] = false
      state.lastUpdated = Date.now()
      
      // Add to pending sync queue
      if (!state.pendingSync.includes(lessonId)) {
        state.pendingSync.push(lessonId)
      }
      
      persistToStorage(state)
    },
    toggleLessonCompletion: (state, action: PayloadAction<number>) => {
      const lessonId = action.payload
      state.completedLessons[lessonId] = !state.completedLessons[lessonId]
      state.lastUpdated = Date.now()
      
      // Add to pending sync queue
      if (!state.pendingSync.includes(lessonId)) {
        state.pendingSync.push(lessonId)
      }
      
      persistToStorage(state)
    },
    clearProgress: (state) => {
      state.completedLessons = {}
      state.lastUpdated = Date.now()
      state.pendingSync = []
      
      try {
        localStorage.removeItem('learnify_progress')
      } catch (error) {
        console.error('Failed to clear progress from localStorage:', error)
      }
    },
    clearSyncError: (state) => {
      state.syncError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncProgressToBackend.pending, (state) => {
        state.syncing = true
        state.syncError = null
      })
      .addCase(syncProgressToBackend.fulfilled, (state, action) => {
        state.syncing = false
        // Remove synced lessons from pending queue
        state.pendingSync = state.pendingSync.filter(
          (id) => !action.payload.includes(id)
        )
        persistToStorage(state)
      })
      .addCase(syncProgressToBackend.rejected, (state, action) => {
        state.syncing = false
        state.syncError = action.payload as string
      })
  },
})

export const {
  markLessonComplete,
  markLessonIncomplete,
  toggleLessonCompletion,
  clearProgress,
  clearSyncError,
} = progressSlice.actions

export default progressSlice.reducer
