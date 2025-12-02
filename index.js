// Suppress SDK 54 warnings before app loads
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);

// Override console.error to suppress specific errors
const originalError = console.error;
console.error = (...args) => {
  const message = args[0]?.toString?.() || '';
  if (
    message.includes('disableEventLoopOnBridgeless') ||
    message.includes('feature flag') ||
    message.includes('runtime not ready')
  ) {
    return; // Suppress these errors
  }
  originalError.apply(console, args);
};

import 'expo/AppEntry';

