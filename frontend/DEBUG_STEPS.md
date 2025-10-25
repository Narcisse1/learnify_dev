# 🔍 Debug Steps - No Content Showing

## Current Status
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ API responds correctly (tested)
- ❓ Content not showing on page

## Quick Checks

### 1. Open Browser Console
Press `F12` and check Console tab for:
- Any red errors?
- Any warnings about API calls?
- Any "Failed to fetch" messages?

### 2. Check Network Tab
1. Press `F12`
2. Go to Network tab
3. Refresh page
4. Look for `/api/courses` request
   - Is it there?
   - What's the status code?
   - What's the response?

### 3. Check What You See
Do you see:
- [ ] Hero section with "Welcome to Learnify"?
- [ ] Loading spinner?
- [ ] Error message?
- [ ] Completely blank page?
- [ ] Just the navbar/footer?

## Possible Issues & Solutions

### Issue 1: Seeing Hero but No Courses

**Symptoms:**
- Page loads
- See "Welcome to Learnify" header
- No course cards below

**Solution:**
The API might be failing silently. Check browser console.

### Issue 2: Completely Blank Page

**Symptoms:**
- White/blank screen
- No content at all

**Solution:**
JavaScript error preventing render. Check console for errors.

### Issue 3: Loading Spinner Forever

**Symptoms:**
- See loading spinner
- Never shows content

**Solution:**
API call hanging. Check Network tab.

## Manual Test

### Test 1: Check API Directly
Open in browser:
```
http://localhost:5000/api/courses
```

**Expected:** Should see JSON with courses
**If 401 Error:** API key issue
**If 404 Error:** Backend routing issue
**If Connection Refused:** Backend not running

### Test 2: Check Frontend
Open in browser:
```
http://localhost:5173
```

**Expected:** Should see Learnify home page
**If blank:** Check console for errors
**If 404:** Frontend not running

### Test 3: Force Dummy Data
Temporarily edit `src/services/courseService.ts`:

```typescript
export const getAllCourses = async (): Promise<Course[]> => {
  // Force dummy data for testing
  console.log('Returning dummy courses:', dummyCourses.length)
  return dummyCourses
  
  // Original code commented out
  // try {
  //   const response = await api.get<Course[]>('/courses')
  //   return response.data
  // } catch (error) {
  //   console.warn('API failed, using dummy data:', error)
  //   return dummyCourses
  // }
}
```

Save and check if courses appear.

## Debug Commands

### Check if servers are responding:

```bash
# Test backend
curl http://localhost:5000/api/courses -H "Authorization: Bearer test-api-key-12345"

# Test frontend
curl http://localhost:5173
```

### Check ports:
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

## Common Fixes

### Fix 1: Hard Refresh
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Fix 2: Clear Browser Cache
1. F12 → Application → Clear storage
2. Check all boxes
3. Click "Clear site data"
4. Refresh

### Fix 3: Restart Frontend
Stop and restart the frontend server to pick up .env changes.

### Fix 4: Check .env is loaded
Add console.log in `src/services/api.ts`:
```typescript
console.log('API Base URL:', import.meta.env.VITE_API_URL)
console.log('API Key:', import.meta.env.VITE_API_KEY)
```

## What to Share

If still not working, please share:

1. **Browser Console Output**
   - Any errors (red text)
   - Any warnings (yellow text)

2. **Network Tab**
   - Screenshot of requests
   - Status codes
   - Failed requests

3. **What You See**
   - Blank page?
   - Hero section only?
   - Loading spinner?
   - Error message?

4. **Browser**
   - Which browser?
   - Version?

## Quick Test HTML

Create `frontend/public/test.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <h1>Server is Working!</h1>
  <script>
    fetch('http://localhost:5000/api/courses', {
      headers: {
        'Authorization': 'Bearer test-api-key-12345'
      }
    })
    .then(r => r.json())
    .then(data => {
      document.body.innerHTML += '<pre>' + JSON.stringify(data, null, 2) + '</pre>'
    })
    .catch(err => {
      document.body.innerHTML += '<p style="color:red">Error: ' + err + '</p>'
    })
  </script>
</body>
</html>
```

Visit: http://localhost:5173/test.html

This will test if the API is accessible from the browser.

## Expected Behavior

When working correctly:
1. Page loads with hero section
2. Loading spinner shows briefly
3. Courses appear in grid (3 columns on desktop)
4. Each course has image, title, description
5. "View Course" buttons work

## Next Steps

1. Check browser console (F12)
2. Check Network tab for API calls
3. Try the test.html file
4. Share console errors if any

The app structure is correct, so it's likely a runtime issue that the console will reveal!
