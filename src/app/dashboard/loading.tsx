// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
      </div>
      
      {/* Wishlist cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-md p-4 h-48 shadow">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
