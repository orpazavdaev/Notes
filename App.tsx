import React from 'react';
import { I18nManager, LogBox, StyleSheet } from 'react-native';
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

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <TaskProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarLabelStyle: styles.tabLabel,
                headerShown: false,
              }}
            >
              <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                  tabBarLabel: 'משימות',
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons 
                      name={focused ? 'checkbox' : 'checkbox-outline'} 
                      size={24} 
                      color={color} 
                    />
                  ),
                }}
              />
              <Tab.Screen 
                name="Calendar" 
                component={CalendarScreen}
                options={{
                  tabBarLabel: 'לוח שנה',
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons 
                      name={focused ? 'calendar' : 'calendar-outline'} 
                      size={24} 
                      color={color} 
                    />
                  ),
                }}
              />
              <Tab.Screen 
                name="Personal" 
                component={PersonalScreen}
                options={{
                  tabBarLabel: 'אישי',
                  tabBarIcon: ({ focused, color }) => (
                    <Ionicons 
                      name={focused ? 'person' : 'person-outline'} 
                      size={24} 
                      color={color} 
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
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
