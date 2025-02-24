const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-500">404</h1>
        <p className="text-gray-600 mt-4">Page not found</p>
        <a href="/" className="mt-8 inline-block px-6 py-3 bg-orange-500 text-white rounded-full">
          Go Home
        </a>
      </div>
    </div>
  )
}

export default NotFound 