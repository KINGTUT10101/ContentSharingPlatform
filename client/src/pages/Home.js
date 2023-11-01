import ContentCard from "../components/ContentCard"
import { Grid } from "@mui/material"

export default function Home() {
  return (
    <div>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} justifyContent="center" alignItems="center">
        {Array.from(Array(8)).map((_, index) => (
          <Grid item xs={2} sm={3} md={4} key={index}>
            <ContentCard />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}