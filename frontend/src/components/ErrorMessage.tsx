import React from 'react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Error</h3>
        </div>
        <p className="text-red-700 dark:text-red-400 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary bg-red-600 hover:bg-red-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
