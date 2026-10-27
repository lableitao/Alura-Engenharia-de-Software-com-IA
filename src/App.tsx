/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FiltersBar } from './components/FiltersBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { storageService } from './services/storageService';
import { Objective, ObjectiveFormData, ObjectiveStatus } from './types/objective';
import { Lightbulb, CheckCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de controle de modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<Objective | null>(null);

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<ObjectiveStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Notificação suave de ação executada (feedback ao usuário)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Carrega os objetivos salvos do localStorage no primeiro carregamento
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
    setIsLoaded(true);
  }, []);

  // Criação ou Edição de objetivo
  const handleFormSubmit = (data: ObjectiveFormData) => {
    if (editingObjective) {
      // Edição
      const updated = storageService.updateObjective(editingObjective.id, data);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      // Criação
      const created = storageService.createObjective(data);
      setObjectives((prev) => [created, ...prev]);
      showToast('Objetivo cadastrado com sucesso!');
    }
    setEditingObjective(null);
  };

  // Abertura do modal de criação
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abertura do modal de edição
  const handleOpenEditModal = (obj: Objective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Abertura do modal de confirmação de exclusão
  const handleRequestDelete = (obj: Objective) => {
    setObjectiveToDelete(obj);
    setIsDeleteModalOpen(true);
  };

  // Confirmação de exclusão
  const handleConfirmDelete = (id: string) => {
    const success = storageService.deleteObjective(id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== id));
      showToast('Objetivo excluído.');
    }
    setIsDeleteModalOpen(false);
    setObjectiveToDelete(null);
  };

  // Mudança rápida de status
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateObjective(id, { status: newStatus });
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (newStatus === 'completed') {
        showToast('Parabéns! Mais um objetivo concluído!');
      }
    }
  };

  // Recarregar exemplos de objetivos caso deseje
  const handleLoadSamples = () => {
    const samples = storageService.resetToSampleData();
    setObjectives(samples);
    showToast('Exemplos de objetivos carregados!');
  };

  // Contadores para as abas de filtro
  const counts = useMemo(() => {
    return {
      all: objectives.length,
      not_started: objectives.filter((o) => o.status === 'not_started').length,
      in_progress: objectives.filter((o) => o.status === 'in_progress').length,
      completed: objectives.filter((o) => o.status === 'completed').length,
    };
  }, [objectives]);

  // Filtragem dos objetivos
  const filteredObjectives = useMemo(() => {
    return objectives.filter((obj) => {
      // Filtro por status
      if (statusFilter !== 'all' && obj.status !== statusFilter) {
        return false;
      }
      // Filtro por termo de busca (no título ou descrição)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = obj.title.toLowerCase().includes(query);
        const matchesDescription = obj.description.toLowerCase().includes(query);
        return matchesTitle || matchesDescription;
      }
      return true;
    });
  }, [objectives, statusFilter, searchTerm]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isFiltering = statusFilter !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* Notificação Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <Header onOpenCreateModal={handleOpenCreateModal} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Visão Geral e Quantidades Cadastradas */}
        <StatsOverview objectives={objectives} />

        {/* Dica amigável para estudantes iniciantes */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/70 border border-indigo-100/80 rounded-2xl p-4 mb-6 flex items-start gap-3 text-xs sm:text-sm text-slate-700 shadow-xs">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <strong className="font-semibold text-slate-900">Dica para iniciantes:</strong>{' '}
            Divida assuntos grandes em pequenos objetivos semanais. Ao marcar como{' '}
            <span className="text-emerald-700 font-semibold">Concluído</span>, você constrói
            o hábito consistente de estudo passo a passo!
          </div>
          {objectives.length === 0 && (
            <button
              onClick={handleLoadSamples}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0 ml-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Carregar exemplos
            </button>
          )}
        </div>

        {/* Barra de Filtros e Busca (exibida se houver objetivos ou busca ativa) */}
        {(objectives.length > 0 || isFiltering) && (
          <FiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            counts={counts}
          />
        )}

        {/* Listagem de Objetivos */}
        {filteredObjectives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredObjectives.map((obj) => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                onEdit={handleOpenEditModal}
                onDeleteRequest={handleRequestDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isFiltered={isFiltering}
            onOpenCreateModal={handleOpenCreateModal}
            onClearFilters={() => {
              setStatusFilter('all');
              setSearchTerm('');
            }}
            onLoadSamples={objectives.length === 0 ? handleLoadSamples : undefined}
          />
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <span className="font-semibold text-slate-700">StudyFlow</span> • Seu organizador de objetivos de estudo
          </p>
          <p className="text-slate-400">
            Seus dados são salvos com segurança diretamente no seu navegador.
          </p>
        </div>
      </footer>

      {/* Modal de Criação / Edição */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        objective={objectiveToDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setObjectiveToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
