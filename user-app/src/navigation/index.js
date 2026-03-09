import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Placeholder Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RequestFormScreen from '../screens/RequestFormScreen';
import AmbulanceRequestScreen from '../screens/AmbulanceRequestScreen';
import MyRequestsScreen from '../screens/MyRequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    animation: 'fade_from_bottom',
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="RequestForm" component={RequestFormScreen} />
                <Stack.Screen name="AmbulanceRequest" component={AmbulanceRequestScreen} />
                <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
