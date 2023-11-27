import axios from "axios";
import React from "react";
import { saveAs } from 'file-saver';
import { Typography, Paper, Box, Avatar, Button, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import RatingBar from "./RatingBar"
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Shows a detailed information about a piece of content, like its full description
 * @category Components
 * @param {Object} props
 * @param {string} props.ContentID // The ID of a piece of user content
 * @returns {JSX.Element} A ContentDetails component.
 */
function ContentDetails ({ ContentID }) {
  const theme = useTheme()
  const smallBreakpoint = useMediaQuery(theme.breakpoints.down('sm'))
  let flexDirection = smallBreakpoint ? "column" : "row"

  const [contentData, setContentData] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/contentDetails/${ContentID}`).then((response) => {
      setContentData(response.data);
    });
  }, [ContentID]);
  if (!contentData) return null

  const timestampDate = new Date (contentData.UpdatedDate)
  const month = timestampDate.toLocaleString('default', { month: 'long' });
  const day = timestampDate.getDate();
  const year = timestampDate.getFullYear();

  function handleDownload () {
    const linkPrefix = "http://localhost:5000" // TEMP: will need to be changed when in prod
    const link = `${linkPrefix}/media/contentData/${ContentID}.slf`
    const filename = `${contentData.Title.replace(/\s/g, '')}.slf` // Spaces are removed from filename
    saveAs(link, filename)
  }

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
          xs={4}
          style={{
            margin: '0 auto',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Avatar
              src={`/media/thumbnails/${ContentID}.png`}
              variant="square"
              style={{width: "100%", height: "100%"}}
            >
              <Avatar 
                src={`/media/thumbnails/default.png`}
                variant="square"
                style={{width: "100%", height: "100%"}}
              />
            </Avatar>
            <RatingBar fontSize="1.5rem" rating={contentData.avgRat * 100} />
            <Button variant="contained" onClick={handleDownload} style={{width: "75%"}}>
              <DownloadIcon />
              <Typography align="left" variant="subtitle1" paddingX={1}>
                {contentData.Downloads.toLocaleString ()}
              </Typography>
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Typography align="left" variant="h4" paddingBottom={1}>
              {contentData.Title}
            </Typography>
            <Typography align="left" variant="subtitle2" paddingBottom={1}>
              <Link to={`/profile/${contentData.username}`} style={{ textDecoration: 'none' }}>{contentData.username}</Link> - Last updated: {day} {month} {year}
            </Typography>
            <Typography align="left" variant="body1">
              {contentData.Description}
            </Typography>

            <Box sx={{display: "flex", gap: "0.25rem", alignItems: "center", flexWrap: 'wrap'}} paddingTop={1}>
              {contentData.Tags.map((item) => (
                <Paper key={item} elevation={5} sx={{ borderRadius: '12px' }}>
                  <Typography align="left" variant="button" paddingX={1}>
                    {item}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default ContentDetails