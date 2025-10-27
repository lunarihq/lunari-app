import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: string;
  setNotes: (notes: string) => void;
  clearNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<string>('');
  const { isLocked } = useAuth();

  const clearNotes = () => {
    setNotes('');
  };

  // Clear notes when app is locked
  useEffect(() => {
    if (isLocked) {
      clearNotes();
    }
  }, [isLocked]);

  return (
    <NotesContext.Provider value={{ notes, setNotes, clearNotes }}>
      {children}
    </NotesContext.Provider>
  );
};
