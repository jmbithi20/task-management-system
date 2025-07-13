import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import Profile from './Profile';

export default function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  // Check if auth context is loading
  if (auth.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading authentication...</Typography>
      </Box>
    );
  }

  const { currentUser, userRole, logout } = auth;

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              TaskFlow
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                }}
              >
                Welcome back,
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {currentUser.displayName || currentUser.email}
              </Typography>
            </Box>
            
            <Button 
              variant="outlined"
              onClick={() => setShowProfile(true)}
              startIcon={<Person />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Profile
            </Button>
            
            <Button 
              variant="outlined"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {showProfile ? (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setShowProfile(false)}
              sx={{ mb: 3 }}
            >
              ← Back to Dashboard
            </Button>
            <Profile />
          </Box>
        ) : (
          <>
            {userRole === 'admin' ? (
              <AdminDashboard />
            ) : (
              <UserDashboard />
            )}
          </>
        )}
      </Container>
    </Box>
  );
} 