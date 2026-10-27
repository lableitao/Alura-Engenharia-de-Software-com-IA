import React from 'react';
import { Search, SlidersHorizontal, Check } from 'lucide-react';
import { ObjectiveStatus } from '../types/objective';

interface FiltersBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: ObjectiveStatus | 'all';
  onStatusFilterChange: (status: ObjectiveStatus | 'all') => void;
  counts: {
    all: number;
    not_started: number;
    in_progress: number;
    completed: number;
  };
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Abas de filtro por status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
          }`}
        >
          Todos ({counts.all})
        </button>

        <button
          onClick={() => onStatusFilterChange('not_started')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
            statusFilter === 'not_started'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70 border border-amber-200/50'
          }`}
        >
          A Iniciar ({counts.not_started})
        </button>

        <button
          onClick={() => onStatusFilterChange('in_progress')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
            statusFilter === 'in_progress'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'bg-sky-50 text-sky-800 hover:bg-sky-100/70 border border-sky-200/50'
          }`}
        >
          Em Andamento ({counts.in_progress})
        </button>

        <button
          onClick={() => onStatusFilterChange('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/50'
          }`}
        >
          Concluídos ({counts.completed})
        </button>
      </div>

      {/* Campo de pesquisa */}
      <div className="relative min-w-[200px] sm:min-w-[260px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar objetivos..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
            title="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
