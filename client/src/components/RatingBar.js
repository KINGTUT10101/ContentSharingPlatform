import { LinearProgress, Box } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

export default function RatingBar ({ fontSize="2rem" }) {
  return (
    <Box display="flex" alignItems="center">
      <ArrowCircleDownIcon sx={{ color: 'red', fontSize: fontSize }} />
      <LinearProgress
        variant="determinate"
        value={75}
        sx={{
          backgroundColor: 'green',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'red'
          },
          flex: 1
        }}
      />
      <ArrowCircleUpIcon sx={{ color: 'green', fontSize: fontSize }} />
    </Box>
  )
}