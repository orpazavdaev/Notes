import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = '@my_tasks';

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};



