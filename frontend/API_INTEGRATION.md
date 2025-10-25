# API Integration Guide

## Overview
This document describes the API integration implemented in the Learnify frontend application.

## Installation

Axios has been installed as the HTTP client:
```bash
npm install axios
```

## Project Structure

```
src/
├── services/
│   ├── api.ts              # Axios instance with interceptors
│   ├── courseService.ts    # Course API endpoints
│   ├── lessonService.ts    # Lesson API endpoints
│   └── index.ts            # Service exports
├── hooks/
│   └── useApi.ts           # Custom hook for API calls
├── components/
│   ├── LoadingSpinner.tsx  # Loading state component
│   └── ErrorMessage.tsx    # Error state component
```

## Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

The API base URL defaults to `http://localhost:3000/api` if not specified.

## API Services

### Course Service (`courseService.ts`)

**Get All Courses**
```typescript
import { getAllCourses } from './services/courseService'

const courses = await getAllCourses()
```

**Get Course by ID**
```typescript
import { getCourseById } from './services/courseService'

const course = await getCourseById(1)
```

### Lesson Service (`lessonService.ts`)

**Get Lessons by Course ID**
```typescript
import { getLessonsByCourseId } from './services/lessonService'

const lessons = await getLessonsByCourseId(1)
```

## Custom Hook: useApi

The `useApi` hook simplifies API calls with built-in loading and error states:

```typescript
import { useApi } from './hooks/useApi'
import { getAllCourses } from './services/courseService'

function MyComponent() {
  const { data, loading, error } = useApi(getAllCourses)
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  
  return <div>{/* Render data */}</div>
}
```

### Hook Parameters
- `apiFunction`: Async function that returns a Promise
- `dependencies`: Array of dependencies (like useEffect)

### Return Values
- `data`: The fetched data (null if not loaded)
- `loading`: Boolean indicating loading state
- `error`: Error message string (null if no error)

## Components

### LoadingSpinner
Displays a loading indicator with optional message:

```typescript
<LoadingSpinner message="Loading courses..." />
```

### ErrorMessage
Displays error messages with optional retry button:

```typescript
<ErrorMessage 
  message="Failed to load data" 
  onRetry={() => refetch()} 
/>
```

## API Interceptors

### Request Interceptor
Located in `services/api.ts`, can be used to add authentication tokens:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Interceptor
Handles common errors globally (e.g., 401 unauthorized).

## Usage Examples

### Home Page
The Home page fetches all courses on mount:

```typescript
const { data: courses, loading, error } = useApi(getAllCourses)
```

### Course Details Page
Fetches course and lessons based on URL parameter:

```typescript
const { id } = useParams()
const courseId = Number(id)

const { data: course, loading: courseLoading, error: courseError } = useApi(
  () => getCourseById(courseId),
  [courseId]
)

const { data: lessons, loading: lessonsLoading, error: lessonsError } = useApi(
  () => getLessonsByCourseId(courseId),
  [courseId]
)
```

## API Endpoints

The following endpoints are expected from the backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get specific course |
| GET | `/api/lessons/:courseId` | Get lessons for a course |

## TypeScript Interfaces

All API responses use the existing TypeScript interfaces:

- `Course` - from `src/types/course.ts`
- `Lesson` - from `src/types/lesson.ts`

## Error Handling

Errors are handled at multiple levels:

1. **API Level**: Response interceptor catches HTTP errors
2. **Hook Level**: useApi hook catches and returns errors
3. **Component Level**: ErrorMessage component displays errors to users

## Testing

To test the API integration:

1. Ensure the backend server is running on `http://localhost:3000`
2. Start the frontend: `npm run dev`
3. Navigate to the application
4. Check browser console for any API errors

## Fallback to Dummy Data

If you need to temporarily use dummy data while the backend is being developed, you can modify the services to return dummy data:

```typescript
// In courseService.ts
import courses from '../dummydata/courses'

export const getAllCourses = async (): Promise<Course[]> => {
  // Uncomment to use dummy data
  // return Promise.resolve(courses)
  
  const response = await api.get<Course[]>('/courses')
  return response.data
}
```

## Next Steps

1. Ensure backend API is running and accessible
2. Test all endpoints with the frontend
3. Add authentication if required
4. Implement caching strategy if needed
5. Add pagination for large datasets
