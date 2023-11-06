import { Typography } from '@mui/material';

/**
 * Shown when the user navigates to an invalid URL on the site
 * @returns {JSX.Element} A NotFound component.
 */
export default function NotFound() {
  return (
    <div>
      <Typography align="center" variant="h3">
        404: Not found
      </Typography>
    </div>
  )
}