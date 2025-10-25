import React from 'react'
import ProgressBar from './ProgressBar'
import { useAppContext } from '../App'

export const ProgressDashboard: React.FC = () => {
  const { courses, lessons, completedLessons } = useAppContext()
  
  const completedCount = Object.values(completedLessons).filter(Boolean).length
  const totalLessons = lessons.length
  const totalProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // Calculate courses in progress
  const coursesInProgress = courses.filter((course) => {
    const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id)
    const completedInCourse = courseLessons.filter(
      (lesson) => completedLessons[lesson.id]
    ).length
    return completedInCourse > 0 && completedInCourse < courseLessons.length
  }).length

  // Calculate completed courses
  const completedCourses = courses.filter((course) => {
    const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id)
    if (courseLessons.length === 0) return false
    return courseLessons.every((lesson) => completedLessons[lesson.id])
  }).length

  const stats = [
    {
      label: 'Total Progress',
      value: `${totalProgress}%`,
      icon: '📊',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Lessons Completed',
      value: `${completedCount}/${totalLessons}`,
      icon: '✅',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Courses in Progress',
      value: coursesInProgress,
      icon: '🚀',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Courses Completed',
      value: completedCourses,
      icon: '🏆',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Learning Progress
      </h2>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <ProgressBar progress={totalProgress} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      {totalProgress === 0 && (
        <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p className="text-center text-blue-800 dark:text-blue-300">
            🎯 Start your learning journey today! Pick a course and begin.
          </p>
        </div>
      )}

      {totalProgress > 0 && totalProgress < 100 && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <p className="text-center text-green-800 dark:text-green-300">
            💪 Keep going! You're making great progress!
          </p>
        </div>
      )}

      {totalProgress === 100 && (
        <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <p className="text-center text-purple-800 dark:text-purple-300">
            🎉 Amazing! You've completed all available lessons!
          </p>
        </div>
      )}
    </div>
  )
}

export default ProgressDashboard
