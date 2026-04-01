import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import GoalSettingScreen from './src/screens/GoalSetting/GoalSettingScreen';
import MelAISettingsScreen from './src/screens/GoalSetting/MelAISettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'MEL_AI_SETTINGS' | 'GOAL_SETTING'>('MEL_AI_SETTINGS');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === 'MEL_AI_SETTINGS' && (
        <MelAISettingsScreen onNavigateToGoalSetting={() => setCurrentScreen('GOAL_SETTING')} />
      )}
      {currentScreen === 'GOAL_SETTING' && (
        <GoalSettingScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
});
