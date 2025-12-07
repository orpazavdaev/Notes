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
import { COLORS, HEBREW_MONTHS } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import DateTimePicker from './DateTimePicker';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, date: string, time: string, tagIds?: string[]) => void;
  selectedDate?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onAdd,
  selectedDate: initialDate,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const { customTags } = useSettings();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate || '');
  const [time, setTime] = useState('09:00');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Update date when modal opens with a new date
  useEffect(() => {
    if (visible && initialDate) {
      setDate(initialDate);
    }
  }, [visible, initialDate]);

  const handleAdd = () => {
    if (title.trim()) {
      const finalDate = date || new Date().toISOString().split('T')[0];
      onAdd(title.trim(), description.trim(), finalDate, time, selectedTagIds.length > 0 ? selectedTagIds : undefined);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('09:00');
    setSelectedTagIds([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
                <View style={styles.headerSpacer} />
                <Text style={styles.headerTitle}>משימה חדשה</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
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
                    {customTags.map(tag => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      return (
                        <TouchableOpacity
                          key={tag.id}
                          style={[
                            styles.tagButton,
                            { backgroundColor: isSelected ? tag.bgColor : COLORS.grayBg },
                          ]}
                          onPress={() => toggleTag(tag.id)}
                        >
                          <Text style={[
                            styles.tagText,
                            { color: isSelected ? tag.color : COLORS.gray },
                            isSelected && { fontWeight: '600' },
                          ]}>
                            {tag.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Date Button */}
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {date ? formatDisplayDate(date) : 'הוסף תאריך'}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.gray} />
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
                  onPress={handleAdd}
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
        initialTime={time}
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
  headerSpacer: {
    width: 22,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },
  closeButton: {
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
  },
  tagText: {
    fontSize: 13,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.grayBg,
    borderRadius: 10,
    marginBottom: 16,
    gap: 6,
  },
  dateButtonText: {
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

export default AddTaskModal;
