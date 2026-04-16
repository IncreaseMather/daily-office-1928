import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, Pressable, StyleSheet,
} from 'react-native';
import { useTheme } from '../context/SettingsContext';
import { Typography } from '../theme';
import { isSameDay } from '../context/SelectedDateContext';
import { getFeastDay } from '../utils/liturgicalCalendar';

const MONTH_NAMES = [
  'January', 'February', 'March',    'April',   'May',      'June',
  'July',    'August',   'September', 'October', 'November', 'December',
];
const DOW_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface Props {
  visible: boolean;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  onClose: () => void;
}

export function CalendarPicker({ visible, selectedDate, onSelectDate, onClose }: Props) {
  const { colors, sizes } = useTheme();
  const today = new Date();

  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear,  setViewYear]  = useState(selectedDate.getFullYear());

  // Sync to the selected date's month whenever the modal opens
  useEffect(() => {
    if (visible) {
      setViewMonth(selectedDate.getMonth());
      setViewYear(selectedDate.getFullYear());
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else                  setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else                   setViewMonth(m => m + 1);
  }

  function selectDay(day: number) {
    onSelectDate(new Date(viewYear, viewMonth, day));
    onClose();
  }

  function goToToday() {
    const t = new Date();
    onSelectDate(t);
    setViewMonth(t.getMonth());
    setViewYear(t.getFullYear());
    onClose();
  }

  // Build calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const isSelected = (d: number) =>
    isSameDay(selectedDate, new Date(viewYear, viewMonth, d));
  const isToday = (d: number) =>
    isSameDay(today, new Date(viewYear, viewMonth, d));
  const isFeastOrSunday = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    return date.getDay() === 0 || getFeastDay(date) !== null;
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.overlay} onPress={onClose}>
        <Pressable
          style={[st.sheet, { backgroundColor: colors.parchment, borderColor: colors.rule }]}
          onPress={e => e.stopPropagation()}
        >
          {/* Month / year navigation */}
          <View style={st.header}>
            <TouchableOpacity onPress={prevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[st.chevron, { color: colors.ink }]}>‹</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.subheading, color: colors.ink }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[st.chevron, { color: colors.ink }]}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day-of-week header row */}
          <View style={st.row}>
            {DOW_LABELS.map(dow => (
              <View key={dow} style={st.cell}>
                <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.rubric, color: colors.inkLight }}>
                  {dow}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar rows */}
          {rows.map((row, ri) => (
            <View key={ri} style={st.row}>
              {row.map((day, ci) => {
                if (!day) return <View key={ci} style={st.cell} />;
                const sel = isSelected(day);
                const tod = isToday(day);
                const feast = isFeastOrSunday(day);
                return (
                  <TouchableOpacity
                    key={ci}
                    style={st.cell}
                    onPress={() => selectDay(day)}
                    activeOpacity={0.65}
                  >
                    <View style={[
                      st.dayCircle,
                      sel && { backgroundColor: colors.ink },
                      !sel && tod && { borderWidth: 1.5, borderColor: colors.rubric },
                    ]}>
                      <Text style={{
                        fontFamily: sel ? Typography.serifBold : Typography.serif,
                        fontSize: sizes.body,
                        color: sel ? colors.parchment : feast ? colors.rubric : colors.ink,
                      }}>
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Today button */}
          <View style={[st.footer, { borderTopColor: colors.rule }]}>
            <TouchableOpacity
              style={[st.todayBtn, { borderColor: colors.inkLight }]}
              onPress={goToToday}
              activeOpacity={0.7}
            >
              <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.body, color: colors.ink }}>
                Today
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const CELL = 40;

const st = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: 308,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  chevron: {
    fontFamily: Typography.serifBold,
    fontSize: 24,
    lineHeight: 30,
    paddingHorizontal: 4,
  } as any,
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    borderTopWidth: 1,
    marginTop: 6,
    paddingTop: 10,
    alignItems: 'center',
  },
  todayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 36,
    borderWidth: 1,
    borderRadius: 4,
  },
});
