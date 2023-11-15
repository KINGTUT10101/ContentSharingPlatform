import axios from "axios";
import React from "react";
import { Typography, Paper, Avatar, Grid } from '@mui/material';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * @module Components
 */
/**
 * Shows a comment left on a piece of content
 * @param {Object} props
 * @param {string} props.CommentID // The ID of a comment on a piece of content
 * @returns {JSX.Element} A Comment component.
 */
function Comment ({ CommentID }) {
  const [commentData, setCommentData] = React.useState(null)
  const [userData, setUserData] = React.useState(null)

  React.useEffect(() => {
    // Fetch the comment data
    axios.get(`/api/comment/${CommentID}`).then((commentResponse) => {
      setCommentData(commentResponse.data);
      // Using the email from the comment data, fetch the user data
      const userEmail = commentResponse.data.UserEmail;
      axios.get(`/api/profile/short/${userEmail}`).then((userResponse) => {
        setUserData(userResponse.data);
      }).catch(error => {
        console.error("Failed to fetch user data:", error);
      });
    }).catch(error => {
      console.error("Failed to fetch comment data:", error);
    });
  }, [CommentID]);
  if (!commentData || !userData) return null
  
  return (
    <div style={{overflow: "hidden"}}>
      <Paper elevation={20}>
        <Grid
          container
          alignItems="flex-start"
          justifyContent="center"
          padding={1}
          spacing={2}
        >
          <Grid item 
          xs={2}
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
            <Typography align="left" variant="subtitle2" paddingBottom={1} style={{fontSize: "0.8rem"}}>
              Member since: {userData.CreationDate.day} {monthNames[userData.CreationDate.month - 1]} {userData.CreationDate.year}
            </Typography>
          </Grid>

          <Grid item xs={10}>
            <Typography align="left" variant="subtitle2" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>
              {userData.Username} - Posted: {commentData.CreationDate.day} {monthNames[commentData.CreationDate.month - 1]} {commentData.CreationDate.year}
            </Typography>
            <Typography align="left" variant="body1" style={{fontSize: "0.9rem"}}>
              {commentData.CommentText}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default Comment