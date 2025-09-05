import { Board } from '@/components/Board';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Fintech BNPL Ticket Board</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Manage your Buy Now Pay Later development tickets with a Kanban-style board</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
                <span>💡 Drag & drop tickets between columns</span>
                <span>•</span>
                <span>Double-click to edit</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <Board />
      
      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200/50">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>📋 <strong>Quick Tips:</strong></span>
              <span className="hidden sm:inline">• Use filters to find specific tickets</span>
              <span className="hidden sm:inline">• Export/Import for data portability</span>
              <span className="hidden sm:inline">• P0 = Critical, Due Soon = 3 days</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>🎯 {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Built with Next.js + TypeScript</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
