import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import {
  useFonts as useMonoFonts,
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { Colors } from '../constants/tokens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            Error de app
          </Text>
          <Text style={{ color: '#333', fontSize: 13, marginBottom: 12 }}>{err.message}</Text>
          <Text style={{ color: '#888', fontSize: 11 }}>{err.stack}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });
  const [monoLoaded] = useMonoFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_600SemiBold,
  });
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const ready = fontsLoaded && monoLoaded;

  if (!ready && !timedOut) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.lavenderDk} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" backgroundColor={Colors.bg} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/metas" />
          <Stack.Screen name="onboarding/sobre" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="configuracion" options={{ presentation: 'modal' }} />
          <Stack.Screen name="compras" options={{ presentation: 'modal' }} />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
