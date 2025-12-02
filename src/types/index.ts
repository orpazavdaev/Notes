export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  completed: boolean;
  createdAt: string;
  tagIds?: string[]; // IDs of custom tags from settings
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  getTasksByDate: (date: string) => Task[];
}
