'use client';

import { FilterOptions } from '@/hooks/useTickets';

interface SearchAndFiltersProps {
  filters: FilterOptions;
  filterOptions: {
    assignees: string[];
    priorities: string[];
    labels: string[];
    statuses: string[];
  };
  stats: {
    total: number;
    p0: number;
    dueSoon: number;
  };
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

export function SearchAndFilters({
  filters,
  filterOptions,
  stats,
  onFiltersChange,
  onClearFilters,
}: SearchAndFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-4 sm:p-6 mb-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs sm:text-sm text-gray-500">Total</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.p0}</div>
          <div className="text-xs sm:text-sm text-gray-500">P0</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.dueSoon}</div>
          <div className="text-xs sm:text-sm text-gray-500">Due Soon</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search tickets by title, description, or labels..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm transition-all"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Assignee Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Assignee
          </label>
          <select
            value={filters.assignee}
            onChange={(e) => onFiltersChange({ assignee: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-900 bg-white/50 backdrop-blur-sm transition-all"
          >
            <option value="">All</option>
            {filterOptions.assignees.map(assignee => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => onFiltersChange({ priority: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-900 bg-white/50 backdrop-blur-sm transition-all"
          >
            <option value="">All</option>
            {filterOptions.priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Label Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Label
          </label>
          <select
            value={filters.label}
            onChange={(e) => onFiltersChange({ label: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-900 bg-white/50 backdrop-blur-sm transition-all"
          >
            <option value="">All</option>
            {filterOptions.labels.map(label => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-gray-900 bg-white/50 backdrop-blur-sm transition-all"
          >
            <option value="">All</option>
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100/70 border border-gray-300/50 rounded-lg hover:bg-gray-200/70 focus:outline-none focus:ring-2 focus:ring-gray-500/50 backdrop-blur-sm transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
