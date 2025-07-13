import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { getAllUsers } from '../services/userService';
import { sendTaskAssignmentEmail } from '../services/emailService';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Chip,
  TextareaAutosize
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

export default function TaskManagement() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        getAllTasks(),
        getAllUsers()
      ]);
      setTasks(tasksData);
      setUsers(usersData.filter(user => user.role === 'user')); // Only show regular users
    } catch (error) {
      setError('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        priority: task.priority || 'medium'
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        deadline: '',
        priority: 'medium'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      deadline: '',
      priority: 'medium'
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        // Create new task
        console.log('Creating task with data:', {
          ...formData,
          assignedBy: currentUser.uid,
          assignedByName: currentUser.displayName || currentUser.email,
          status: 'Pending'
        });
        
        const newTask = await createTask({
          ...formData,
          assignedBy: currentUser.uid,
          assignedByName: currentUser.displayName || currentUser.email,
          status: 'Pending' // Set initial status
        });
        
        console.log('Task created successfully:', newTask);
        
        // Send email notification to assigned user
        const assignedUser = users.find(user => user.id === formData.assignedTo);
        console.log('Assigned user found:', assignedUser);
        
        if (assignedUser) {
          try {
            await sendTaskAssignmentEmail(
              assignedUser.email,
              formData.title,
              currentUser.displayName || currentUser.email,
              {
                priority: formData.priority,
                deadline: formData.deadline,
                description: formData.description
              }
            );
            console.log(`Email notification sent to ${assignedUser.email} for task: ${formData.title}`);
            setSuccess(`Task created successfully! Email notification sent to ${assignedUser.email}`);
          } catch (emailError) {
            console.warn('Failed to send email notification:', emailError);
            setSuccess('Task created successfully! (Email notification failed)');
            // Don't fail the task creation if email fails
          }
        } else {
          setSuccess('Task created successfully!');
        }
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      setError('Failed to save task');
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        loadData();
      } catch (error) {
        setError('Failed to delete task');
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading tasks...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Task Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  {users.find(user => user.id === task.assignedTo)?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.status} 
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.priority || 'medium'} 
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={formData.assignedTo}
              label="Assign To"
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Deadline"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 