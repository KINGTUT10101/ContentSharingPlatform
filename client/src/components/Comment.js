import axios from "axios";
import React from "react";
import { Typography, Paper, Avatar, Grid } from '@mui/material';

/**
 * Shows a comment left on a piece of content
 * @param {Object} props
 * @param {string} props.CommentID // The ID of a comment on a piece of content
 * @returns {JSX.Element} A Comment component.
 */
export default function Comment ({ CommentID }) {
  const [commentData, setCommentData] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/comment/${CommentID}`).then((response) => {
      setCommentData(response.data);
    });
  }, []);
  if (!commentData) return null
  
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
              Member since: 23 March 2023
            </Typography>
          </Grid>

          <Grid item xs={10}>
            <Typography align="left" variant="subtitle2" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>
              Kingtut 101 - Posted: 24 December 2022
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