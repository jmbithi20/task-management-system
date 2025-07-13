import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Task status constants
export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    console.log('Creating task with data:', taskData);
    
    const task = {
      ...taskData,
      status: TASK_STATUS.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Task object to save:', task);
    
    const docRef = await addDoc(collection(db, 'tasks'), task);
    const createdTask = { id: docRef.id, ...task };
    console.log('Task created with ID:', docRef.id, createdTask);
    
    return createdTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Get all tasks (for admin)
export const getAllTasks = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    );
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

// Get tasks assigned to a specific user
export const getUserTasks = async (userId) => {
  try {
    console.log('Getting tasks for user ID:', userId);
    
    // First try with orderBy, if it fails due to missing index, fall back to simple query
    try {
      const q = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Tasks found with orderBy query:', tasks);
      return tasks;
    } catch (indexError) {
      console.warn('Composite index not found, using simple query:', indexError);
      
      // Fallback: simple query without orderBy
      const q = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Sort in memory
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const sortedTasks = tasks.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return dateB - dateA; // Descending order
      });
      
      console.log('Tasks found with simple query:', sortedTasks);
      return sortedTasks;
    }
  } catch (error) {
    console.error('Error getting user tasks:', error);
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// Update task (admin only)
export const updateTask = async (taskId, taskData) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete task (admin only)
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}; 