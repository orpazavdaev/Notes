import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Task, TaskContextType } from '../types';
import { saveTasks, loadTasks, generateId } from '../utils/storage';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isInitialized = useRef(false);

  // Load tasks on mount
  useEffect(() => {
    loadTasks().then((loadedTasks) => {
      setTasks(loadedTasks);
      isInitialized.current = true;
    });
  }, []);

  // Save tasks when they change (after initial load)
  useEffect(() => {
    if (isInitialized.current) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksByDate = (date: string): Task[] => {
    return tasks.filter(task => task.date === date);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        getTasksByDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
