import { Typography, Paper, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RatingBar from "./RatingBar"
import { Link } from 'react-router-dom'

/**
 * Displays a content's data, including the thumbnail, rating, title, author, etc
 * @param {Object} props
 * @param {Object} props.content Contains all the content's data
 * @returns {JSX.Element} A ContentCard component.
 */
export default function ContentCard ({ content }) {
  return (
    <div style={{overflow: "hidden"}}>
      <Link to="/content" style={{ textDecoration: 'none' }}>
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
            <img
              src="https://steamuserimages-a.akamaihd.net/ugc/1844802808260084320/9404847D01148169F06C6AB168A480C12375B55D/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
              alt="Content Thumbnail"
              style={{width: "100%", height: "9rem", transition: 'opacity 0.3s'}}
            />
          </div>

          <Box paddingX={1}>
            <RatingBar />
          </Box>

          <Typography align="center" variant="h5">
            My First Map
          </Typography>
          <Typography align="center" variant="subtitle2" paddingBottom={1}>
            Kingtut 101
          </Typography>

          <Box sx={{display: "flex", alignItems: "center"}} paddingX={1}>
            <DownloadIcon />
            <Typography align="left" variant="subtitle1" paddingX={1}>
              10,247
            </Typography>
          </Box>

          <Typography align="left" variant="subtitle2" paddingX={1}>
            Last Updated: 2 May 2023
          </Typography>

          <Box sx={{display: "flex", gap: "0.25rem", alignItems: "center"}} padding={1}>
            <Paper variant="outlined" elevation={5} sx={{ borderRadius: '12px' }}>
              <Typography align="left" variant="button" paddingX={1}>
                tag
              </Typography>
            </Paper>
            <Paper variant="outlined" elevation={5} sx={{ borderRadius: '12px' }}>
              <Typography align="left" variant="button" paddingX={1}>
                tag
              </Typography>
            </Paper>
            <Paper variant="outlined" elevation={5} sx={{ borderRadius: '12px' }}>
              <Typography align="left" variant="button" paddingX={1}>
                tag
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Link>
    </div>
  );
}
