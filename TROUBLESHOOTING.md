# 🔧 Troubleshooting Guide

## Issue: Blank Page

### ✅ FIXED - Server Restarted

The frontend server has been restarted with fixes applied.

**Open now**: http://localhost:5173

---

## What Was Fixed

1. **Service Worker Registration** - Made optional for development
2. **localStorage Handling** - Added safety checks
3. **Server Restart** - Clean build with all fixes

---

## If Still Seeing Blank Page

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Share the error message

### Step 2: Hard Refresh
1. Press `Ctrl + Shift + R` (Windows/Linux)
2. Or `Cmd + Shift + R` (Mac)
3. This clears browser cache

### Step 3: Clear Browser Data
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Check all boxes
5. Click "Clear site data"
6. Refresh page

### Step 4: Try Incognito/Private Mode
1. Open incognito window
2. Go to http://localhost:5173
3. This tests without extensions/cache

---

## Common Issues & Solutions

### Issue: "Cannot GET /"
**Solution**: Frontend server not running
```bash
cd frontend
npm run dev
```

### Issue: API Errors
**Solution**: Backend server not running
```bash
cd backend
python run.py
```

### Issue: Module Not Found
**Solution**: Dependencies not installed
```bash
cd frontend
npm install
```

### Issue: Port Already in Use
**Solution**: Kill process on port 5173
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

---

## Verify Servers Are Running

### Check Frontend
```
http://localhost:5173
```
Should show: Learnify home page

### Check Backend
```
http://localhost:5000/api/courses
```
Should show: JSON array of courses

---

## Browser Console Checks

### What You Should See
```
✅ No red errors
✅ Service Worker messages (optional)
✅ Redux DevTools working (if installed)
```

### What You Shouldn't See
```
❌ "Failed to fetch"
❌ "Module not found"
❌ "Unexpected token"
❌ "Cannot read property"
```

---

## Network Tab Checks

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for:
   - ✅ `main.tsx` - Status 200
   - ✅ `index.css` - Status 200
   - ✅ `/api/courses` - Status 200

---

## Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop all servers
# Then restart:

# Terminal 1
cd backend
python run.py

# Terminal 2
cd frontend
npm run dev
```

### Fix 2: Clear Everything
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Fix 3: Check Environment
```bash
# Make sure .env exists
cd frontend
cat .env

# Should contain:
VITE_API_URL=http://localhost:5000/api
VITE_API_KEY=test-api-key-12345
```

---

## Still Not Working?

### Collect Information

1. **Browser Console Errors**
   - Copy any red error messages

2. **Network Tab**
   - Check which requests are failing
   - Note the status codes

3. **Server Logs**
   - Check backend terminal for errors
   - Check frontend terminal for errors

4. **System Info**
   - Browser version
   - Node version: `node --version`
   - Python version: `python --version`

---

## Test Basic Functionality

### Test 1: Static Page
Create `frontend/public/test.html`:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Test Page</h1>
  <p>If you see this, the server works!</p>
</body>
</html>
```
Visit: http://localhost:5173/test.html

### Test 2: API Direct
Visit: http://localhost:5000/api/courses
Should see JSON data

### Test 3: Simple React
Temporarily simplify `src/App.tsx`:
```typescript
export default function App() {
  return <div>Hello World</div>
}
```

---

## Current Status

✅ **Backend**: Running on port 5000
✅ **Frontend**: Running on port 5173
✅ **Fixes Applied**: Service Worker, localStorage
✅ **Server**: Restarted with clean build

**Try now**: http://localhost:5173

---

## Need More Help?

1. Check browser console for errors
2. Check server logs
3. Try the quick fixes above
4. Clear browser cache completely
5. Try different browser

The app should now be working! 🎉
