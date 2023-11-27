import axios from "axios";
import React from "react";
import { Paper, Typography, TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import getToken from "../getToken"

/**
 * Allows users to log into their profiles, which is required to upload content and leave comments
 * @category Pages
 * @returns {JSX.Element} A Login component.
 */
function Login() {
  const token = getToken()
  const [username, setUsername] = React.useState ('')
  const [password, setPassword] = React.useState ('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
        const response = await axios.post('/api/login', {
            username: username,
            password: password,
        })

        const { token } = response.data;

        if (token) {
            // Store the token securely (e.g., in localStorage)
            localStorage.setItem('token', token)
            localStorage.setItem('username', username)
            navigate(`/profile/${username}`)
        }
    } catch (error) {
        alert ('Login failed: Please check your login info')
        alert (error)
    }
  }

  if (!token) {
    return (
      <div style={{overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Paper elevation={20} style={{width: "25rem", padding: "1.5rem"}}>
          <Typography align="center" variant="h5" paddingBottom={1}>
            Login
          </Typography>
          <TextField fullWidth label="Username" id="username" margin="normal" autoFocus value={username} onChange={(event)=>setUsername(event.target.value)} />
          <TextField fullWidth label="Password" id="password" margin="normal" type="password" value={password} onChange={(event)=>setPassword(event.target.value)} />
          <div style={{marginTop: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Button variant="contained" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </Paper>
      </div>
    )
    }
    else {
      return (
        <div style={{overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Button
            variant="contained"
            onClick={()=>{
              localStorage.removeItem ("token")
              localStorage.removeItem ("username")
              navigate(`/login`)
            }}
          >
            Log out
          </Button>
        </div>
      )
    }
}

export default Login