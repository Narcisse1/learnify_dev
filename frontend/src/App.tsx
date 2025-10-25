import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import LessonPage from './pages/LessonPage'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import OfflineIndicator from './components/OfflineIndicator'
import { DarkModeProvider } from './context/DarkModeContext'
import { CourseDetails } from './pages/CourseDetails'
import { Home } from './pages/Home'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import lessons from './dummydata/lessons'
import courses from './dummydata/courses'
import type { Lesson } from './types/lesson'
import type { Course } from './types/course'

// Simple state management without Redux
const AppContext = React.createContext<{
  courses: Course[]
  lessons: Lesson[]
  completedLessons: Record<number, boolean>
  toggleLessonCompletion: (lessonId: number) => void
} | null>(null)

function AppProvider({ children }: { children: React.ReactNode }) {
  const [appCourses, setAppCourses] = React.useState<Course[]>([])
  const [appLessons, setAppLessons] = React.useState<Lesson[]>(lessons)
  const [completedLessons, setCompletedLessons] = React.useState<Record<number, boolean>>(() => {
    try {
      const stored = localStorage.getItem('learnify_progress')
      return stored ? JSON.parse(stored).completedLessons || {} : {}
    } catch {
      return {}
    }
  })

  // Fetch courses on mount
  React.useEffect(() => {
    fetch('http://localhost:5000/api/courses', {
      headers: {
        'Authorization': 'Bearer test-api-key-12345',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => setAppCourses(data))
    .catch(() => setAppCourses(courses)) // Fallback to dummy data
  }, [])

  const toggleLessonCompletion = (lessonId: number) => {
    const newCompleted = { ...completedLessons, [lessonId]: !completedLessons[lessonId] }
    setCompletedLessons(newCompleted)
    try {
      localStorage.setItem('learnify_progress', JSON.stringify({ completedLessons: newCompleted }))
    } catch (error) {
      console.warn('Failed to save progress:', error)
    }
  }

  return (
    <AppContext.Provider value={{
      courses: appCourses,
      lessons: appLessons,
      completedLessons,
      toggleLessonCompletion
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = React.useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}

// Wrapper components to handle routing logic
const CourseDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const courseId = id ? Number(id) : null
  const { courses, lessons } = useAppContext()
  
  const course = courseId ? courses.find(c => c.id === courseId) : null
  const courseLessons = courseId ? lessons.filter(l => l.courseId === courseId) : []
  
  if (!courseId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Invalid Course</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Please provide a valid course ID.</p>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Back to Home</a>
      </div>
    )
  }
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The course you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Back to Home</a>
      </div>
    )
  }
  
  return <CourseDetails course={course} lessons={courseLessons} />
}

const LessonPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const lessonId = id ? Number(id) : null
  const { lessons } = useAppContext()
  
  const lesson = lessonId ? lessons.find(l => l.id === lessonId) : null
  
  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The lesson you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← Back to Home</a>
      </div>
    )
  }
  
  return <LessonPage lesson={lesson} />
}

export default function App() {
  return (
    <DarkModeProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
          <OfflineIndicator />
          <Navbar />
          <main className="container mx-auto px-4 py-6 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses/:id" element={<CourseDetailsWrapper />} />
              <Route path="/lessons/:id" element={<LessonPageWrapper />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </DarkModeProvider>
  )
}