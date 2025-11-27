import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase, resetDatabase } from '../database/database';

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const success = await initDatabase();
        if (!success) {
          Alert.alert('Erro', 'Falha ao inicializar o banco de dados');
        }
      } catch (error) {
        console.log('Initialization error:', error);
      }
    };
    
    initializeApp();
  }, []);

  // Função para desenvolvimento - remover em produção
  const handleResetDatabase = () => {
    Alert.alert(
      'Resetar Banco',
      'Isso apagará todas as tarefas. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            resetDatabase();
            Alert.alert('Sucesso', 'Banco resetado com sucesso');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
        <Text style={styles.title}>TaskMaster</Text>
        <Text style={styles.subtitle}>Seu Gerenciador de Tarefas</Text>
      </View>

      {/* Botões Principais */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('TaskList')}
        >
          <Ionicons name="list" size={24} color="white" />
          <Text style={styles.buttonText}>Ver Minhas Tarefas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Nova Tarefa</Text>
        </TouchableOpacity>
      </View>

      {/* Recursos */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Recursos:</Text>
        <Text style={styles.featureItem}>✓ Criar tarefas</Text>
        <Text style={styles.featureItem}>✓ Marcar como concluído</Text>
        <Text style={styles.featureItem}>✓ Definir prioridades</Text>
        <Text style={styles.featureItem}>✓ Armazenamento local (SQLite)</Text>
      </View>

      {/* Botão de Reset (Desenvolvimento) */}
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={handleResetDatabase}
      >
        <Text style={styles.resetButtonText}>Resetar Banco (Dev)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resetButton: {
    padding: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;