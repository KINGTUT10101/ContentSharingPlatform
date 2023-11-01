import { Typography, Paper, Box, Avatar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import RatingBar from "./RatingBar"

export default function ProfileCard () {
  const theme = useTheme()
  let flexDirection = useMediaQuery(theme.breakpoints.down('sm')) ? "column" : "row"

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
          </div>

          <div>
            <Typography align="left" variant="h4" paddingBottom={1}>
              Kingtut 101
            </Typography>
            <Typography align="left" variant="body1">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Typography>
          </div>
        </Box>
      </Paper>
    </div>
  )
}