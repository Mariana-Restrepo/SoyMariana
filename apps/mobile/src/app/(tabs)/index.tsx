import { HomeHero } from '@/components/sections/HomeHero';
import { MetricsBlock } from '@/components/sections/MetricsBlock';
import { Screen } from '@/components/ui/Screen';

export default function HomeScreen() {
  return (
    <Screen>
      <HomeHero />
      <MetricsBlock />
    </Screen>
  );
}
