import React from "react";
import { Link } from 'react-router-dom'
import { Typography, Paper, Avatar, Grid } from '@mui/material';

/**
 * @module Components
 */
/**
 * Shows a comment left on a piece of content
 * @param {Object} props
 * @param {string} props.CommentData // The contents of a comment component
 * @returns {JSX.Element} A Comment component.
 */
function Comment ({ CommentData }) {
  const ccdTimestampDate = new Date (CommentData.ccd)
  const ccdDate = {
    day: ccdTimestampDate.getDate(),
    month: ccdTimestampDate.toLocaleString('default', { month: 'long' }),
    year: ccdTimestampDate.getFullYear()
  }
  const ucdTimestampDate = new Date (CommentData.ucd)
  const ucdDate = {
    day: ucdTimestampDate.getDate(),
    month: ucdTimestampDate.toLocaleString('default', { month: 'long' }),
    year: ucdTimestampDate.getFullYear()
  }

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
              Member since: {ucdDate.day} {ucdDate.month} {ucdDate.year}
            </Typography>
          </Grid>

          <Grid item xs={10}>
            <Typography align="left" variant="subtitle2" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>
            <Link to={`/profile/${CommentData.username}`} style={{ textDecoration: 'none' }}>{CommentData.username}</Link> - Posted: {ccdDate.day} {ccdDate.month} {ccdDate.year}
            </Typography>
            <Typography align="left" variant="body1" style={{fontSize: "0.9rem"}}>
              {CommentData.commenttext}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default Comment