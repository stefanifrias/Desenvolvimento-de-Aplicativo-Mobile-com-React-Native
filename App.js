import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'TaskMaster - Início' }}
        />
        <Stack.Screen 
          name="TaskList" 
          component={TaskListScreen}
          options={{ title: 'Minhas Tarefas' }}
        />
        <Stack.Screen 
          name="AddTask" 
          component={AddTaskScreen}
          options={{ title: 'Nova Tarefa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}