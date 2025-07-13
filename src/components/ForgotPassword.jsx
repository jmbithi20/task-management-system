import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link
} from '@mui/material';
import { ArrowBack, Email } from '@mui/icons-material';
import LoadingSpinner from './LoadingSpinner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email. ';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += 'No account found with this email address.';
          break;
        case 'auth/invalid-email':
          errorMessage += 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage += 'Too many requests. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage += 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage += error.message || 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo/Brand Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              TaskFlow
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
              }}
            >
              Reset your password
            </Typography>
          </Box>

          {/* Forgot Password Card */}
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 4 },
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {success ? (
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Email sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                >
                  Check Your Email
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  We've sent a password reset link to <strong>{email}</strong>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  startIcon={<ArrowBack />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    },
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            ) : (
              <>
                <Typography
                  component="h2"
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
                >
                  Forgot Password
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                  >
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      mb: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LoadingSpinner message="" size="small" />
                        Sending...
                      </Box>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Link 
                      href="/login" 
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Back to Login
                    </Link>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
} 