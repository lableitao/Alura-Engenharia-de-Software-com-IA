import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { Objective, STATUS_CONFIG, ObjectiveStatus } from '../types/objective';

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDeleteRequest: (objective: Objective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const statusInfo = STATUS_CONFIG[objective.status];

  // Análise de prazo
  const getDeadlineAnalysis = (deadlineStr: string) => {
    if (!deadlineStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Formatação de data no padrão brasileiro pt-BR: DD/MM/AAAA
    const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    if (objective.status === 'completed') {
      return {
        label: formattedDate,
        tag: 'Concluído',
        tagClass: 'text-slate-500 bg-slate-100',
        isOverdue: false,
      };
    }

    if (diffDays < 0) {
      return {
        label: formattedDate,
        tag: `Venceu há ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia' : 'dias'}`,
        tagClass: 'text-rose-700 bg-rose-50 border border-rose-200/60 font-semibold',
        isOverdue: true,
      };
    } else if (diffDays === 0) {
      return {
        label: formattedDate,
        tag: 'Vence hoje!',
        tagClass: 'text-amber-800 bg-amber-100/80 border border-amber-300 font-semibold',
        isOverdue: false,
      };
    } else if (diffDays === 1) {
      return {
        label: formattedDate,
        tag: 'Vence amanhã',
        tagClass: 'text-amber-700 bg-amber-50 border border-amber-200',
        isOverdue: false,
      };
    } else {
      return {
        label: formattedDate,
        tag: `Em ${diffDays} dias`,
        tagClass: 'text-slate-600 bg-slate-100',
        isOverdue: false,
      };
    }
  };

  const deadlineAnalysis = getDeadlineAnalysis(objective.deadline);

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between group ${
        objective.status === 'completed'
          ? 'border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20'
          : deadlineAnalysis?.isOverdue
          ? 'border-rose-200/90 shadow-xs'
          : 'border-slate-200/80 shadow-xs hover:border-indigo-200'
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Status e Ações */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.badgeBorder}`}
          >
            {objective.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {objective.status === 'in_progress' && <Clock className="w-3.5 h-3.5" />}
            {objective.status === 'not_started' && <PlayCircle className="w-3.5 h-3.5" />}
            {statusInfo.label}
          </span>

          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(objective)}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar objetivo ${objective.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(objective)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir objetivo ${objective.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold leading-snug tracking-tight mb-2 ${
            objective.status === 'completed'
              ? 'text-slate-600 line-through decoration-emerald-500/70'
              : 'text-slate-900'
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        {objective.description ? (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
            {objective.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">
            Sem descrição adicional.
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Botão Rápido de Status */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        {/* Informação do Prazo */}
        {deadlineAnalysis && (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Prazo: {deadlineAnalysis.label}</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] ${deadlineAnalysis.tagClass}`}>
              {deadlineAnalysis.tag}
            </span>
          </div>
        )}

        {/* Ações rápidas de transição de status para facilitar a vida do estudante */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end mt-1 sm:mt-0">
          {objective.status === 'not_started' && (
            <button
              onClick={() => onStatusChange(objective.id, 'in_progress')}
              className="px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3 h-3" />
              <span>Iniciar estudo</span>
            </button>
          )}

          {objective.status === 'in_progress' && (
            <button
              onClick={() => onStatusChange(objective.id, 'completed')}
              className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Concluir</span>
            </button>
          )}

          {objective.status === 'completed' && (
            <button
              onClick={() => onStatusChange(objective.id, 'in_progress')}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Reabrir objetivo"
            >
              <span>Reabrir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
