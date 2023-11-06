import { useParams } from 'react-router-dom';
import { Typography, Grid, Pagination } from '@mui/material';
import ProfileCard from "../components/ProfileCard"
import ContentCard from "../components/ContentCard"

/**
 * Shown when the user navigates to an invalid URL on the site
 * @returns {JSX.Element} A NotFound component.
 */
export default function NotFound() {
  let { param1 } = useParams();

  return (
    <div>
      <Typography align="center" variant="h3">
        404: Not found
      </Typography>
    </div>
  )
}