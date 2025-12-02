import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import Calendar from '../components/Calendar';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { COLORS, HEBREW_MONTHS } from '../constants/theme';

const CalendarScreen: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, getTasksByDate } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasksForDate = getTasksByDate(selectedDate);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  const handleAddTask = (title: string, description: string, date: string, time: string, tagIds?: string[]) => {
    addTask({ title, description, date, time, completed: false, tagIds });
  };

  const handleUpdateTask = (id: string, title: string, description: string, date: string, time: string, tagIds?: string[]) => {
    updateTask(id, { title, description, date, time, tagIds });
  };

  const formatSelectedDate = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    return `${day} ${HEBREW_MONTHS[month - 1]}, ${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.grayBg} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Calendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />

        {tasksForDate.length > 0 && (
          <View style={styles.tasksSection}>
            <View style={styles.tasksSectionHeader}>
              <Text style={styles.tasksSectionTitle}>
                משימות ל-{formatSelectedDate()}
              </Text>
            </View>

            {/* Use map instead of FlatList to avoid nesting issue */}
            <View style={styles.tasksList}>
              {tasksForDate.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onPress={() => setEditingTask(task)}
                  onToggleComplete={() => toggleComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
        selectedDate={selectedDate}
      />

      <EditTaskModal
        visible={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
        onDelete={(id) => {
          deleteTask(id);
          setEditingTask(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grayBg,
  },
  scrollView: {
    flex: 1,
  },
  tasksSection: {
    marginTop: 20,
    paddingBottom: 100,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  tasksSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'right',
  },
  tasksList: {
    paddingVertical: 8,
  },
});

export default CalendarScreen;
