import { LinearProgress, Box } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

/**
 * @module Components
 */
/**
 * Displays a rating/review bar where the negative side is red and the positive side is green
 * @param {Object} props
 * @param {string} props.fontSize The size of the icons on both sides of the progress bar
 * @param {string} props.rating The value represented by the rating bar. Can range between 0 to 100 (inclusive)
 * @returns {JSX.Element} A RatingBar component
 */
function RatingBar ({ fontSize="2rem", rating=50 }) {
  return (
    <Box data-testid="rating-bar" display="flex" alignItems="center" style={{width: "100%"}}>
      <ArrowCircleDownIcon sx={{ color: 'red', fontSize: fontSize }} />
      <LinearProgress
        variant="determinate"
        value={100 - rating}
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

export default RatingBar