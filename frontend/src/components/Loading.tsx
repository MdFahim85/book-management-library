export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-w-full">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Loading Data
      </h2>
    </div>
  );
}
