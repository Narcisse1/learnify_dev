import { RootState } from './index'

// Course selectors
export const selectAllCourses = (state: RootState) => state.courses.courses
export const selectSelectedCourse = (state: RootState) => state.courses.selectedCourse
export const selectCoursesLoading = (state: RootState) => state.courses.loading
export const selectCoursesError = (state: RootState) => state.courses.error

// Lesson selectors
export const selectLessonsByCourseId = (courseId: number) => (state: RootState) =>
  state.lessons.lessonsByCourse[courseId] || []
export const selectLessonsLoading = (state: RootState) => state.lessons.loading
export const selectLessonsError = (state: RootState) => state.lessons.error

// Progress selectors
export const selectCompletedLessons = (state: RootState) => state.progress.completedLessons
export const selectIsLessonCompleted = (lessonId: number) => (state: RootState) =>
  state.progress.completedLessons[lessonId] || false

// Computed selectors
export const selectCourseProgress = (courseId: number) => (state: RootState) => {
  const lessons = state.lessons.lessonsByCourse[courseId] || []
  if (lessons.length === 0) return 0
  
  const completedCount = lessons.filter(
    lesson => state.progress.completedLessons[lesson.id]
  ).length
  
  return Math.round((completedCount / lessons.length) * 100)
}

export const selectTotalProgress = (state: RootState) => {
  const allLessons = Object.values(state.lessons.lessonsByCourse).flat()
  if (allLessons.length === 0) return 0
  
  const completedCount = allLessons.filter(
    lesson => state.progress.completedLessons[lesson.id]
  ).length
  
  return Math.round((completedCount / allLessons.length) * 100)
}
