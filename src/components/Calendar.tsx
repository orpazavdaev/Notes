import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, HEBREW_MONTHS } from '../constants/theme';
import { useTasks } from '../context/TaskContext';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const DAYS_HEADER = ['שבת', 'ו׳', 'ה׳', 'ד׳', 'ג׳', 'ב׳', 'א׳'];

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tasks } = useTasks();

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(task => task.date === dateStr && !task.completed);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getMonthShortName = (monthIndex: number) => {
    const shortNames = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];
    return shortNames[monthIndex];
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
        <Ionicons name="chevron-back" size={24} color={COLORS.black} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {HEBREW_MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </Text>
      <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
        <Ionicons name="chevron-forward" size={24} color={COLORS.black} />
      </TouchableOpacity>
    </View>
  );

  const renderDaysHeader = () => (
    <View style={styles.daysHeader}>
      {DAYS_HEADER.map((day, index) => (
        <View key={index} style={styles.dayHeaderCell}>
          <Text style={styles.dayHeaderText}>{day}</Text>
        </View>
      ))}
    </View>
  );

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: React.ReactNode[] = [];
    const today = new Date();
    const todayStr = formatDateString(today.getFullYear(), today.getMonth(), today.getDate());

    // Previous month days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    for (let i = 0; i < firstDay; i++) {
      const day = daysInPrevMonth - firstDay + i + 1;
      const isFirstOfPrevMonth = i === 0;
      days.push(
        <View key={`prev-${i}`} style={styles.dayCell}>
          <Text style={styles.otherMonthDay}>
            {isFirstOfPrevMonth ? `${day} ${getMonthShortName(prevMonth.getMonth())}` : day}
          </Text>
        </View>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;
      const dayTasks = getTasksForDate(dateStr);

      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayCell}
          onPress={() => onSelectDate(dateStr)}
        >
          <View style={[
            styles.dayNumber,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}>
            <Text
              style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
                isToday && !isSelected && styles.todayDayText,
              ]}
            >
              {day}
            </Text>
          </View>
          
          {/* Task badges */}
          {dayTasks.length > 0 && (
            <View style={styles.taskBadgesContainer}>
              {dayTasks.slice(0, 2).map((task, idx) => (
                <View key={idx} style={styles.taskBadge}>
                  <Text style={styles.taskBadgeText} numberOfLines={1}>
                    {task.title.length > 10 ? task.title.substring(0, 10) + '...' : task.title}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
    for (let i = 1; i <= nextMonthDays; i++) {
      const isFirstOfNextMonth = i === 1;
      days.push(
        <View key={`next-${i}`} style={styles.dayCell}>
          <Text style={styles.otherMonthDay}>
            {isFirstOfNextMonth ? `${i} ${getMonthShortName(nextMonth.getMonth())}` : i}
          </Text>
        </View>
      );
    }

    return <View style={styles.daysGrid}>{days}</View>;
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDaysHeader()}
      {renderDays()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 10,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  navButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },
  daysHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingBottom: 12,
    marginHorizontal: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    minHeight: 85,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  dayNumber: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  dayText: {
    fontSize: 15,
    color: COLORS.black,
  },
  otherMonthDay: {
    fontSize: 13,
    color: '#C7C7CC',
  },
  selectedDay: {
    backgroundColor: COLORS.primary,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  todayDay: {
    backgroundColor: '#FFF0E0',
  },
  todayDayText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  taskBadgesContainer: {
    width: '100%',
    paddingHorizontal: 2,
    marginTop: 4,
    alignItems: 'center',
  },
  taskBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 2,
    maxWidth: '95%',
  },
  taskBadgeText: {
    fontSize: 9,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Calendar;
