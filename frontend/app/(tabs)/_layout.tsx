import { Tabs } from 'expo-router';
import { Home, ClipboardList, GraduationCap, User } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#D35400',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 20,
        },
        tabBarActiveTintColor: '#D35400',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 85,
          paddingTop: 12,
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size + 4} />,
        }}
      />
      <Tabs.Screen
        name="gunluk"
        options={{
          title: 'Günlük',
          tabBarLabel: 'Günlük',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size + 4} />,
        }}
      />
      <Tabs.Screen
        name="egitimler"
        options={{
          title: 'Eğitimler',
          tabBarLabel: 'Eğitimler',
          tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size + 4} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size + 4} />,
        }}
      />
    </Tabs>
  );
}
