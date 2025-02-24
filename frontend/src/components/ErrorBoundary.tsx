import { Component, ErrorInfo, ReactNode } from 'react'

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div className='flex flex-col justify-center place-content-center h-screen text-center'>
        <p>Something went wrong. Please refresh the page.</p>
      </div>
    }

    return this.props.children
  }
}

export default ErrorBoundary 