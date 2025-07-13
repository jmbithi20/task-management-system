import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllTasks } from '../services/taskService';
import { getAllUsers } from '../services/userService';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Assignment,
  People,
  CheckCircle,
  Warning
} from '@mui/icons-material';

export default function DashboardOverview() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalUsers: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const [tasks, users] = await Promise.all([
        getAllTasks(),
        getAllUsers()
      ]);

      const now = new Date();
      const overdueTasks = tasks.filter(task => 
        task.deadline && new Date(task.deadline) < now && task.status !== 'Completed'
      );

      const stats = {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'Pending').length,
        inProgressTasks: tasks.filter(task => task.status === 'In Progress').length,
        completedTasks: tasks.filter(task => task.status === 'Completed').length,
        totalUsers: users.length,
        overdueTasks: overdueTasks.length
      };

      setStats(stats);
    } catch (error) {
      setError('Failed to load dashboard statistics');
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
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
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {currentUser.displayName || currentUser.email}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Total Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalTasks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Tasks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.completedTasks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Overdue Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: stats.overdueTasks > 0 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.overdueTasks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Overdue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Task Status Breakdown
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getCompletionRate()}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getCompletionRate()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip label="Pending" size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{stats.pendingTasks} tasks</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip label="In Progress" color="warning" size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{stats.inProgressTasks} tasks</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stats.totalTasks > 0 ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) : 0}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip label="Completed" color="success" size="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{stats.completedTasks} tasks</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </Box>
  );
} 