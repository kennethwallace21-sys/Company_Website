import React from 'react';

/**
 * Catches render errors in the subtree and shows a dark-themed fallback
 * instead of unmounting the whole app. Pass a changing `resetKey` (for
 * example the current location) to clear the error after navigation.
 */
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled render error:', error, info?.componentStack);
    }

    componentDidUpdate(prevProps) {
        if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
            this.setState({ hasError: false });
        }
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        // `fallback` may legitimately be null (render nothing), so check for undefined.
        if (this.props.fallback !== undefined) {
            return this.props.fallback;
        }

        return (
            <div
                role="alert"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: '#060a14',
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                }}
            >
                <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Something went wrong.</h1>
                <p style={{ margin: 0, color: '#94a3b8', maxWidth: '28rem' }}>
                    An unexpected error occurred while loading this page. Please return to the home page and try again.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="/" style={{ color: '#60a5fa', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                        Back to home
                    </a>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        Reload page
                    </button>
                </div>
            </div>
        );
    }
}
