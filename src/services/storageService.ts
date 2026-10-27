/**
 * Serviço de armazenamento local (localStorage) para o StudyFlow
 */

import { Objective, ObjectiveFormData } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

// Dados iniciais acolhedores para estudantes iniciantes caso o storage esteja vazio
const DEFAULT_INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'obj-sample-1',
    title: 'Aprender conceitos básicos de Lógica de Programação',
    description: 'Estudar variáveis, condicionais (if/else) e laços de repetição (for/while) com exemplos práticos.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'obj-sample-2',
    title: 'Ler 2 capítulos do livro de Redação e Interpretação',
    description: 'Fazer resumos dos capítulos e responder aos 5 exercícios de fixação ao final de cada capítulo.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'not_started',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'obj-sample-3',
    title: 'Criar cronograma semanal de estudos',
    description: 'Definir horários fixos de 45 minutos diários com método Pomodoro para manter o foco constante.',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém a lista de objetivos do localStorage.
   * Se for o primeiro acesso, inicializa com exemplos acolhedores.
   */
  getObjectives(): Objective[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Inicializa com exemplos para estudantes iniciantes verem o funcionamento de imediato
        this.saveObjectives(DEFAULT_INITIAL_OBJECTIVES);
        return DEFAULT_INITIAL_OBJECTIVES;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva toda a lista de objetivos no localStorage.
   */
  saveObjectives(objectives: Objective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e adiciona um novo objetivo.
   */
  createObjective(data: ObjectiveFormData): Objective {
    const now = new Date().toISOString();
    const newObjective: Objective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const current = this.getObjectives();
    const updated = [newObjective, ...current];
    this.saveObjectives(updated);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateObjective(id: string, data: Partial<ObjectiveFormData>): Objective | null {
    const current = this.getObjectives();
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const existing = current[index];
    const updatedObjective: Objective = {
      ...existing,
      ...data,
      title: data.title !== undefined ? data.title.trim() : existing.title,
      description: data.description !== undefined ? data.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    current[index] = updatedObjective;
    this.saveObjectives(current);
    return updatedObjective;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const current = this.getObjectives();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length === current.length) {
      return false;
    }
    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Restaura os dados de exemplo para o estudante explorar.
   */
  resetToSampleData(): Objective[] {
    this.saveObjectives(DEFAULT_INITIAL_OBJECTIVES);
    return DEFAULT_INITIAL_OBJECTIVES;
  },

  /**
   * Limpa todos os dados salvos.
   */
  clearAll(): void {
    this.saveObjectives([]);
  },
};
