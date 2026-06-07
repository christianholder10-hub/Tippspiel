import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { TipsProvider } from '../context/TipsContext';

function AuthGuard() {
  const { user, loading } = useAuth();
  const router   = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inTabs  = segments[0] === '(tabs)';
    const inLogin = segments[0] === 'login';

    if (!user && !inLogin) {
      router.replace('/login');
    } else if (user && inLogin) {
      router.replace('/(tabs)/');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1B5E2E', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#4ADE80" size="large" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TipsProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <AuthGuard />
      </TipsProvider>
    </AuthProvider>
  );
}
