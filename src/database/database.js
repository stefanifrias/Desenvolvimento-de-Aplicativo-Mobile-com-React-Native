import * as SQLite from 'expo-sqlite';

// Abrir banco de dados
let db;

export const initDatabase = () => {
  try {
    db = SQLite.openDatabaseSync('tasks.db');
    
    // Criar tabela se não existir
    db.execSync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'media',
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.log('❌ Error initializing database:', error);
    return false;
  }
};

export const addTask = (title, description, priority) => {
  try {
    if (!db) initDatabase();
    
    const result = db.runSync(
      'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
      [title || '', description || '', priority || 'media']
    );
    
    console.log('✅ Task added successfully');
    return { 
      success: true, 
      insertId: result.lastInsertRowId 
    };
  } catch (error) {
    console.log('❌ Error adding task:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const getTasks = () => {
  try {
    if (!db) initDatabase();
    
    const tasks = db.getAllSync(
      'SELECT * FROM tasks ORDER BY created_at DESC',
      []
    );
    
    // CONVERSÃO EXPLÍCITA E SEGURA PARA BOOLEAN
    const processedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'media',
      // Garantir que completed seja sempre boolean
      completed: task.completed === 1 || task.completed === '1' || task.completed === true,
      created_at: task.created_at
    }));
    
    console.log('✅ Tasks loaded:', processedTasks.length);
    return processedTasks;
  } catch (error) {
    console.log('❌ Error getting tasks:', error);
    return [];
  }
};

export const deleteTask = (id) => {
  try {
    if (!db) initDatabase();
    
    const result = db.runSync(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    
    console.log('✅ Task deleted successfully');
    return { 
      success: true, 
      changes: result.changes 
    };
  } catch (error) {
    console.log('❌ Error deleting task:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const toggleTaskCompletion = (id, currentCompleted) => {
  try {
    if (!db) initDatabase();
    
    // Converter boolean para integer (0 ou 1)
    const newCompletedValue = currentCompleted ? 0 : 1;
    
    const result = db.runSync(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [newCompletedValue, id]
    );
    
    console.log('✅ Task completion toggled');
    return { 
      success: true, 
      changes: result.changes 
    };
  } catch (error) {
    console.log('❌ Error toggling task completion:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Função para resetar o banco (apenas para desenvolvimento)
export const resetDatabase = () => {
  try {
    if (!db) initDatabase();
    
    db.execSync('DROP TABLE IF EXISTS tasks');
    console.log('✅ Database reset');
    return initDatabase();
  } catch (error) {
    console.log('❌ Error resetting database:', error);
    return false;
  }
};