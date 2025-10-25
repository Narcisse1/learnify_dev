import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CacheEntry {
  data: unknown
  timestamp: number
  expiresIn: number
}

interface CacheState {
  entries: Record<string, CacheEntry>
}

const initialState: CacheState = {
  entries: {},
}

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCacheEntry: (
      state,
      action: PayloadAction<{ key: string; data: unknown; expiresIn?: number }>
    ) => {
      const { key, data, expiresIn = 5 * 60 * 1000 } = action.payload
      state.entries[key] = {
        data,
        timestamp: Date.now(),
        expiresIn,
      }
    },
    removeCacheEntry: (state, action: PayloadAction<string>) => {
      delete state.entries[action.payload]
    },
    clearCache: (state) => {
      state.entries = {}
    },
    clearExpiredCache: (state) => {
      const now = Date.now()
      Object.keys(state.entries).forEach((key) => {
        const entry = state.entries[key]
        if (now - entry.timestamp > entry.expiresIn) {
          delete state.entries[key]
        }
      })
    },
  },
})

export const { setCacheEntry, removeCacheEntry, clearCache, clearExpiredCache } =
  cacheSlice.actions

// Selector to get cached data
export const selectCachedData = (key: string) => (state: { cache: CacheState }) => {
  const entry = state.cache.entries[key]
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > entry.expiresIn) {
    return null // Expired
  }

  return entry.data
}

export default cacheSlice.reducer
