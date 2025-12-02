// Suppress SDK 54 errors at the lowest level possible
const suppressedErrors = [
  'disableEventLoopOnBridgeless',
  'feature flag',
  'runtime not ready',
  'native module method was not available'
];

const shouldSuppress = (msg) => {
  if (!msg) return false;
  const str = typeof msg === 'string' ? msg : msg.toString?.() || '';
  return suppressedErrors.some(e => str.includes(e));
};

// Override ErrorUtils if available (React Native's error handler)
if (global.ErrorUtils) {
  const originalHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    if (shouldSuppress(error?.message)) {
      return; // Don't show this error
    }
    originalHandler(error, isFatal);
  });
}

// Override console methods
['error', 'warn'].forEach(method => {
  const original = console[method];
  console[method] = (...args) => {
    if (shouldSuppress(args[0])) return;
    original.apply(console, args);
  };
});

// Now load the app
import 'expo/AppEntry';
