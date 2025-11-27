import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addTask } from '../database/database';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTask = () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um título para a tarefa');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('💾 Saving task:', { title, description, priority });
      const result = addTask(title.trim(), description.trim(), priority);
      
      if (result.success) {
        console.log('✅ Task saved successfully');
        Alert.alert(
          'Sucesso',
          'Tarefa adicionada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('TaskList'),
            },
          ]
        );
      } else {
        console.log('❌ Error saving task:', result.error);
        Alert.alert('Erro', 'Falha ao salvar tarefa: ' + result.error);
      }
    } catch (error) {
      console.log('❌ Exception saving task:', error);
      Alert.alert('Erro', 'Falha ao salvar tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  const PriorityButton = ({ level, label }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        priority === level && styles.priorityButtonSelected,
        priority === level && { backgroundColor: getPriorityColor(level) },
      ]}
      onPress={() => setPriority(level)}
      disabled={isLoading}
    >
      <Text
        style={[
          styles.priorityButtonText,
          priority === level && styles.priorityButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const getPriorityColor = (level) => {
    switch (level) {
      case 'alta': return '#f44336';
      case 'media': return '#ff9800';
      case 'baixa': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título da tarefa"
            maxLength={100}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Digite a descrição da tarefa (opcional)"
            multiline
            numberOfLines={4}
            maxLength={500}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            <PriorityButton level="alta" label="Alta" />
            <PriorityButton level="media" label="Média" />
            <PriorityButton level="baixa" label="Baixa" />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!title.trim() || isLoading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveTask}
            disabled={!title.trim() || isLoading}
          >
            <Ionicons name="save" size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Salvando...' : 'Salvar Tarefa'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  priorityButtonSelected: {
    borderColor: '#333',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  priorityButtonTextSelected: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButton: {
    flex: 2,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AddTaskScreen;