import { Board } from '@/components/Board';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Todo Board</h1>
          <p className="text-gray-600">Manage your tasks with a Kanban-style board</p>
        </div>
      </header>
      <Board />
    </div>
  );
}
