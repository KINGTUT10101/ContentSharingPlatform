import { LinearProgress, Box } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

export default function RatingBar () {
  return (
    <Box display="flex" alignItems="center">
      <ArrowCircleDownIcon sx={{ color: 'red', fontSize: '2rem' }} />
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
      <ArrowCircleUpIcon sx={{ color: 'green', fontSize: '2rem' }} />
    </Box>
  )
}