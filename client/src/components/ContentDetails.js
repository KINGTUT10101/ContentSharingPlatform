import { Typography, Paper, Box, Avatar, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import RatingBar from "./RatingBar"
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Shows a user's profile data, including their name, PFP, bio, and average content rating
 * @returns {JSX.Element} A ProfileCard component.
 */
export default function ProfileCard () {
  const theme = useTheme()
  const smallBreakpoint = useMediaQuery(theme.breakpoints.down('sm'))
  let flexDirection = smallBreakpoint ? "column" : "row"
  let imageSize = smallBreakpoint ? "100%" : "180px"

  return (
    <div style={{overflow: "hidden"}}>
      <Paper elevation={20}>
        <Box sx={{display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "1rem", flexDirection: flexDirection}} padding={1}>
          <div style={{margin: '0 auto'}}>
            <Avatar
              src="https://steamuserimages-a.akamaihd.net/ugc/1844802808260084320/9404847D01148169F06C6AB168A480C12375B55D/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
              variant="square"
              style={{width: imageSize, height: "180px"}}
            />
            <div style={{display: "flex", justifyContent: "center"}} paddingY={1}>
              <Button variant="contained" style={{width: "85%"}}>Download</Button>
            </div>
            <RatingBar fontSize="1.5rem" />
            <Box sx={{display: "flex", alignItems: "center"}}>
              <DownloadIcon />
              <Typography align="left" variant="subtitle1" paddingX={1}>
                10,247
              </Typography>
            </Box>
          </div>

          <div>
            <Typography align="left" variant="h4" paddingBottom={1}>
              My First Map
            </Typography>
            <Typography align="left" variant="subtitle2" paddingBottom={1}>
              Last Updated: 2 May 2023
            </Typography>
            <Typography align="left" variant="body1">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Typography>

            <Box sx={{display: "flex", gap: "0.25rem", alignItems: "center"}} paddingTop={1}>
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
          </div>
        </Box>
      </Paper>
    </div>
  )
}