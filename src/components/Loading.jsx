function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );
}

export default Loading;
