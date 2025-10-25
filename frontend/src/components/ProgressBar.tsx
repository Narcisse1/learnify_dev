import React from 'react'

interface ProgressBarProps {
  progress: number // 0-100
  showLabel?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  showLabel = true,
  className = '' 
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  const getProgressColor = () => {
    if (clampedProgress < 30) return 'bg-red-500'
    if (clampedProgress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {clampedProgress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
