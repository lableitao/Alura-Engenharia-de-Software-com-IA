/**
 * Tipos e interfaces de dados para o StudyFlow
 */

export type ObjectiveStatus = 'not_started' | 'in_progress' | 'completed';

export interface Objective {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export interface StatusOption {
  value: ObjectiveStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const STATUS_CONFIG: Record<ObjectiveStatus, StatusOption> = {
  not_started: {
    value: 'not_started',
    label: 'Não iniciado',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/60',
  },
  in_progress: {
    value: 'in_progress',
    label: 'Em andamento',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/60',
  },
  completed: {
    value: 'completed',
    label: 'Concluído',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/60',
  },
};
