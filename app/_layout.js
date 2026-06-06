import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { TipsProvider } from '../context/TipsContext';

const TABS = [
  { name: 'index',       label: 'Spieltag',    icon: 'football-outline' },
  { name: 'tabelle',     label: 'Tabelle',      icon: 'trophy-outline' },
  { name: 'turnierbaum', label: 'Turnierbaum',  icon: 'git-branch-outline' },
  { name: 'profil',      label: 'Profil',       icon: 'person-outline' },
];

export default function RootLayout() {
  return (
    <TipsProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0F3D1A', shadowColor: 'transparent', elevation: 0 },
          headerTintColor: '#F0FDF4',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          tabBarStyle: {
            backgroundColor: '#0F3D1A',
            borderTopColor: '#1A5C2A',
            borderTopWidth: 1,
            height: 82,
            paddingBottom: 18,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#4ADE80',
          tabBarInactiveTintColor: '#4D8060',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 0 },
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
    </TipsProvider>
  );
}
