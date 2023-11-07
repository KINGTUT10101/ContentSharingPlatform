import { LinearProgress, Box } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

/**
 * Displays a rating/review bar where the negative side is red and the positive side is green
 * @param {Object} props
 * @param {string} props.fontSize The size of the icons on both sides of the progress bar 
 * @returns {JSX.Element} A RatingBar component
 */
export default function RatingBar ({ fontSize="2rem" }) {
  return (
    <Box display="flex" alignItems="center" style={{width: "100%"}}>
      <ArrowCircleDownIcon sx={{ color: 'red', fontSize: fontSize }} />
      <LinearProgress
        variant="determinate"
        value={75}
        sx={{
          backgroundColor: 'green',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'red'
          },
          flex: 1,
          width: "100%"
        }}
      />
      <ArrowCircleUpIcon sx={{ color: 'green', fontSize: fontSize }} />
    </Box>
  )
}