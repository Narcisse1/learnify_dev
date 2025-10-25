# Redux Quick Reference

## Import Statements

```typescript
// Hooks
import { useAppDispatch, useAppSelector } from '../store/hooks'

// Actions
import { fetchCourses, fetchCourseById } from '../store/slices/coursesSlice'
import { fetchLessonsByCourse } from '../store/slices/lessonsSlice'
import { toggleLessonCompletion, markLessonComplete } from '../store/slices/progressSlice'

// Selectors
import { selectCourseProgress, selectTotalProgress } from '../store/selectors'
```

## Common Patterns

### Fetch Data on Mount
```typescript
const dispatch = useAppDispatch()

useEffect(() => {
  dispatch(fetchCourses())
}, [dispatch])
```

### Access State
```typescript
const courses = useAppSelector((state) => state.courses.courses)
const loading = useAppSelector((state) => state.courses.loading)
const error = useAppSelector((state) => state.courses.error)
```

### Dispatch Actions
```typescript
// Async thunk
dispatch(fetchCourses())

// Sync action
dispatch(toggleLessonCompletion(lessonId))
```

### Use Selectors
```typescript
const progress = useAppSelector(selectCourseProgress(courseId))
const isCompleted = useAppSelector(selectIsLessonCompleted(lessonId))
```

## State Structure

```typescript
{
  courses: {
    courses: Course[],
    selectedCourse: Course | null,
    loading: boolean,
    error: string | null,
    lastFetched: number | null
  },
  lessons: {
    lessonsByCourse: { [courseId: number]: Lesson[] },
    loading: boolean,
    error: string | null,
    lastFetched: { [courseId: number]: number }
  },
  progress: {
    completedLessons: { [lessonId: number]: boolean },
    lastUpdated: number | null
  }
}
```

## Available Actions

### Courses
- `fetchCourses()` - Fetch all courses
- `fetchCourseById(id)` - Fetch specific course
- `clearSelectedCourse()` - Clear selected course
- `clearError()` - Clear error

### Lessons
- `fetchLessonsByCourse(courseId)` - Fetch lessons for course
- `clearError()` - Clear error

### Progress
- `markLessonComplete(lessonId)` - Mark as complete
- `markLessonIncomplete(lessonId)` - Mark as incomplete
- `toggleLessonCompletion(lessonId)` - Toggle status
- `clearProgress()` - Clear all progress

## Selectors

### Courses
- `selectAllCourses(state)` - All courses
- `selectSelectedCourse(state)` - Selected course
- `selectCoursesLoading(state)` - Loading state
- `selectCoursesError(state)` - Error state

### Lessons
- `selectLessonsByCourseId(courseId)(state)` - Lessons for course
- `selectLessonsLoading(state)` - Loading state
- `selectLessonsError(state)` - Error state

### Progress
- `selectCompletedLessons(state)` - All completed lessons
- `selectIsLessonCompleted(lessonId)(state)` - Check completion
- `selectCourseProgress(courseId)(state)` - Course progress %
- `selectTotalProgress(state)` - Total progress %

## Cache Behavior

- **Timeout**: 5 minutes
- **Automatic**: Checks cache before fetching
- **Per-resource**: Separate cache for each course's lessons
- **Smart**: Only fetches if cache expired

## localStorage

- **Key**: `learnify_progress`
- **Auto-save**: On every progress update
- **Auto-load**: On app initialization
- **Format**: JSON object with completedLessons and lastUpdated
