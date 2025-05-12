export default function ProfilePageLoading() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="mt-4 w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
            <div className="mt-2 w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>

          {/* Profile Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            <div className="mb-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
