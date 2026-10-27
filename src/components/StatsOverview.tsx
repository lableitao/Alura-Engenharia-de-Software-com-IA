import React from 'react';
import { Target, Clock, CheckCircle2, ListTodo, TrendingUp } from 'lucide-react';
import { Objective } from '../types/objective';

interface StatsOverviewProps {
  objectives: Objective[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ objectives }) => {
  const total = objectives.length;
  const notStarted = objectives.filter((o) => o.status === 'not_started').length;
  const inProgress = objectives.filter((o) => o.status === 'in_progress').length;
  const completed = objectives.filter((o) => o.status === 'completed').length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total de objetivos */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Cadastrado
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800">{total}</span>
            <span className="text-xs text-slate-400">
              {total === 1 ? 'objetivo' : 'objetivos'}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <ListTodo className="w-5 h-5" />
        </div>
      </div>

      {/* Não iniciados */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">
            A Iniciar
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800">{notStarted}</span>
            <span className="text-xs text-slate-400">pendentes</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Em andamento */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-sky-600 uppercase tracking-wider">
            Em Andamento
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800">{inProgress}</span>
            <span className="text-xs text-slate-400">em foco</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Concluídos & taxa */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
            Concluídos
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800">{completed}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {percentage}%
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
