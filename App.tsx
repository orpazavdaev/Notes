import React from 'react';
import { I18nManager, LogBox, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TaskProvider } from './src/context/TaskContext';
import { SettingsProvider } from './src/context/SettingsContext';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import PersonalScreen from './src/screens/PersonalScreen';
import { COLORS } from './src/constants/theme';

// Suppress SDK 54 new architecture warnings BEFORE anything else
LogBox.ignoreAllLogs(true);

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Tab = createBottomTabNavigator();

interface TabIconProps {
  focused: boolean;
}

const TabIcon = ({ focused, iconName, label }: TabIconProps & { iconName: string; label: string }) => (
  <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
    <Ionicons 
      name={iconName as any} 
      size={22} 
      color={focused ? COLORS.white : COLORS.gray} 
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <TaskProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                headerShown: false,
              }}
            >
              <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                  tabBarIcon: ({ focused }: TabIconProps) => (
                    <TabIcon 
                      focused={focused}
                      iconName={focused ? 'checkbox' : 'checkbox-outline'}
                      label="משימות"
                    />
                  ),
                }}
              />
              <Tab.Screen 
                name="Calendar" 
                component={CalendarScreen}
                options={{
                  tabBarIcon: ({ focused }: TabIconProps) => (
                    <TabIcon 
                      focused={focused}
                      iconName={focused ? 'calendar' : 'calendar-outline'}
                      label="לוח שנה"
                    />
                  ),
                }}
              />
              <Tab.Screen 
                name="Personal" 
                component={PersonalScreen}
                options={{
                  tabBarIcon: ({ focused }: TabIconProps) => (
                    <TabIcon 
                      focused={focused}
                      iconName={focused ? 'person' : 'person-outline'}
                      label="אישי"
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </TaskProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    height: 110,
    paddingBottom: 30,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 85,
    gap: 4,
  },
  tabItemFocused: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
    fontWeight: '400',
  },
  tabLabelFocused: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
