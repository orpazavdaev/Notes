# 📋 המשימות שלי - My Tasks App

אפליקציית ניהול משימות בעברית, בנויה ב-React Native עם Expo.

## ✨ תכונות

- ✅ יצירה, עריכה ומחיקה של משימות
- 📅 לוח שנה אינטראקטיבי
- ⏰ הגדרת תאריך ושעה למשימות
- 🔄 סימון משימות כהושלמו
- 💾 שמירה אוטומטית מקומית
- 🔄 תמיכה מלאה ב-RTL (עברית)

## 🚀 הוראות הרצה

### דרישות מקדימות

1. **Node.js** (גרסה 18 ומעלה)
   - הורד מ: https://nodejs.org/

2. **Expo CLI** (אופציונלי - ניתן להשתמש ב-npx)
   ```bash
   npm install -g expo-cli
   ```

3. **אפליקציית Expo Go** על הטלפון
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

### התקנה והרצה

```bash
# 1. התקן את התלויות
npm install

# 2. הרץ את האפליקציה
npx expo start
```

### פתיחה בטלפון

לאחר הרצת `npx expo start`:

1. **Android**: סרוק את קוד ה-QR עם אפליקציית Expo Go
2. **iOS**: סרוק את קוד ה-QR עם אפליקציית המצלמה ופתח ב-Expo Go

### הרצה על סימולטור/אמולטור

```bash
# Android (דרוש Android Studio)
npx expo start --android

# iOS (דרוש Xcode - רק ב-Mac)
npx expo start --ios

# Web Browser
npx expo start --web
```

## 📱 העלאה לחנויות האפליקציות

### הגדרת EAS Build

```bash
# 1. התקן את EAS CLI
npm install -g eas-cli

# 2. התחבר לחשבון Expo
eas login

# 3. הגדר את הפרויקט
eas build:configure
```

### בניית APK לאנדרואיד (להתקנה ישירה)

```bash
eas build -p android --profile preview
```

### בניית לחנות Google Play

```bash
eas build -p android --profile production
```

### בניית לחנות App Store (iOS)

```bash
eas build -p ios --profile production
```

### העלאה לחנויות

```bash
# Google Play
eas submit -p android

# App Store
eas submit -p ios
```

## 📁 מבנה הפרויקט

```
Notes/
├── App.tsx                    # קומפוננטה ראשית
├── app.json                   # הגדרות Expo
├── package.json               # תלויות
├── src/
│   ├── components/            # קומפוננטות UI
│   │   ├── Calendar.tsx       # לוח שנה
│   │   ├── TaskList.tsx       # רשימת משימות
│   │   ├── TaskItem.tsx       # פריט משימה
│   │   ├── AddTaskModal.tsx   # דיאלוג הוספה
│   │   ├── EditTaskModal.tsx  # דיאלוג עריכה
│   │   └── DateTimePicker.tsx # בחירת תאריך ושעה
│   ├── screens/               # מסכים
│   │   ├── HomeScreen.tsx     # מסך ראשי
│   │   └── CalendarScreen.tsx # מסך לוח שנה
│   ├── context/               # State Management
│   │   └── TaskContext.tsx
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   ├── constants/             # קבועים
│   │   └── theme.ts
│   └── utils/                 # פונקציות עזר
│       └── storage.ts
└── assets/                    # תמונות ואייקונים
```

## 🎨 התאמה אישית

### שינוי צבעים

ערוך את הקובץ `src/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#F5A623',      // צבע ראשי
  primaryLight: '#FFD59E', // צבע ראשי בהיר
  primaryBg: '#FFF5EB',    // רקע
  // ...
};
```
