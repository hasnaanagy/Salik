import React, { useState } from 'react';
import { Grid, Box, Typography, Container, Divider, IconButton } from '@mui/material';
import SignUp from '../components/SignUp';
import Login from '../components/Login';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              backgroundImage: 'url(images/signPhoto.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: '50%',
              marginTop: '23%',
              marginRight: '15%',
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
            <Typography variant="h5" component="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              {isSignUp ? 'Create Account' : 'Sign in'}
            </Typography>
            <Typography sx={{ marginBottom: 3, textAlign: 'center' }}>
              We suggest the email address you use by default.
            </Typography>
            {isSignUp ? <SignUp /> : <Login />}
            <Divider sx={{ my: 3 }}>or sign in with</Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {/* Apple Icon */}
              <IconButton>
                <span className="material-icons" style={{ fontSize: 40, color: '#000000' }}>apple</span>
              </IconButton>
              {/* Facebook Icon */}
              <IconButton>
                <span className="material-icons" style={{ fontSize: 40, color: '#4267B2' }}>facebook</span>
              </IconButton>
            </Box>
            <Typography sx={{ textAlign: 'center', marginTop: 2 }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
              <a href="#" onClick={() => setIsSignUp(!isSignUp)} style={{color:'#ffb800'}}>
                {isSignUp ? 'Log in' : 'Sign up'}
              </a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
