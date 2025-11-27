import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TaskItem = ({ task, onToggleCompletion, onDelete, getPriorityColor }) => {
  // Validações robustas
  if (!task) {
    console.log('❌ TaskItem: task is null or undefined');
    return null;
  }

  // CONVERSÃO EXPLÍCITA E SEGURA PARA BOOLEAN
  const completed = Boolean(
    task.completed === true || 
    task.completed === 1 || 
    task.completed === '1' || 
    task.completed === 'true'
  );

  const priorityColor = getPriorityColor(task.priority);
  const taskId = task.id;
  const taskTitle = task.title || 'Tarefa sem título';

  console.log('🔍 TaskItem render:', { 
    id: taskId, 
    title: taskTitle, 
    completed, 
    completedType: typeof completed 
  });

  return (
    <View style={styles.container}>
      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => {
          console.log('🎯 Checkbox pressed:', taskId, completed);
          onToggleCompletion(taskId, completed);
        }}
      >
        <Ionicons
          name={completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={completed ? "#4CAF50" : "#ccc"}
        />
      </TouchableOpacity>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            completed && styles.completedTitle,
          ]}
          numberOfLines={2}
        >
          {taskTitle}
        </Text>
        
        {task.description ? (
          <Text
            style={[
              styles.description,
              completed && styles.completedDescription,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        {/* Rodapé */}
        <View style={styles.footer}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
            <Text style={styles.priorityText}>
              {(task.priority || 'media')?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.date}>
            {task.created_at ? new Date(task.created_at).toLocaleDateString('pt-BR') : 'Data inválida'}
          </Text>
        </View>
      </View>

      {/* Botão Excluir */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          console.log('🗑️ Delete button pressed:', taskId);
          onDelete(taskId, taskTitle);
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#f44336" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    minHeight: 80,
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  completedDescription: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
});

export default TaskItem;