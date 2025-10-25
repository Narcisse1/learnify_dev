// Service Worker Registration Utility

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute

          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker == null) {
              return
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('New content available, please refresh.')
                  
                  // Notify user about update
                  if (window.confirm('New version available! Reload to update?')) {
                    installingWorker.postMessage({ type: 'SKIP_WAITING' })
                    window.location.reload()
                  }
                } else {
                  // Content cached for offline use
                  console.log('Content cached for offline use.')
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error)
      })
  }
}

export function clearCache() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
  }
}

// Check if app is running in offline mode
export function isOffline(): boolean {
  return !navigator.onLine
}

// Listen for online/offline events
export function setupOfflineDetection(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    console.log('App is online')
    onOnline?.()
  })

  window.addEventListener('offline', () => {
    console.log('App is offline')
    onOffline?.()
  })
}
