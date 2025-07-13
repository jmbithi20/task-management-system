import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Lock, CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingSpinner from './LoadingSpinner';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Get the oobCode from URL parameters (Firebase sends this in the reset email)
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError('Invalid password reset link. Please request a new password reset.');
    }
  }, [oobCode]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!oobCode) {
      setError('Invalid password reset link. Please request a new password reset.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to reset password. ';
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage += 'The password reset link has expired. Please request a new one.';
          break;
        case 'auth/invalid-action-code':
          errorMessage += 'Invalid password reset link. Please request a new one.';
          break;
        case 'auth/weak-password':
          errorMessage += 'Password is too weak. Please choose a stronger password.';
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

  if (!oobCode) {
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                href="/forgot-password" 
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
                Request New Password Reset
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
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
              Set new password
            </Typography>
          </Box>

          {/* Reset Password Card */}
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
                  <CheckCircle sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                >
                  Password Reset Successful
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Your password has been successfully reset. You can now log in with your new password.
                </Typography>
                
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  Go to Login
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
                  Reset Password
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  Enter your new password below.
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
                    name="password"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                        Resetting...
                      </Box>
                    ) : (
                      'Reset Password'
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