import axios from "axios";
import React from "react";
import { Typography, Paper, Box, Avatar } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RatingBar from "./RatingBar"
import { Link } from 'react-router-dom'

/**
 * @module Components
 */
/**
 * Displays a content's data, including the thumbnail, rating, title, author, etc
 * @param {Object} props
 * @param {string} props.ContentID // The ID of a piece of user content
 * @returns {JSX.Element} A ContentCard component.
 */
function ContentCard ({ ContentID }) {
  const [contentData, setContentData] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/contentCard/${ContentID}`).then((response) => {
      setContentData(response.data);
    });
  }, [ContentID]);
  if (!contentData) return null

  const timestampDate = new Date (contentData.UpdatedDate)
  const month = timestampDate.toLocaleString('default', { month: 'long' });
  const day = timestampDate.getDate();
  const year = timestampDate.getFullYear();
  
  return (
    <div style={{overflow: "hidden"}}>
      <Link to={`/content/${ContentID}?page=1`} style={{ textDecoration: 'none' }}>
        <Paper elevation={20} sx={{
            transition: '0.3s',
            '&:hover': {
              backgroundColor: '#505050', // Change the background color when hovered
            },
            '&:hover img': {
              opacity: 0.80, // Reduce opacity of the image on hover
            }
          }}>
          <div style={{display: "flex", justifyContent: "center"}}>
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
          </div>

          <Box paddingX={1}>
            <RatingBar rating={contentData.avgRat * 100} />
          </Box>

          <Typography align="center" variant="h5">
            {contentData.Title}
          </Typography>
          <Typography align="center" variant="subtitle2" paddingBottom={1}>
          <Link to={`/profile/${contentData.username}`} style={{ textDecoration: 'none' }}>{contentData.username}</Link>
          </Typography>

          <Box sx={{display: "flex", alignItems: "center"}} paddingX={1}>
            <DownloadIcon />
            <Typography align="left" variant="subtitle1" paddingX={1}>
              {contentData.Downloads.toLocaleString ()}
            </Typography>
          </Box>

          <Typography align="left" variant="subtitle2" paddingX={1}>
            Last Updated: {day} {month} {year}
          </Typography>

          <Box sx={{display: "flex", gap: "0.25rem", alignItems: "center"}} padding={1}>
            {contentData.Tags.slice(0, 3).map((item) => (
              <Paper key={item} elevation={5} sx={{ borderRadius: '12px' }}>
                <Typography align="left" variant="button" paddingX={1}>
                  {item}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Link>
    </div>
  );
}

export default ContentCard