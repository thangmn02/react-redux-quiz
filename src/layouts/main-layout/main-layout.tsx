import type React from "react"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router";

interface MainLayoutProps extends React.PropsWithChildren {}

function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();

  function handleLogout() {
    window.localStorage.clear();
    navigate('login')
  }

  function goToHome() {
    navigate("/")
  }

  function gotoLeaderboard() {
    navigate("/leaderboard")
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: 3 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={goToHome}>
              Quiz App
            </Typography>
            <Button color="inherit" onClick={gotoLeaderboard}>Leaderboard</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>

      <main>
        {children}
      </main>
    </>
  )
}

export default MainLayout