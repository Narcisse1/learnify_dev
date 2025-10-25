import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import ReactMarkdown from 'react-markdown'
import lessons from '../dummydata/lessons'
import type { Lesson } from '../types/lesson'
import { generateLessonMarkdown } from '../dummydata/dummyMD'
import { useAppContext } from '../App'

// Mock lesson content (you can replace with fetched content later)
const mockLesson = lessons[0]

export const LessonPage: React.FC<{ lesson?: Lesson }> = ({ lesson: propLesson }) => {
  const { id } = useParams()
  const { completedLessons, toggleLessonCompletion } = useAppContext()

  const lesson = propLesson || lessons.find(l => l.id === Number(id)) || mockLesson
  const completed = completedLessons[lesson.id] || false
  
  const handleToggleCompletion = () => {
    toggleLessonCompletion(lesson.id)
  }
  const markdownContent = generateLessonMarkdown(lesson.title, lesson.id)
  
  // Get the course ID for proper breadcrumb navigation
  const courseId = lesson.courseId || 1
  
  // Get all lessons for this course to enable next/previous navigation
  const courseLessons = lessons.filter(l => l.courseId === courseId).sort((a, b) => a.id - b.id)
  const currentIndex = courseLessons.findIndex(l => l.id === lesson.id)
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null

  // Map difficulty → color pill
  const difficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
    }
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-100">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <span>/</span>
        <Link to={`/courses/${courseId}`} className="hover:text-blue-600 dark:hover:text-blue-400">Course</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{lesson.title}</span>
      </div>

      {/* Lesson Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty}
          </span>
        </div>

        {/* Lesson Image */}
        <div className="relative mb-6 overflow-hidden rounded-xl shadow-md">
          <img
            src={lesson.imageUrl}
            alt={lesson.title}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Markdown Body */}
        <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white">
          {/* <ReactMarkdown>
            {lesson.content}
          </ReactMarkdown> */}
          <ReactMarkdown>
            {markdownContent}
          </ReactMarkdown>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="primary" onClick={handleToggleCompletion}>
            {completed ? '✓ Completed' : 'Mark as Complete'}
          </Button>
          
          <div className="flex gap-2 ml-auto">
            {prevLesson && (
              <Link to={`/lessons/${prevLesson.id}`}>
                <Button variant="secondary">← Previous</Button>
              </Link>
            )}
            {nextLesson && (
              <Link to={`/lessons/${nextLesson.id}`}>
                <Button variant="secondary">Next Lesson →</Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Resources Section */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Additional Resources</h3>
        <div className="space-y-3">
          {[
            { name: '📄 Lesson Notes (PDF)', action: 'Download' },
            { name: '💻 Source Code', action: 'View' },
            { name: '🔗 Official Documentation', action: 'Open' },
          ].map((res) => (
            <a
              key={res.name}
              href="#"
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-gray-900 dark:text-white font-medium">{res.name}</span>
              <span className="text-blue-600 dark:text-blue-400">{res.action}</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default LessonPage
