import api from './api'
import type { Course } from '../types/course'
import dummyCourses from '../dummydata/courses'

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get<Course[]>('/courses')
    return response.data
  } catch (error) {
    console.warn('API failed, using dummy data:', error)
    // Fallback to dummy data if API fails
    return dummyCourses
  }
}

// Get a specific course by ID
export const getCourseById = async (id: number): Promise<Course> => {
  try {
    const response = await api.get<Course>(`/courses/${id}`)
    return response.data
  } catch (error) {
    console.warn('API failed, using dummy data:', error)
    // Fallback to dummy data if API fails
    const course = dummyCourses.find(c => c.id === id)
    if (!course) {
      throw new Error('Course not found')
    }
    return course
  }
}
