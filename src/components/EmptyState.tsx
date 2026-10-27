import React from 'react';
import { Compass, Plus, Sparkles, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenCreateModal: () => void;
  onClearFilters?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenCreateModal,
  onClearFilters,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-md mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          Não encontramos nenhum objetivo correspondente aos filtros ou termo de busca aplicado.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros de busca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
        <Sparkles className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Nenhum objetivo cadastrado ainda
      </h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Todo grande aprendizado começa com uma meta clara e viável. Cadastre seu primeiro
        objetivo para começar a acompanhar sua jornada de estudos no StudyFlow!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all cursor-pointer"
            title="Preencher com exemplos práticos"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ver exemplos prontos</span>
          </button>
        )}
      </div>
    </div>
  );
};
