import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTasks, deleteTask, toggleTaskCompletion } from '../database/database';
import TaskItem from '../components/TaskItem';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    try {
      console.log('🔄 Loading tasks...');
      const tasksData = getTasks(); // Não é async agora
      console.log('📝 Tasks loaded:', tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.log('❌ Error in loadTasks:', error);
      Alert.alert('Erro', 'Falha ao carregar tarefas');
      setTasks([]);
    }
  };

  useEffect(() => {
    console.log('🎯 TaskListScreen mounted');
    loadTasks();
    
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔍 Screen focused, reloading tasks');
      loadTasks();
    });
    
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    console.log('🔄 Manual refresh');
    setRefreshing(true);
    loadTasks();
    setRefreshing(false);
  };

  const handleDeleteTask = (id, title) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a tarefa "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            try {
              console.log('🗑️ Deleting task:', id);
              const result = deleteTask(id);
              
              if (result.success) {
                console.log('✅ Task deleted successfully');
                loadTasks();
              } else {
                Alert.alert('Erro', 'Falha ao excluir tarefa');
              }
            } catch (error) {
              console.log('❌ Error deleting task:', error);
              Alert.alert('Erro', 'Falha ao excluir tarefa');
            }
          },
        },
      ]
    );
  };

  const handleToggleCompletion = (id, currentCompleted) => {
    try {
      console.log('🔄 Toggling task completion:', id, currentCompleted);
      const result = toggleTaskCompletion(id, currentCompleted);
      
      if (result.success) {
        console.log('✅ Task completion toggled successfully');
        // Atualizar localmente para resposta mais rápida
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? { ...task, completed: !currentCompleted } : task
          )
        );
      } else {
        Alert.alert('Erro', 'Falha ao atualizar tarefa');
        loadTasks(); // Recarregar se houve erro
      }
    } catch (error) {
      console.log('❌ Error toggling task:', error);
      Alert.alert('Erro', 'Falha ao atualizar tarefa');
      loadTasks();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return '#f44336';
      case 'media': return '#ff9800';
      case 'baixa': return '#4CAF50';
      default: return '#757575';
    }
  };

  const renderTask = ({ item }) => {
    console.log('🎨 Rendering task:', item.id, item.title, item.completed, typeof item.completed);
    return (
      <TaskItem
        task={item}
        onToggleCompletion={handleToggleCompletion}
        onDelete={handleDeleteTask}
        getPriorityColor={getPriorityColor}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Minhas Tarefas ({tasks.length})
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-circle-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateText}>Nenhuma tarefa encontrada</Text>
          <Text style={styles.emptyStateSubtext}>
            Clique no botão "+" para adicionar sua primeira tarefa
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    fontWeight: 'bold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default TaskListScreen;