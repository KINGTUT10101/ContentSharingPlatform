import ContentCard from "../components/ContentCard"
import { Grid, Typography } from "@mui/material"

/**
 * The main page of the website. Shows recent announcements and featured content
 * @returns {JSX.Element} A Home component.
 */
export default function Home() {
  return (
    <div>
      <Typography variant="h4" align="center" paddingBottom={4}>
        Welcome to the Content Sharing Platform!
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} justifyContent="center" alignItems="center">
        {Array.from(Array(8)).map((_, index) => (
          <Grid item xs={2} sm={3} md={4}>
            <ContentCard />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}