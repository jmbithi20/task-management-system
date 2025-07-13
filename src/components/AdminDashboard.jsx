import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper
} from '@mui/material';
import UserManagement from './UserManagement';
import TaskManagement from './TaskManagement';
import DashboardOverview from './DashboardOverview';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
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
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, tasks, and system operations
        </Typography>
      </Box>

      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="admin dashboard tabs"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              minHeight: 64,
              '&.Mui-selected': {
                color: '#2563eb',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2563eb',
              height: 3,
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="User Management" />
          <Tab label="Task Management" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <DashboardOverview />
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <UserManagement />
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        <TaskManagement />
      </TabPanel>
    </Box>
  );
} 