# 🚀 Quick Start Guide

## Start Both Servers

### Terminal 1 - Backend
```bash
cd backend
python run.py
```
✅ Backend running on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on `http://localhost:5173`

## Open in Browser
Navigate to: `http://localhost:5173`

## What You'll See
1. **Home Page** - Loading spinner → List of courses from API
2. **Click a Course** - Loading spinner → Course details with lessons
3. **Smooth Experience** - Loading states and error handling

## API Key
The test API key `test-api-key-12345` is already configured in `.env`

## Troubleshooting
- **Network Error**: Make sure backend is running
- **Port Conflict**: Frontend will use next available port if 5173 is busy
- **CORS Error**: Backend has CORS enabled, should work out of the box

## That's It! 🎉
Your full-stack app is now running with real API integration!
