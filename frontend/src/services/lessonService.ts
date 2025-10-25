import api from './api'
import type { Lesson } from '../types/lesson'
import dummyLessons from '../dummydata/lessons'

// Backend response uses snake_case
interface LessonResponse {
  id: number
  title: string
  content?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  course_id?: number
  image_url?: string
  description?: string
  duration?: number
  lesson_order?: number
}

// Transform backend response to frontend format
const transformLesson = (lesson: LessonResponse): Lesson => ({
  id: lesson.id,
  title: lesson.title,
  content: lesson.content,
  difficulty: lesson.difficulty,
  courseId: lesson.course_id,
  imageUrl: lesson.image_url,
  description: lesson.description,
})

// Get lessons for a specific course
export const getLessonsByCourseId = async (courseId: number): Promise<Lesson[]> => {
  try {
    const response = await api.get<LessonResponse[]>(`/courses/${courseId}/lessons`)
    return response.data.map(transformLesson)
  } catch (error) {
    console.warn('API failed, using dummy data:', error)
    // Fallback to dummy data if API fails
    return dummyLessons.filter(lesson => lesson.courseId === courseId)
  }
}
