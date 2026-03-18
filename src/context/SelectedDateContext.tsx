import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

interface SelectedDateContextValue {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  isViewingToday: boolean;
  resetToToday: () => void;
}

const SelectedDateContext = createContext<SelectedDateContextValue | null>(null);

export function SelectedDateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        // Reset to real today whenever the app returns to foreground
        setSelectedDate(new Date());
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  const resetToToday = () => setSelectedDate(new Date());
  const isViewingToday = isSameDay(selectedDate, new Date());

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate, isViewingToday, resetToToday }}>
      {children}
    </SelectedDateContext.Provider>
  );
}

export function useSelectedDate(): SelectedDateContextValue {
  const ctx = useContext(SelectedDateContext);
  if (!ctx) throw new Error('useSelectedDate must be used within SelectedDateProvider');
  return ctx;
}
