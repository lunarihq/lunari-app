import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
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

  const clearNotes = useCallback(() => {
    setNotes('');
  }, []);

  // Clear notes when app is locked
  useEffect(() => {
    if (isLocked) {
      clearNotes();
    }
  }, [isLocked, clearNotes]);

  const value = useMemo(
    () => ({ notes, setNotes, clearNotes }),
    [notes, clearNotes]
  );

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
