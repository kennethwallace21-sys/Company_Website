import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// After a deploy, old lazy chunks can 404. Reload once to pick up the new
// build; the sessionStorage flag prevents a reload loop. Storage may throw
// (private mode, blocked site data), in which case we do not reload.
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    try {
        if (!sessionStorage.getItem('reloaded-after-preload-error')) {
            sessionStorage.setItem('reloaded-after-preload-error', '1')
            window.location.reload()
        }
    } catch {
        // Storage unavailable: skip the auto reload to avoid a possible loop.
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
