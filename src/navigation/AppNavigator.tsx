import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EvaluationScreen from '../screens/EvaluationScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Evaluation" component={EvaluationScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
