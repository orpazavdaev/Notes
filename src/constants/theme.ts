export const COLORS = {
  primary: '#018790',
  primaryLight: '#E0F7F7',
  primaryDark: '#005461',
  primaryBg: '#FFFFFF',
  accent: '#00B7B5',
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray: '#8E8E93',
  grayLight: '#E5E5EA',
  grayBg: '#F4F4F4',
  overlay: 'rgba(0,0,0,0.4)',
  success: '#34C759',
  danger: '#FF3B30',
};

export const FONTS = {
  regular: 'System',
  bold: 'System',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

// RTL order for Hebrew calendar: שבת on left, א׳ on right
export const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'];
