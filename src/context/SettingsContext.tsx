import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomTag {
  id: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsContextType {
  customTags: CustomTag[];
  notes: Note[];
  addTag: (tag: Omit<CustomTag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<CustomTag>) => void;
  deleteTag: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const TAGS_KEY = '@custom_tags';
const NOTES_KEY = '@user_notes';

const defaultTags: CustomTag[] = [
  { id: '1', label: 'אישי', color: '#EE6983', bgColor: '#FFC4C4' },
  { id: '2', label: 'נופש', color: '#2E8B57', bgColor: '#E0F5E9' },
  { id: '3', label: 'עבודה', color: '#4A90D9', bgColor: '#E3F2FD' },
  { id: '4', label: 'בריאות', color: '#DB7093', bgColor: '#FFE4EC' },
  { id: '5', label: 'ספורט', color: '#E07850', bgColor: '#FFEEE8' },
  { id: '6', label: 'לימודים', color: '#9370DB', bgColor: '#F3E8FF' },
];

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customTags, setCustomTags] = useState<CustomTag[]>(defaultTags);
  const [notes, setNotes] = useState<Note[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const tagsJson = await AsyncStorage.getItem(TAGS_KEY);
        const notesJson = await AsyncStorage.getItem(NOTES_KEY);
        
        if (tagsJson) {
          setCustomTags(JSON.parse(tagsJson));
        }
        if (notesJson) {
          setNotes(JSON.parse(notesJson));
        }
        isInitialized.current = true;
      } catch (error) {
        console.error('Error loading settings:', error);
        isInitialized.current = true;
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (isInitialized.current) {
      AsyncStorage.setItem(TAGS_KEY, JSON.stringify(customTags));
    }
  }, [customTags]);

  useEffect(() => {
    if (isInitialized.current) {
      AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const addTag = (tagData: Omit<CustomTag, 'id'>) => {
    const newTag: CustomTag = {
      ...tagData,
      id: generateId(),
    };
    setCustomTags(prev => [...prev, newTag]);
  };

  const updateTag = (id: string, updates: Partial<CustomTag>) => {
    setCustomTags(prev =>
      prev.map(tag => (tag.id === id ? { ...tag, ...updates } : tag))
    );
  };

  const deleteTag = (id: string) => {
    setCustomTags(prev => prev.filter(tag => tag.id !== id));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() } 
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <SettingsContext.Provider
      value={{
        customTags,
        notes,
        addTag,
        updateTag,
        deleteTag,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};



