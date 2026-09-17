export default function OrganizerLoading() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-[#5e6fe5] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-[#57534e]">Loading...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
