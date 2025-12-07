import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { COLORS, HEBREW_MONTHS } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import DateTimePicker from './DateTimePicker';

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (id: string, title: string, description: string, date: string, time: string, tagIds?: string[]) => void;
  onDelete: (id: string) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { customTags } = useSettings();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDate(task.date);
      setTime(task.time);
      setSelectedTagIds(task.tagIds || []);
    }
  }, [task]);

  const handleSave = () => {
    if (task && title.trim()) {
      onSave(task.id, title.trim(), description.trim(), date, time, selectedTagIds.length > 0 ? selectedTagIds : undefined);
      onClose();
    }
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleClearDate = () => {
    setDate('');
    setTime('');
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    return `${day} ${HEBREW_MONTHS[month - 1].substring(0, 4)}'`;
  };

  const modalWidth = isDesktop ? Math.min(450, width * 0.5) : width - 32;

  if (!task) return null;

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.keyboardView, { maxWidth: modalWidth }]}
          >
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.gray} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>עריכת משימה</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={22} color={COLORS.gray} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
              >
                {/* Title Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.titleInput}
                    placeholder="כותרת"
                    placeholderTextColor={COLORS.gray}
                    value={title}
                    onChangeText={setTitle}
                    textAlign="right"
                  />
                </View>

                {/* Description Input */}
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.descriptionInput}
                    placeholder="תוכן המשימה..."
                    placeholderTextColor={COLORS.gray}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlign="right"
                    textAlignVertical="top"
                  />
                </View>

                {/* Tags Section */}
                <View style={styles.tagsSection}>
                  <Text style={styles.tagsLabel}>תגיות</Text>
                  <View style={styles.tagsRow}>
                    {customTags.map((tag) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      return (
                        <TouchableOpacity
                          key={tag.id}
                          style={[
                            styles.tagButton,
                            isSelected && { backgroundColor: tag.bgColor },
                          ]}
                          onPress={() => toggleTag(tag.id)}
                        >
                          <Text style={[
                            styles.tagText,
                            isSelected && { color: tag.color, fontWeight: '600' },
                          ]}>
                            {tag.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Date Section */}
                <View style={styles.dateSection}>
                  {date && (
                    <TouchableOpacity onPress={handleClearDate}>
                      <Text style={styles.clearDateText}>נקה תאריך</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {date ? formatDisplayDate(date) : 'הוסף תאריך'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={!title.trim()}
                >
                  <Text style={styles.saveButtonText}>שמור</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <DateTimePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(newDate, newTime) => {
          setDate(newDate);
          setTime(newTime);
          setShowDatePicker(false);
        }}
        initialDate={date || new Date().toISOString().split('T')[0]}
        initialTime={time || '09:00'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardView: {
    width: '100%',
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },
  closeButton: {
    padding: 2,
  },
  deleteButton: {
    padding: 2,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: COLORS.grayBg,
    borderRadius: 10,
    marginBottom: 12,
  },
  titleInput: {
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
  },
  descriptionInput: {
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
    height: 100,
  },
  tagsSection: {
    marginBottom: 12,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'right',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
  },
  tagButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.grayBg,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.gray,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
    gap: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.grayBg,
    borderRadius: 10,
    gap: 6,
  },
  dateButtonText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  clearDateText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  saveButtonDisabled: {
    backgroundColor: '#FFC4C4',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default EditTaskModal;
