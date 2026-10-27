import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Objective, ObjectiveFormData, ObjectiveStatus } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData) => void;
  initialData?: Objective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('not_started');
  const [errorMessage, setErrorMessage] = useState('');

  // Sincroniza formulário com initialData quando abrir ou alterar modo
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status);
    } else {
      // Valores padrão para criação
      setTitle('');
      setDescription('');
      // Sugere uma data padrão para daqui a 7 dias
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setDeadline(defaultDate);
      setStatus('not_started');
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (!deadline) {
      setErrorMessage('Por favor, selecione um prazo para conclusão.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });

    onClose();
  };

  // Atalhos práticos de prazo para estudantes iniciantes
  const setQuickDeadline = (daysFromNow: number) => {
    const target = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    setDeadline(target.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-800">
                {initialData ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {initialData
                  ? 'Ajuste os detalhes e acompanhe sua evolução'
                  : 'Defina uma meta clara para orientar seu aprendizado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com rolagem segura em telas menores */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Campo: Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ex: Aprender a usar funções em JavaScript"
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dica: Seja específico no que você quer aprender ou praticar.
            </p>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Descrição ou anotações de estudo (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir aos módulos 1 a 3, fazer os exercícios de fixação e resumir no caderno."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Campo: Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Prazo de conclusão <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDeadline(3)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  +3 dias
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  +1 semana
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(15)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  +15 dias
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Status inicial
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('not_started')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === 'not_started'
                    ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Não iniciado
              </button>
              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === 'in_progress'
                    ? 'border-sky-400 bg-sky-50 text-sky-800 ring-2 ring-sky-400/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Em andamento
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === 'completed'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Concluído
              </button>
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {initialData ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
