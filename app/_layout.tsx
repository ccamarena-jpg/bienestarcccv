import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import {
  useFonts as useSansFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import {
  useFonts as useMonoFonts,
  JetBrainsMono_400Regular,
} from '@expo-google-fonts/jetbrains-mono';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/tokens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [serifLoaded] = useFonts({ InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic });
  const [sansLoaded] = useSansFonts({ InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold });
  const [monoLoaded] = useMonoFonts({ JetBrainsMono_400Regular });

  if (!serifLoaded || !sansLoaded || !monoLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.paper, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={Colors.paper} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/metas" />
        <Stack.Screen name="onboarding/sobre" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
