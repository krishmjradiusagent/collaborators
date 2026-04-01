import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { ChevronLeft, ChevronRight, Infinity } from 'lucide-react-native';

const MelAISettingsScreen = ({ onNavigateToGoalSetting }: { onNavigateToGoalSetting: () => void }) => {
  const isTeamLead = true; // Hardcoded for MVP

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAction}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mel AI Settings</Text>
        <View style={styles.headerAction} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isTeamLead && (
          <TouchableOpacity style={styles.row} onPress={onNavigateToGoalSetting}>
            <View style={styles.rowLeft}>
              <Infinity size={20} color="#5A5FF2" />
              <Text style={styles.rowText}>Set Monthly Goals</Text>
            </View>
            <ChevronRight size={20} color="#808080" />
          </TouchableOpacity>
        )}
        
        {/* Placeholder for other Mel AI settings */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Mel AI helps your team stay productive with automated briefings and reporting.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerAction: {
    width: 40,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    paddingtop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  infoBox: {
    padding: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MelAISettingsScreen;
