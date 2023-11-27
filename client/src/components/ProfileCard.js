import axios from "axios";
import React from "react";
import { Typography, Paper, Avatar, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

/**
 * Shows a user's profile data, including their name, PFP, bio, and average content rating
 * @category Components
 * @param {Object} props
 * @param {string} props.Username A user's username
 * @returns {JSX.Element} A ProfileCard component.
 */
function ProfileCard ({ Username }) {
  let flexDirection = useMediaQuery(useTheme().breakpoints.down('sm')) ? "column" : "row"

  const [profileData, setProfileData] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/fullprofile/${Username}`).then((response) => {
      setProfileData(response.data);
    });
  }, [Username]);
  if (!profileData) return null

  const timestampDate = new Date (profileData.creationdate)
  const month = timestampDate.toLocaleString('default', { month: 'long' });
  const day = timestampDate.getDate();
  const year = timestampDate.getFullYear();

  return (
    <div style={{overflow: "hidden"}}>
      <Paper elevation={20}>
        <Grid
          container
          direction={flexDirection}
          alignItems="flex-start"
          justifyContent="center"
          padding={1}
          spacing={3}
        >
          <Grid item 
            xs={3}
            style={{
              margin: '0 auto',
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Avatar
              src="https://avatars.cloudflare.steamstatic.com/abf4ba4f97b8e409561053e0e6a4ac0795777c93_full.jpg"
              variant="square"
              style={{width: "100%", height: "100%"}}
            />
            {/* <RatingBar fontSize="1.5rem" /> */}
            <Typography align="left" variant="subtitle2" paddingBottom={1} style={{fontSize: "0.8rem"}}>
              Member since: {day} {month} {year}
            </Typography>
          </Grid>

          <Grid item xs={9}>
            <Typography align="left" variant="h4" paddingBottom={1}>
              {profileData.username}
            </Typography>
            <Typography align="left" variant="body1">
              {profileData.bio}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default ProfileCard