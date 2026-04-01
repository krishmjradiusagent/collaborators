import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { CheckCircle2, X } from 'lucide-react-native';
import { Agent } from '@mel-goals/shared';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  selectedAgentId?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AgentSelectorBottomSheet = ({
  isVisible,
  onClose,
  agents,
  onSelectAgent,
  selectedAgentId,
}: Props) => {
  const renderAgent = ({ item }: { item: Agent }) => {
    const isSelected = item.id === selectedAgentId;
    return (
      <TouchableOpacity
        style={styles.agentRow}
        onPress={() => onSelectAgent(item)}
      >
        <Image
          source={{ uri: item.avatarUrl || `https://i.pravatar.cc/150?u=${item.email}` }}
          style={styles.avatar}
        />
        <Text style={styles.agentName}>{item.name}</Text>
        {isSelected && <CheckCircle2 size={24} color="#10B981" />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Agent</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={agents}
            renderItem={renderAgent}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: SCREEN_HEIGHT * 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  agentName: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default AgentSelectorBottomSheet;
