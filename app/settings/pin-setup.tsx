import { PinSetup } from '../../components/PinSetup';
import { useLocalSearchParams } from 'expo-router';

export default function PinSetupScreen() {
  const { mode } = useLocalSearchParams<{ mode?: 'setup' | 'change' }>();

  return <PinSetup mode={mode || 'setup'} />;
}
