import { Typography } from '@mui/material';

/**
 * Shown when the user navigates to an invalid URL on the site
 * @category Pages
 * @returns {JSX.Element} A NotFound component.
 */
function NotFound() {
  return (
    <div>
      <Typography align="center" variant="h3">
        404: Not found
      </Typography>
    </div>
  )
}

export default NotFound