import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Platform } from 'react-native'

import BookScreen from '../screen/bookscreentest'
import HomeScreen from '../screen/homescreentest'
import NotificationsScreen from '../screen/notificationscreentest'
import ProfileScreen from '../screen/profilescreentest'

const Tab = createBottomTabNavigator()

export default function NavigationTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 5,
            backgroundColor: '#ffffff',
            borderRadius: 25,
            height: 70,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarIcon: ({ focused }) => {
            // TypeScript-safe iconName
            let iconName: keyof typeof Ionicons.glyphMap = 'home' // default

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline'
                break
              case 'Book':
                iconName = focused ? 'book' : 'book-outline'
                break
              case 'Notifications':
                iconName = focused ? 'notifications' : 'notifications-outline'
                break
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline'
                break
            }

            return (
              <Ionicons
                name={iconName}
                size={28}
                color={focused ? '#0685f4' : '#9aa4b2'}
              />
            )
          },
          tabBarActiveTintColor: '#0685f4',
          tabBarInactiveTintColor: '#9aa4b2',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Book" component={BookScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}