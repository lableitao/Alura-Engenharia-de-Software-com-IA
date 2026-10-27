import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Objective } from '../types/objective';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  objective: Objective | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  objective,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !objective) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-base font-bold text-slate-800">
                Confirmar exclusão
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Você tem certeza que deseja excluir o objetivo{' '}
                <span className="font-semibold text-slate-900">"{objective.title}"</span>?
              </p>
              <p className="text-xs text-rose-600 font-medium mt-2 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                Esta ação removerá o objetivo permanentemente da sua lista.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(objective.id)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
