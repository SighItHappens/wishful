export default function ProfileEditLoading() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div> {/* Title Skeleton */}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section Skeleton */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div> {/* Button Skeleton */}
          </div>

          {/* Form Fields Skeleton */}
          <div className="flex-1 space-y-6">
            {/* Name Field Skeleton */}
            <div>
              <div className="h-5 w-16 bg-gray-300 rounded animate-pulse mb-2"></div> {/* Label Skeleton */}
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div> {/* Input Skeleton */}
            </div>

            {/* Email Field Skeleton (Read-only) */}
            <div>
              <div className="h-5 w-12 bg-gray-300 rounded animate-pulse mb-2"></div> {/* Label Skeleton */}
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div> {/* Read-only Input Skeleton */}
            </div>

            {/* Bio Field Skeleton */}
            <div>
              <div className="h-5 w-10 bg-gray-300 rounded animate-pulse mb-2"></div> {/* Label Skeleton */}
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div> {/* Textarea Skeleton */}
            </div>

            {/* Preferences Skeleton */}
            <div>
              <div className="h-5 w-24 bg-gray-300 rounded mb-3"></div> {/* Title Skeleton */}
              <div className="space-y-3">
                <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div> {/* Preference Skeleton */}
                <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div> {/* Preference Skeleton */}
                <div className="h-6 w-full bg-gray-300 rounded animate-pulse"></div> {/* Preference Skeleton */}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex justify-end gap-4 pt-4">
              <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div> {/* Cancel Button Skeleton */}
              <div className="h-10 w-24 bg-indigo-300 rounded animate-pulse"></div> {/* Save Button Skeleton */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
