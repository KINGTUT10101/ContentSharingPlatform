import { Typography, Grid, Pagination } from '@mui/material';
import ProfileCard from "../components/ProfileCard"
import ContentCard from "../components/ContentCard"

/**
 * Shows information about a user and the content they've uploaded
 * @returns {JSX.Element} A Profile component.
 */
export default function Profile() {
  return (
    <div>
      <ProfileCard />
      <Typography align="left" variant="h5" paddingY={1}>
        Content: 23 items
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} justifyContent="center" alignItems="center" paddingBottom={2}>
        {Array.from(Array(8)).map((_, index) => (
          <Grid item xs={2} sm={3} md={4}>
            <ContentCard />
          </Grid>
        ))}
      </Grid>
      <Pagination count={10} variant="outlined" shape="rounded" style={{display: "flex", justifyContent: "center"}} />
    </div>
  )
}