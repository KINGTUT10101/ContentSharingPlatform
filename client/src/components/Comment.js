import { Typography, Paper, Box, Avatar, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import RatingBar from "./RatingBar"
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Shows a comment left on a piece of content
 * @returns {JSX.Element} A Comment component.
 */
export default function Comment () {
  return (
    <div style={{overflow: "hidden"}}>
      <Paper elevation={20}>
        <Box sx={{display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "1rem"}} padding={1}>
          <div style={{margin: '0 auto'}}>
            <Avatar
              src="https://avatars.cloudflare.steamstatic.com/abf4ba4f97b8e409561053e0e6a4ac0795777c93_full.jpg"
              variant="square"
              style={{width: "90px", height: "90px"}}
            />
            <Typography align="left" variant="subtitle2" paddingBottom={1} style={{fontSize: "0.8rem"}}>
              Member since: 23 March 2023
            </Typography>
          </div>

          <div>
            <Typography align="left" variant="subtitle2" sx={{ fontWeight: 'bold', marginBottom: 0.5 }}>
              Kingtut 101 - Posted: 24 December 2022
            </Typography>
            <Typography align="left" variant="body1" style={{fontSize: "0.9rem"}}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Typography>
          </div>
        </Box>
      </Paper>
    </div>
  )
}