import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Task } from '../types';
import { useSettings } from '../context/SettingsContext';
import { COLORS } from '../constants/theme';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onPress,
  onToggleComplete,
  onDelete,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { customTags } = useSettings();

  const taskTags = (task.tagIds || [])
    .map(tagId => customTags.find(t => t.id === tagId))
    .filter(Boolean);

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        task.completed && styles.completedContainer,
        isDesktop && styles.containerDesktop,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.colorStrip, task.completed && styles.completedStrip]} />
      
      <View style={styles.content}>
        <View style={styles.mainRow}>
          {/* Tags on the left */}
          <View style={styles.tagsContainer}>
            {taskTags.map((tag, idx) => {
              if (!tag) return null;
              return (
                <View 
                  key={idx} 
                  style={[styles.tagBadge, { backgroundColor: tag.bgColor }]}
                >
                  <Text style={[styles.tagText, { color: tag.color }]}>
                    {tag.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Title and description on the right */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title, 
                task.completed && styles.completedTitle,
                isDesktop && styles.titleDesktop,
              ]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            {task.description ? (
              <Text
                style={[
                  styles.description, 
                  task.completed && styles.completedDescription,
                  isDesktop && styles.descriptionDesktop,
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            ) : null}
          </View>

          {/* Checkbox */}
          <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
            onPress={onToggleComplete}
          >
            {task.completed && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  containerDesktop: {
    marginHorizontal: 24,
    marginVertical: 8,
  },
  completedContainer: {
    opacity: 0.6,
  },
  colorStrip: {
    width: 4,
    backgroundColor: COLORS.primary,
  },
  completedStrip: {
    backgroundColor: COLORS.success,
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'right',
    marginBottom: 4,
  },
  titleDesktop: {
    fontSize: 18,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.gray,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'right',
    lineHeight: 20,
  },
  descriptionDesktop: {
    fontSize: 15,
    lineHeight: 22,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    maxWidth: 140,
    gap: 4,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TaskItem;
