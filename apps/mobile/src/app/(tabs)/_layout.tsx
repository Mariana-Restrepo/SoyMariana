import { Tabs } from 'expo-router';

import { AppHeader } from '@/components/navigation/AppHeader';
import { TabBar } from '@/components/navigation/TabBar';
import { colors } from '@/theme';

/**
 * Cinco destinos (a diferencia de la web, que es un recorrido continuo):
 * Inicio · Videos · Colección · Marcas · Más.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        header: () => <AppHeader />,
        sceneStyle: { backgroundColor: colors.paper },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="videos" options={{ title: 'Videos' }} />
      <Tabs.Screen name="coleccion" options={{ title: 'Colección' }} />
      <Tabs.Screen name="marcas" options={{ title: 'Marcas' }} />
      <Tabs.Screen name="mas" options={{ title: 'Más' }} />
    </Tabs>
  );
}
