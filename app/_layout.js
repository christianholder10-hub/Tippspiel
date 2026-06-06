import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'index',        label: 'Spieltag',    icon: 'football-outline' },
  { name: 'tabelle',      label: 'Tabelle',     icon: 'trophy-outline' },
  { name: 'turnierbaum',  label: 'Turnierbaum', icon: 'git-branch-outline' },
  { name: 'profil',       label: 'Profil',      icon: 'person-outline' },
];

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0B0F1A', shadowColor: 'transparent', elevation: 0 },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: { fontWeight: '700', fontSize: 18, letterSpacing: 0.3 },
          tabBarStyle: {
            backgroundColor: '#0B0F1A',
            borderTopColor: '#1A2540',
            borderTopWidth: 1,
            height: 68,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#22C55E',
          tabBarInactiveTintColor: '#3F5070',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        }}
      >
        {TABS.map(({ name, label, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: label,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={icon} size={22} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
