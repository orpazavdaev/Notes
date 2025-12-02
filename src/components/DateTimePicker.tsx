import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, HEBREW_MONTHS } from '../constants/theme';

interface DateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  initialDate?: string;
  initialTime?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
  initialTime,
}) => {
  const parseInitialDate = () => {
    if (initialDate) {
      const [year, month, day] = initialDate.split('-').map(Number);
      return { year, month: month - 1, day };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  };

  const parseInitialTime = () => {
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      return { hours, minutes };
    }
    return { hours: 9, minutes: 0 };
  };

  const [selectedDate, setSelectedDate] = useState(parseInitialDate);
  const [selectedTime, setSelectedTime] = useState(parseInitialTime);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleConfirm = () => {
    const dateStr = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    const timeStr = `${String(selectedTime.hours).padStart(2, '0')}:${String(selectedTime.minutes).padStart(2, '0')}`;
    onConfirm(dateStr, timeStr);
  };

  const changeMonth = (delta: number) => {
    let newMonth = selectedDate.month + delta;
    let newYear = selectedDate.year;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    const daysInNewMonth = getDaysInMonth(newYear, newMonth);
    const newDay = Math.min(selectedDate.day, daysInNewMonth);

    setSelectedDate({ year: newYear, month: newMonth, day: newDay });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
    const firstDay = new Date(selectedDate.year, selectedDate.month, 1).getDay();
    const days: React.ReactNode[] = [];

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate.day;
      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, isSelected && styles.selectedDayCell]}
          onPress={() => setSelectedDate({ ...selectedDate, day })}
        >
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {HEBREW_MONTHS[selectedDate.month]} {selectedDate.year}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
        <View style={styles.dayHeaders}>
          {dayHeaders.map((header) => (
            <Text key={header} style={styles.dayHeader}>{header}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    );
  };

  const renderTimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 15, 30, 45];

    return (
      <View style={styles.timePickerContainer}>
        <Text style={styles.timeLabel}>Time</Text>
        <View style={styles.timeRow}>
          <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.timeOption,
                  selectedTime.hours === hour && styles.selectedTimeOption,
                ]}
                onPress={() => setSelectedTime({ ...selectedTime, hours: hour })}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    selectedTime.hours === hour && styles.selectedTimeText,
                  ]}
                >
                  {String(hour).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.timeSeparator}>:</Text>
          <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.timeOption,
                  selectedTime.minutes === minute && styles.selectedTimeOption,
                ]}
                onPress={() => setSelectedTime({ ...selectedTime, minutes: minute })}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    selectedTime.minutes === minute && styles.selectedTimeText,
                  ]}
                >
                  {String(minute).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text style={styles.selectedTimeDisplay}>
          {String(selectedTime.hours).padStart(2, '0')}:{String(selectedTime.minutes).padStart(2, '0')}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>בחירת תאריך ושעה</Text>
          
          {renderCalendar()}
          {renderTimePicker()}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>ביטול</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>אישור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 350,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.black,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  timePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  timeScroll: {
    width: 60,
    maxHeight: 120,
  },
  timeOption: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: 8,
  },
  timeOptionText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  selectedTimeText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 24,
    color: COLORS.black,
    marginHorizontal: 10,
  },
  selectedTimeDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.grayLight,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default DateTimePicker;


