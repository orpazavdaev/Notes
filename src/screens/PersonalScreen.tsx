import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, CustomTag } from '../context/SettingsContext';
import { COLORS, SHADOWS } from '../constants/theme';

const COLOR_OPTIONS = [
  { color: '#B8860B', bgColor: '#FFF8DC' },
  { color: '#2E8B57', bgColor: '#E0F5E9' },
  { color: '#4A90D9', bgColor: '#E3F2FD' },
  { color: '#DB7093', bgColor: '#FFE4EC' },
  { color: '#E07850', bgColor: '#FFEEE8' },
  { color: '#9370DB', bgColor: '#F3E8FF' },
  { color: '#20B2AA', bgColor: '#E0FFFF' },
  { color: '#CD5C5C', bgColor: '#FFE4E1' },
  { color: '#6B8E23', bgColor: '#F5FFFA' },
  { color: '#708090', bgColor: '#F0F8FF' },
];

const PersonalScreen: React.FC = () => {
  const { customTags, personalNotes, addTag, updateTag, deleteTag, setPersonalNotes } = useSettings();
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState<CustomTag | null>(null);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const handleSaveTag = () => {
    if (newTagLabel.trim()) {
      if (editingTag) {
        updateTag(editingTag.id, {
          label: newTagLabel.trim(),
          color: selectedColor.color,
          bgColor: selectedColor.bgColor,
        });
      } else {
        addTag({
          label: newTagLabel.trim(),
          color: selectedColor.color,
          bgColor: selectedColor.bgColor,
        });
      }
      resetTagForm();
    }
  };

  const resetTagForm = () => {
    setNewTagLabel('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setEditingTag(null);
    setShowAddTagModal(false);
  };

  const openEditTag = (tag: CustomTag) => {
    setEditingTag(tag);
    setNewTagLabel(tag.label);
    const colorOption = COLOR_OPTIONS.find(c => c.color === tag.color) || COLOR_OPTIONS[0];
    setSelectedColor(colorOption);
    setShowAddTagModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.grayBg} />
      
      <View style={styles.header}>
        <Text style={styles.title}>אזור אישי</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tags Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddTagModal(true)}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>התגיות שלי</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {customTags.map(tag => (
              <TouchableOpacity
                key={tag.id}
                style={[styles.tagItem, { backgroundColor: tag.bgColor }]}
                onPress={() => openEditTag(tag)}
              >
                <Text style={[styles.tagLabel, { color: tag.color }]}>{tag.label}</Text>
                <TouchableOpacity
                  style={styles.deleteTagButton}
                  onPress={() => deleteTag(tag.id)}
                >
                  <Ionicons name="close-circle" size={18} color={tag.color} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personal Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הערות אישיות</Text>
          <View style={styles.notesContainer}>
            <TextInput
              style={styles.notesInput}
              placeholder="כתבי כאן הערות אישיות..."
              placeholderTextColor={COLORS.gray}
              value={personalNotes}
              onChangeText={setPersonalNotes}
              multiline
              textAlign="right"
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Add/Edit Tag Modal */}
      <Modal visible={showAddTagModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ width: 24 }} />
              <Text style={styles.modalTitle}>
                {editingTag ? 'עריכת תגית' : 'תגית חדשה'}
              </Text>
              <TouchableOpacity onPress={resetTagForm}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>שם התגית</Text>
              <TextInput
                style={styles.tagInput}
                placeholder="הכנס שם..."
                placeholderTextColor={COLORS.gray}
                value={newTagLabel}
                onChangeText={setNewTagLabel}
                textAlign="right"
              />

              <Text style={styles.inputLabel}>בחר צבע</Text>
              <View style={styles.colorOptionsContainer}>
                {COLOR_OPTIONS.map((colorOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: colorOption.bgColor, borderColor: colorOption.color },
                      selectedColor.color === colorOption.color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(colorOption)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: colorOption.color }]} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preview */}
              <Text style={styles.inputLabel}>תצוגה מקדימה</Text>
              <View style={styles.previewContainer}>
                <View style={[styles.previewTag, { backgroundColor: selectedColor.bgColor }]}>
                  <Text style={[styles.previewTagText, { color: selectedColor.color }]}>
                    {newTagLabel || 'תגית'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, !newTagLabel.trim() && styles.saveButtonDisabled]}
              onPress={handleSaveTag}
              disabled={!newTagLabel.trim()}
            >
              <Text style={styles.saveButtonText}>שמור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'right',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteTagButton: {
    marginLeft: 4,
  },
  notesContainer: {
    backgroundColor: COLORS.grayBg,
    borderRadius: 12,
    marginTop: 8,
  },
  notesInput: {
    padding: 16,
    fontSize: 15,
    color: COLORS.black,
    minHeight: 150,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'right',
    marginBottom: 8,
    marginTop: 12,
  },
  tagInput: {
    backgroundColor: COLORS.grayBg,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 10,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  previewContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  previewTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  previewTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'flex-start',
    margin: 16,
    marginTop: 0,
  },
  saveButtonDisabled: {
    backgroundColor: '#FFDAB3',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default PersonalScreen;

