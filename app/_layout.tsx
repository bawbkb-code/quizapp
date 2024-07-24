import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="questions/index" 
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="questions/index"
        options={{
          title: 'Questions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'help-circle' : 'help-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard/index"
        options={{
          title: 'LeaderBoard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
