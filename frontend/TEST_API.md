# Testing the API Integration

## Prerequisites

1. **Backend Server**: Ensure the backend is running on `http://localhost:5000`
   ```bash
   cd backend
   pip install -r requirements.txt
   python run.py
   ```

2. **Frontend Server**: Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

## Testing Steps

### 1. Test Backend Endpoints Directly

Use curl or a tool like Postman to test the backend:

```bash
# Test GET /api/courses
curl http://localhost:5000/api/courses

# Test GET /api/courses/:id
curl http://localhost:5000/api/courses/1

# Test GET /api/lessons/:courseId (or /api/courses/:id/lessons)
curl http://localhost:5000/api/lessons/1
# OR
curl http://localhost:5000/api/courses/1/lessons
```

### 2. Test with Authentication (if required)

If the backend requires authentication:

```bash
# With API key
curl -H "Authorization: Bearer test-api-key-12345" \
     http://localhost:5000/api/courses
```

### 3. Test Frontend Integration

1. Open the frontend in your browser: `http://localhost:5173` (or the port Vite assigns)
2. Open browser DevTools (F12) and go to the Network tab
3. Navigate through the app:
   - Home page should load all courses
   - Click on a course to see course details and lessons
   - Check the Network tab for API calls

### 4. Check for Errors

**Common Issues:**

1. **CORS Errors**: If you see CORS errors in the browser console, the backend needs to enable CORS:
   ```python
   from flask_cors import CORS
   CORS(app)
   ```

2. **Connection Refused**: Backend is not running or running on a different port

3. **404 Errors**: API endpoints don't match between frontend and backend

4. **Response Format Mismatch**: Backend returns different structure than expected

## Debugging

### Check API Response Format

The frontend expects responses in this format:

```json
// GET /api/courses
{
  "courses": [...]
}

// GET /api/courses/:id
{
  "course": {...}
}

// GET /api/lessons/:courseId
{
  "lessons": [...]
}
```

If the backend returns a different format, update the service files accordingly.

### Enable Detailed Logging

Add console logs to see what's happening:

```typescript
// In services/api.ts
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response)
    return response
  },
  (error) => {
    console.error('API Error:', error.response || error)
    return Promise.reject(error)
  }
)
```

## Fallback to Dummy Data

If the backend is not ready, you can temporarily use dummy data:

1. Update `src/services/courseService.ts`:
```typescript
import courses from '../dummydata/courses'

export const getAllCourses = async (): Promise<Course[]> => {
  // Temporary: Use dummy data
  return Promise.resolve(courses)
  
  // Production: Use API
  // const response = await api.get<CoursesResponse>('/courses')
  // return response.data.courses
}
```

2. Do the same for other services as needed

## Expected Behavior

✅ **Home Page**: Shows loading spinner, then displays all courses
✅ **Course Details**: Shows loading spinner, then displays course info and lessons
✅ **Error Handling**: Shows error message if API fails
✅ **No Console Errors**: Check browser console for any errors

## Next Steps

Once basic integration works:
1. Add pagination for large datasets
2. Implement caching to reduce API calls
3. Add retry logic for failed requests
4. Implement optimistic updates for better UX
