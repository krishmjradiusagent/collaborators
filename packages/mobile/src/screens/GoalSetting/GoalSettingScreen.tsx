import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronLeft,
  X,
  TrendingUp,
  Phone,
  MessageCircle,
  Calendar,
  ChevronDown,
  Target,
} from 'lucide-react-native';
import { useGoals, METRICS, goalService } from '@mel-goals/shared';
import type { MetricKey } from '@mel-goals/shared';
import AgentSelectorBottomSheet from '../../components/AgentSelectorBottomSheet';

const GoalSettingScreen = () => {
  const {
    goals,
    agents,
    selectedAgent,
    loading,
    saving,
    error,
    setSelectedAgent,
    setGoals,
  } = useGoals({
    service: goalService,
    teamLeadId: 'lead_001',
  });

  const [localMetrics, setLocalMetrics] = useState<Record<MetricKey, string>>({
    newLeads: '',
    callsConversations: '',
    uniqueConversations: '',
    appointments: '',
  });

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<MetricKey | null>(null);

  useEffect(() => {
    if (goals) {
      setLocalMetrics({
        newLeads: goals.metrics.newLeads.toString(),
        callsConversations: goals.metrics.callsConversations.toString(),
        uniqueConversations: goals.metrics.uniqueConversations.toString(),
        appointments: goals.metrics.appointments.toString(),
      });
    } else {
      setLocalMetrics({
        newLeads: '',
        callsConversations: '',
        uniqueConversations: '',
        appointments: '',
      });
    }
  }, [goals]);

  const handleSave = async () => {
    const numericMetrics = {
      newLeads: parseInt(localMetrics.newLeads) || 0,
      callsConversations: parseInt(localMetrics.callsConversations) || 0,
      uniqueConversations: parseInt(localMetrics.uniqueConversations) || 0,
      appointments: parseInt(localMetrics.appointments) || 0,
    };
    
    // Basic validation
    if (Object.values(numericMetrics).some(v => v < 1 || v > 9999)) {
       // Ideally show toast
       return;
    }

    try {
      await setGoals(numericMetrics);
      // Navigate back or show success
    } catch (e) {
      // Error handled by hook
    }
  };

  const renderMetricCard = ({ item }: { item: typeof METRICS[0] }) => {
    const isFocused = focusedField === item.key;
    return (
      <View style={[styles.card, isFocused && styles.cardFocused]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            {item.key === 'newLeads' && <TrendingUp size={20} color="#5A5FF2" />}
            {item.key === 'callsConversations' && <Phone size={20} color="#5A5FF2" />}
            {item.key === 'uniqueConversations' && <MessageCircle size={20} color="#5A5FF2" />}
            {item.key === 'appointments' && <Calendar size={20} color="#5A5FF2" />}
            <Text style={styles.cardLabel}>{item.label}</Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          value={localMetrics[item.key]}
          onChangeText={(text) => setLocalMetrics({ ...localMetrics, [item.key]: text.replace(/[^0-9]/g, '') })}
          placeholder={item.placeholder}
          placeholderTextColor="#808080"
          keyboardType="numeric"
          onFocus={() => setFocusedField(item.key as MetricKey)}
          onBlur={() => setFocusedField(null)}
        />
        <Text style={styles.suffix}>{item.suffix}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAction}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Goals</Text>
        <TouchableOpacity style={styles.headerAction}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.agentSelector}
        onPress={() => setIsBottomSheetOpen(true)}
      >
        <Text style={styles.agentName}>
          {selectedAgent ? selectedAgent.name : 'Select Agent'}
        </Text>
        <ChevronDown size={18} color="#5A5FF2" />
      </TouchableOpacity>

      {selectedAgent ? (
        <FlatList
          data={METRICS}
          renderItem={renderMetricCard}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={<Text style={styles.sectionLabel}>Monthly Targets</Text>}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Target size={48} color="#808080" />
          <Text style={styles.emptyText}>Select an agent above</Text>
        </View>
      )}

      {selectedAgent && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, (saving || !selectedAgent) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving || !selectedAgent}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>Save Goals</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <AgentSelectorBottomSheet
        isVisible={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        agents={agents}
        onSelectAgent={(agent) => {
          setSelectedAgent(agent);
          setIsBottomSheetOpen(false);
        }}
        selectedAgentId={selectedAgent?.id}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5A5FF2" />
        </View>
      )}
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  agentSelector: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  agentName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#808080',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardFocused: {
    borderColor: '#5A5FF2',
    shadowColor: '#5A5FF2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginLeft: 8,
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    padding: 0,
  },
  suffix: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'right',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#808080',
    marginTop: 12,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#0F0F0F',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 6,
    marginRight: 6,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5A5FF2',
    borderRadius: 6,
    marginLeft: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GoalSettingScreen;
