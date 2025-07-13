import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, updateUser } from '../services/userService';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import LoadingSpinner from './LoadingSpinner';

export default function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserById(currentUser.uid);
      setUserData(data);
      setFormData({
        name: data?.name || '',
        email: data?.email || ''
      });
    } catch (error) {
      setError('Failed to load user data');
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: userData?.name || '',
      email: userData?.email || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      
      await updateUser(currentUser.uid, {
        name: formData.name,
        email: formData.email
      });
      
      setUserData(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email
      }));
      
      setEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LoadingSpinner message="Loading profile..." size="medium" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
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
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information and preferences
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Picture and Basic Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '3rem',
                }}
              >
                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {userData?.name || 'User'}
              </Typography>
              
              <Chip 
                label={userData?.role || 'user'} 
                color={userData?.role === 'admin' ? 'primary' : 'default'}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Profile Information
                </Typography>
                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                      },
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                  </Box>
                  {editing ? (
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {userData?.name || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                  </Box>
                  {editing ? (
                    <TextField
                      fullWidth
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      variant="outlined"
                      size="small"
                      type="email"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {userData?.email || 'Not provided'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Account Created
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Account Type
                    </Typography>
                  </Box>
                  <Chip 
                    label={userData?.role === 'admin' ? 'Administrator' : 'Regular User'} 
                    color={userData?.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 