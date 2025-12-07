import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { COLORS } from '../constants/theme';

interface TaskListProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  emptyMessage?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  onToggleComplete,
  onDeleteTask,
  emptyMessage = 'אין משימות להצגה',
}) => {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubtext}>לחץ על + להוספת משימה חדשה</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={() => onTaskPress(item)}
          onToggleComplete={() => onToggleComplete(item.id)}
          onDelete={() => onDeleteTask(item.id)}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TaskList;




