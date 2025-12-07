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
  Image,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, CustomTag, Note } from '../context/SettingsContext';
import { COLORS, SHADOWS } from '../constants/theme';

const COLOR_OPTIONS = [
  { color: '#EE6983', bgColor: '#FFC4C4' },
  { color: '#850E35', bgColor: '#FFDEDE' },
  { color: '#4A90D9', bgColor: '#E3F2FD' },
  { color: '#9370DB', bgColor: '#F3E8FF' },
  { color: '#2E8B57', bgColor: '#E0F5E9' },
  { color: '#E07850', bgColor: '#FFEEE8' },
  { color: '#20B2AA', bgColor: '#E0FFFF' },
  { color: '#CD5C5C', bgColor: '#FFE4E1' },
  { color: '#6B8E23', bgColor: '#F5FFFA' },
  { color: '#708090', bgColor: '#F0F8FF' },
];

const PersonalScreen: React.FC = () => {
  const { customTags, notes, addTag, updateTag, deleteTag, addNote, updateNote, deleteNote } = useSettings();
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState<CustomTag | null>(null);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  // Notes state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notePassword, setNotePassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);

  // Password unlock state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [noteToUnlock, setNoteToUnlock] = useState<Note | null>(null);
  const [unlockedNotes, setUnlockedNotes] = useState<Set<string>>(new Set());

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

  // Notes handlers
  const handleSaveNote = () => {
    if (noteTitle.trim()) {
      const noteData = {
        title: noteTitle.trim(),
        content: noteContent,
        password: hasPassword && notePassword.trim() ? notePassword.trim() : undefined,
      };

      if (editingNote) {
        updateNote(editingNote.id, noteData);
      } else {
        addNote(noteData);
      }
      resetNoteForm();
    }
  };

  const resetNoteForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNotePassword('');
    setHasPassword(false);
    setEditingNote(null);
    setShowNoteModal(false);
  };

  const openEditNote = (note: Note) => {
    // If note has password and not unlocked, show password modal
    if (note.password && !unlockedNotes.has(note.id)) {
      setNoteToUnlock(note);
      setPasswordInput('');
      setShowPasswordModal(true);
      return;
    }

    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNotePassword(note.password || '');
    setHasPassword(!!note.password);
    setShowNoteModal(true);
  };

  const openNewNote = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNotePassword('');
    setHasPassword(false);
    setShowNoteModal(true);
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Alert.alert(
      'מחיקת הערה',
      `האם אתה בטוח שברצונך למחוק את "${noteTitle}"?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'מחק', style: 'destructive', onPress: () => deleteNote(noteId) },
      ]
    );
  };

  const handleUnlockNote = () => {
    if (noteToUnlock && passwordInput === noteToUnlock.password) {
      setUnlockedNotes(prev => new Set([...prev, noteToUnlock.id]));
      setShowPasswordModal(false);
      // Open the note for editing
      setEditingNote(noteToUnlock);
      setNoteTitle(noteToUnlock.title);
      setNoteContent(noteToUnlock.content);
      setNotePassword(noteToUnlock.password || '');
      setHasPassword(!!noteToUnlock.password);
      setShowNoteModal(true);
      setNoteToUnlock(null);
      setPasswordInput('');
    } else {
      Alert.alert('שגיאה', 'סיסמה שגויה');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isNoteLocked = (note: Note) => {
    return note.password && !unlockedNotes.has(note.id);
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

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={openNewNote}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>ההערות שלי</Text>
          </View>
          
          {notes.length === 0 ? (
            <View style={styles.emptyNotesContainer}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.grayLight} />
              <Text style={styles.emptyNotesText}>אין הערות עדיין</Text>
              <Text style={styles.emptyNotesSubtext}>לחץ על + כדי להוסיף הערה חדשה</Text>
            </View>
          ) : (
            <View style={styles.notesListContainer}>
              {notes.map(note => (
                <TouchableOpacity
                  key={note.id}
                  style={styles.noteCard}
                  onPress={() => openEditNote(note)}
                >
                  <View style={styles.noteCardHeader}>
                    <TouchableOpacity
                      style={styles.deleteNoteButton}
                      onPress={() => handleDeleteNote(note.id, note.title)}
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.gray} />
                    </TouchableOpacity>
                    <View style={styles.noteTitleRow}>
                      {note.password && (
                        <Ionicons 
                          name={isNoteLocked(note) ? "lock-closed" : "lock-open"} 
                          size={16} 
                          color={COLORS.primary} 
                          style={styles.lockIcon}
                        />
                      )}
                      <Text style={styles.noteCardTitle} numberOfLines={1}>{note.title}</Text>
                    </View>
                  </View>
                  {isNoteLocked(note) ? (
                    <Text style={styles.lockedContentText}>🔒 תוכן מוגן בסיסמה</Text>
                  ) : note.content ? (
                    <Text style={styles.noteCardContent} numberOfLines={2}>{note.content}</Text>
                  ) : null}
                  <Text style={styles.noteCardDate}>{formatDate(note.updatedAt)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* App Logo Section */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../../assets/my-logo-trimmed.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>המשימות שלי</Text>
          <Text style={styles.version}>גרסה 1.0.0</Text>
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

      {/* Add/Edit Note Modal */}
      <Modal visible={showNoteModal} transparent animationType="slide">
        <View style={styles.noteModalOverlay}>
          <View style={styles.noteModalContainer}>
            {/* Header with gradient effect */}
            <View style={styles.noteModalHeader}>
              <View style={styles.noteModalHeaderTop}>
                <TouchableOpacity 
                  style={styles.noteHeaderButton}
                  onPress={resetNoteForm}
                >
                  <Ionicons name="close" size={24} color={COLORS.gray} />
                </TouchableOpacity>
                <View style={styles.noteHeaderCenter}>
                  <View style={styles.noteIconCircle}>
                    <Ionicons 
                      name={editingNote ? "create" : "document-text"} 
                      size={24} 
                      color={COLORS.white} 
                    />
                  </View>
                  <Text style={styles.noteModalTitle}>
                    {editingNote ? 'עריכת הערה' : 'הערה חדשה'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.noteSaveButton, !noteTitle.trim() && styles.noteSaveButtonDisabled]}
                  onPress={handleSaveNote}
                  disabled={!noteTitle.trim()}
                >
                  <Ionicons name="checkmark" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              style={styles.noteModalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title Card */}
              <View style={styles.noteInputCard}>
                <View style={styles.noteInputHeader}>
                  <Ionicons name="text" size={18} color={COLORS.primary} />
                  <Text style={styles.noteInputLabel}>כותרת</Text>
                </View>
                <TextInput
                  style={styles.noteTitleInput}
                  placeholder="מה שם ההערה?"
                  placeholderTextColor={COLORS.grayLight}
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                  textAlign="right"
                />
              </View>

              {/* Content Card */}
              <View style={styles.noteInputCard}>
                <View style={styles.noteInputHeader}>
                  <Ionicons name="document-text" size={18} color={COLORS.primary} />
                  <Text style={styles.noteInputLabel}>תוכן</Text>
                </View>
                <TextInput
                  style={styles.noteContentInput}
                  placeholder="כתוב את ההערה שלך כאן..."
                  placeholderTextColor={COLORS.grayLight}
                  value={noteContent}
                  onChangeText={setNoteContent}
                  textAlign="right"
                  textAlignVertical="top"
                  multiline
                />
              </View>

              {/* Password Card */}
              <View style={styles.noteInputCard}>
                <View style={styles.passwordToggleRow}>
                  <Switch
                    value={hasPassword}
                    onValueChange={(value) => {
                      setHasPassword(value);
                      if (!value) setNotePassword('');
                    }}
                    trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
                    thumbColor={hasPassword ? COLORS.primary : '#f4f4f4'}
                  />
                  <View style={styles.passwordLabelRow}>
                    <View style={[styles.passwordIconCircle, hasPassword && styles.passwordIconCircleActive]}>
                      <Ionicons 
                        name={hasPassword ? "lock-closed" : "lock-open"} 
                        size={16} 
                        color={hasPassword ? COLORS.white : COLORS.gray} 
                      />
                    </View>
                    <Text style={[styles.passwordLabel, hasPassword && styles.passwordLabelActive]}>
                      הגן בסיסמה
                    </Text>
                  </View>
                </View>

                {hasPassword && (
                  <View style={styles.passwordInputContainer}>
                    <Ionicons name="key" size={18} color={COLORS.primary} style={styles.passwordInputIcon} />
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="הכנס סיסמה..."
                      placeholderTextColor={COLORS.grayLight}
                      value={notePassword}
                      onChangeText={setNotePassword}
                      textAlign="right"
                      secureTextEntry
                    />
                  </View>
                )}
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Password Unlock Modal */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModalContainer}>
            <View style={styles.passwordModalHeader}>
              <Ionicons name="lock-closed" size={40} color={COLORS.primary} />
              <Text style={styles.passwordModalTitle}>הערה מוגנת</Text>
              <Text style={styles.passwordModalSubtitle}>הכנס סיסמה כדי לצפות בהערה</Text>
            </View>

            <TextInput
              style={styles.passwordModalInput}
              placeholder="סיסמה..."
              placeholderTextColor={COLORS.gray}
              value={passwordInput}
              onChangeText={setPasswordInput}
              textAlign="right"
              secureTextEntry
              autoFocus
            />

            <View style={styles.passwordModalButtons}>
              <TouchableOpacity
                style={styles.passwordCancelButton}
                onPress={() => {
                  setShowPasswordModal(false);
                  setNoteToUnlock(null);
                  setPasswordInput('');
                }}
              >
                <Text style={styles.passwordCancelText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.passwordUnlockButton, !passwordInput && styles.passwordUnlockButtonDisabled]}
                onPress={handleUnlockNote}
                disabled={!passwordInput}
              >
                <Text style={styles.passwordUnlockText}>פתח</Text>
              </TouchableOpacity>
            </View>
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
  // Notes styles
  emptyNotesContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyNotesText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
    marginTop: 12,
  },
  emptyNotesSubtext: {
    fontSize: 14,
    color: COLORS.grayLight,
    marginTop: 4,
  },
  notesListContainer: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: COLORS.grayBg,
    borderRadius: 12,
    padding: 14,
  },
  noteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  lockIcon: {
    marginRight: 6,
  },
  noteCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'right',
  },
  deleteNoteButton: {
    padding: 4,
  },
  noteCardContent: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 8,
  },
  lockedContentText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'right',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  noteCardDate: {
    fontSize: 12,
    color: COLORS.grayLight,
    textAlign: 'right',
  },
  // Modal styles
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
    backgroundColor: '#FFC4C4',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Note modal styles
  noteModalOverlay: {
    flex: 1,
    backgroundColor: COLORS.grayBg,
  },
  noteModalContainer: {
    flex: 1,
  },
  noteModalHeader: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...SHADOWS.medium,
  },
  noteModalHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.grayBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteHeaderCenter: {
    alignItems: 'center',
  },
  noteIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  noteModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  noteSaveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteSaveButtonDisabled: {
    backgroundColor: COLORS.grayLight,
  },
  noteModalContent: {
    flex: 1,
    padding: 16,
  },
  noteInputCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  noteInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  noteInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  noteTitleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    paddingVertical: 8,
    textAlign: 'right',
  },
  noteContentInput: {
    fontSize: 16,
    color: COLORS.black,
    lineHeight: 24,
    minHeight: 180,
    textAlign: 'right',
  },
  // Password section styles
  passwordToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passwordIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.grayBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordIconCircleActive: {
    backgroundColor: COLORS.primary,
  },
  passwordLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
  },
  passwordLabelActive: {
    color: COLORS.black,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayBg,
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 14,
  },
  passwordInputIcon: {
    marginLeft: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.black,
    textAlign: 'right',
  },
  // Password modal styles
  passwordModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    padding: 24,
  },
  passwordModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 12,
  },
  passwordModalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  passwordModalInput: {
    backgroundColor: COLORS.grayBg,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: COLORS.black,
  },
  passwordModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  passwordCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.grayBg,
    alignItems: 'center',
  },
  passwordCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
  },
  passwordUnlockButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  passwordUnlockButtonDisabled: {
    backgroundColor: '#FFC4C4',
  },
  passwordUnlockText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
    color: COLORS.gray,
  },
});

export default PersonalScreen;
