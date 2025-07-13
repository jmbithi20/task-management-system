import { Box, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Loading...', size = 'medium' }) {
  const sizeMap = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 80, height: 80 },
  };

  const currentSize = sizeMap[size];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: currentSize.width,
          height: currentSize.height,
        }}
      >
        {/* Outer ring */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        
        {/* Inner ring */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '60%',
            height: '60%',
            border: '2px solid #f1f5f9',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite reverse',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        
        {/* Center dot */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            backgroundColor: '#2563eb',
            borderRadius: '50%',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
              '50%': { opacity: 0.5, transform: 'translate(-50%, -50%) scale(1.2)' },
            },
          }}
        />
      </Box>
      
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            textAlign: 'center',
            animation: 'fadeInOut 2s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
} 