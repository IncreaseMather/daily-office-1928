import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

/**
 * Returns a reactive Date that re-evaluates whenever the app comes to the
 * foreground. Screens that use this instead of `new Date()` will automatically
 * show the correct liturgical day after an overnight or cross-noon interruption.
 */
export function useToday(): Date {
  const [today, setToday] = useState(() => new Date());
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        setToday(new Date());
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  return today;
}

/** Day of month (1–30) for psalm rotation. Day 31 uses day 30. */
export function getPsalterDay(date: Date = new Date()): number {
  const d = date.getDate();
  return d > 30 ? 30 : d;
}

/** MM-DD key for lectionary lookup. */
export function getLectionaryKey(date: Date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

/** "Tuesday, the 11th of March, 2026" */
export function formatLiturgicalDate(date: Date = new Date()): string {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const n = date.getDate();
  const sfx = n >= 11 && n <= 13 ? 'th'
    : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th';
  return `${days[date.getDay()]}, the ${n}${sfx} of ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

/** Morning before noon, Evening from noon onward. */
export function getInitialOffice(): 'Morning Prayer' | 'Evening Prayer' {
  return new Date().getHours() < 12 ? 'Morning Prayer' : 'Evening Prayer';
}
