import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'index',       label: 'Spieltag',    icon: 'football-outline' },
  { name: 'tabelle',     label: 'Tabelle',      icon: 'trophy-outline' },
  { name: 'turnierbaum', label: 'Turnierbaum',  icon: 'git-branch-outline' },
  { name: 'profil',      label: 'Profil',       icon: 'person-outline' },
];

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF', shadowColor: '#D1FAE5', elevation: 2 },
          headerTintColor: '#14532D',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#D1FAE5',
            borderTopWidth: 1,
            height: 68,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#15803D',
          tabBarInactiveTintColor: '#9CA3AF',
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
