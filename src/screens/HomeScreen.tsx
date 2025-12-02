import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { COLORS, SHADOWS } from '../constants/theme';

type FilterType = 'today' | 'upcoming' | 'all';

const HomeScreen: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const today = new Date().toISOString().split('T')[0];

  const { todayTasks, upcomingTasks, allTasks } = useMemo(() => {
    const todayList = tasks.filter(task => task.date === today);
    const upcomingList = tasks.filter(task => task.date > today);
    const allList = [...tasks];
    return { todayTasks: todayList, upcomingTasks: upcomingList, allTasks: allList };
  }, [tasks, today]);

  const todayCount = todayTasks.filter(t => !t.completed).length;
  const upcomingCount = upcomingTasks.filter(t => !t.completed).length;
  const allCount = allTasks.filter(t => !t.completed).length;

  const filteredTasks = filter === 'today' ? todayTasks : filter === 'upcoming' ? upcomingTasks : allTasks;

  const handleAddTask = (title: string, description: string, date: string, time: string, tagIds?: string[]) => {
    addTask({ title, description, date, time, completed: false, tagIds });
  };

  const handleUpdateTask = (id: string, title: string, description: string, date: string, time: string, tagIds?: string[]) => {
    updateTask(id, { title, description, date, time, tagIds });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.grayBg} />
      
      <View style={styles.header}>
        <Text style={styles.title}>המשימות שלי</Text>
      </View>

      {/* Toggle Filter */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              filter === 'upcoming' && styles.toggleButtonActive,
            ]}
            onPress={() => setFilter('upcoming')}
          >
            <Text style={[
              styles.toggleText,
              filter === 'upcoming' && styles.toggleTextActive,
            ]}>
              בקרוב ({upcomingCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              filter === 'today' && styles.toggleButtonActive,
            ]}
            onPress={() => setFilter('today')}
          >
            <Text style={[
              styles.toggleText,
              filter === 'today' && styles.toggleTextActive,
            ]}>
              היום ({todayCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              filter === 'all' && styles.toggleButtonActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.toggleText,
              filter === 'all' && styles.toggleTextActive,
            ]}>
              הכל ({allCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TaskList
        tasks={filteredTasks}
        onTaskPress={setEditingTask}
        onToggleComplete={toggleComplete}
        onDeleteTask={deleteTask}
        emptyMessage={
          filter === 'today' ? 'אין משימות להיום' : 
          filter === 'upcoming' ? 'אין משימות קרובות' : 
          'אין משימות'
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={32} color={COLORS.white} />
      </TouchableOpacity>

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.grayBg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },
  toggleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 4,
    ...SHADOWS.small,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
});

export default HomeScreen;
