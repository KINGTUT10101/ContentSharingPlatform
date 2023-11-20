import { Paper, Typography, TextField, Button } from "@mui/material"

/**
 * @module Pages
 */
/**
 * Allows users to log into their profiles, which is required to upload content and leave comments
 * @returns {JSX.Element} A Login component.
 */
function Login() {
  return (
    <div style={{overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Paper elevation={20} style={{width: "25rem", padding: "1.5rem"}}>
        <Typography align="center" variant="h5" paddingBottom={1}>
          Login
        </Typography>
        <TextField fullWidth label="Username" id="username" margin="normal" autoFocus />
        <TextField fullWidth label="Password" id="password" margin="normal" type="password" />
        <div style={{marginTop: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Button variant="contained">
            Login
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default Login