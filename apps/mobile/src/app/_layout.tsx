import { Caveat_500Medium } from '@expo-google-fonts/caveat';
import { DMSans_300Light, DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/theme';

// Mantiene la pantalla de carga (corazón sobre rosa) hasta que las tipografías estén listas.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    Caveat_500Medium,
  });

  useEffect(() => {
    // Si una fuente falla se sigue con la del sistema: la app nunca se queda en blanco.
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recomendacion/[slug]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="legal/[slug]" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
