import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTasks, updateTaskStatus } from '../services/taskService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Edit, CheckCircle, Schedule, Assignment } from '@mui/icons-material';
import LoadingSpinner from './LoadingSpinner';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      console.log('Loading tasks for user:', currentUser.uid, currentUser.email);
      const tasksData = await getUserTasks(currentUser.uid);
      console.log('Tasks loaded:', tasksData);
      setTasks(tasksData);
    } catch (error) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      loadTasks(); // Reload tasks to get updated data
    } catch (error) {
      setError('Failed to update task status');
      console.error('Error updating task status:', error);
    }
  };

  const handleOpenDialog = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    if (selectedTask && newStatus !== selectedTask.status) {
      await handleStatusUpdate(selectedTask.id, newStatus);
      handleCloseDialog();
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

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && new Date(deadline).getTime() !== 0;
  };

  if (loading) {
    return <LoadingSpinner message="Loading your tasks..." size="large" />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          My Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track your assigned tasks
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Card
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px dashed #cbd5e1',
          }}
        >
          <CardContent>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No tasks assigned yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tasks assigned to you will appear here
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: isOverdue(task.deadline) 
                    ? '2px solid #ef4444' 
                    : '1px solid #e2e8f0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
                  },
                  ...(isOverdue(task.deadline) && {
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  }),
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        flexGrow: 1, 
                        mr: 1,
                        fontWeight: 600,
                        color: 'text.primary',
                        lineHeight: 1.3,
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={task.priority || 'medium'} 
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                      <Chip 
                        label={task.status} 
                        color={getStatusColor(task.status)}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {task.description}
                  </Typography>
                  
                  {isOverdue(task.deadline) && (
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label="Overdue" 
                        color="error"
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ space: 2 }}>
                    {task.deadline && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                            Due Date
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              color: isOverdue(task.deadline) ? 'error.main' : 'text.primary',
                            }}
                          >
                            {new Date(task.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {task.assignedByName && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assignment sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block' }}>
                            Assigned by
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {task.assignedByName}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<Edit />}
                    onClick={() => handleOpenDialog(task)}
                  >
                    Update Status
                  </Button>
                  
                  {task.status === 'Pending' && (
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<CheckCircle />}
                      onClick={() => handleStatusUpdate(task.id, 'In Progress')}
                    >
                      Start
                    </Button>
                  )}
                  
                  {task.status === 'In Progress' && (
                    <Button 
                      size="small" 
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => handleStatusUpdate(task.id, 'Completed')}
                    >
                      Complete
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Task Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>{selectedTask?.title}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 