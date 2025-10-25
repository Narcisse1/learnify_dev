import React from 'react'
import { useAppSelector } from '../store/hooks'
import { selectCourseProgress, selectLessonsByCourseId } from '../store/selectors'
import ProgressBar from './ProgressBar'

interface CourseProgressCardProps {
  courseId: number
  courseTitle: string
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  courseId,
  courseTitle,
}) => {
  const progress = useAppSelector(selectCourseProgress(courseId))
  const lessons = useAppSelector(selectLessonsByCourseId(courseId))
  const completedLessons = useAppSelector((state) => state.progress.completedLessons)

  const completedCount = lessons.filter((lesson) => completedLessons[lesson.id]).length
  const totalLessons = lessons.length

  const getProgressMessage = () => {
    if (progress === 0) return 'Not started'
    if (progress === 100) return 'Completed! 🎉'
    if (progress < 30) return 'Just getting started'
    if (progress < 70) return 'Making good progress'
    return 'Almost there!'
  }

  const getProgressIcon = () => {
    if (progress === 0) return '📚'
    if (progress === 100) return '🏆'
    if (progress < 50) return '🚀'
    return '⭐'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getProgressIcon()}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {courseTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {progress}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {getProgressMessage()}
          </p>
        </div>
      </div>

      <ProgressBar progress={progress} showLabel={false} />

      {progress === 100 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300 text-center font-medium">
            🎓 Congratulations! You've completed this course!
          </p>
        </div>
      )}
    </div>
  )
}

export default CourseProgressCard
