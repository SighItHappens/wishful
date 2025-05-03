export default function WishlistDetailLoading() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-300 rounded w-24"></div>
            <div className="h-10 bg-gray-300 rounded w-28"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
      </div>
      
      {/* Item grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-gray-200 rounded-lg p-4 h-64 shadow-sm">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-32 bg-gray-300 rounded mb-3"></div>
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-300 rounded w-1/3"></div>
              <div className="h-8 bg-gray-300 rounded-full w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}