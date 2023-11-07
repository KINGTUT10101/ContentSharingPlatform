import axios from "axios";
import React from "react";
import { Typography, Paper, Box, Avatar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import RatingBar from "./RatingBar"

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Shows a user's profile data, including their name, PFP, bio, and average content rating
 * @param {Object} props
 * @param {string} props.Username A user's username
 * @returns {JSX.Element} A ProfileCard component.
 */
export default function ProfileCard ({ Username }) {
  let flexDirection = useMediaQuery(useTheme().breakpoints.down('sm')) ? "column" : "row"

  const [profileData, setProfileData] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/profile/${Username}`).then((response) => {
      setProfileData(response.data);
    });
  }, []);
  if (!profileData) return null

  return (
    <div style={{overflow: "hidden"}}>
      <Paper elevation={20}>
        <Box sx={{display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "1rem", flexDirection: flexDirection}} padding={1}>
          <div style={{margin: '0 auto'}}>
            <Avatar
              src="https://avatars.cloudflare.steamstatic.com/abf4ba4f97b8e409561053e0e6a4ac0795777c93_full.jpg"
              variant="square"
              style={{width: "180px", height: "180px"}}
            />
            <RatingBar fontSize="1.5rem" />
            <Typography align="left" variant="subtitle2" paddingBottom={1} style={{fontSize: "0.8rem"}}>
              Member since: {profileData.CreationDate.day} {monthNames[profileData.CreationDate.month - 1]} {profileData.CreationDate.year}
            </Typography>
          </div>

          <div>
            <Typography align="left" variant="h4" paddingBottom={1}>
              {profileData.Username}
            </Typography>
            <Typography align="left" variant="body1">
              {profileData.Bio}
            </Typography>
          </div>
        </Box>
      </Paper>
    </div>
  )
}