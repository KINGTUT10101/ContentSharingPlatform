import axios from "axios";
import React from "react";
import { useParams } from 'react-router-dom';
import { Typography, Grid, Pagination } from '@mui/material';
import ProfileCard from "../components/ProfileCard"
import ContentCard from "../components/ContentCard"

/**
 * @module Pages
 */
/**
 * Shows information about a user and the content they've uploaded
 * @returns {JSX.Element} A Profile component.
 */
function Profile() {
  let { Username } = useParams();

  const [contentCount, setContentCount] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/countProfileContent/${Username}`).then((response) => {
      setContentCount(response.data.count);
    });
  }, [Username]);
  if (contentCount === null) return null

  return (
    <div>
      <ProfileCard Username={Username} />
      {
        contentCount >= 1 &&
        <div>
          <Typography align="left" variant="h5" paddingY={1}>
            {contentCount} Items Uploaded
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} justifyContent="center" alignItems="center" paddingBottom={2}>
            {Array.from(Array(8)).map((_, index) => (
              <Grid item xs={2} sm={3} md={4}>
                <div />{/* <ContentCard /> */}
              </Grid>
            ))}
          </Grid>
          {/* <Pagination count={10} variant="outlined" shape="rounded" style={{display: "flex", justifyContent: "center"}} /> */}
        </div>
      }
    </div>
  )
}

export default Profile