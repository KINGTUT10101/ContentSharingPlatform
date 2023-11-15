import ContentCard from "../components/ContentCard"
import { Grid, TextField, Button, Tooltip, MenuItem } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'

const sortOptions = [
  "Downloads",
  "Upload Date",
  "Rating"
]

/**
 * @module Pages
 */
/**
 * Allows users to browse for content by applying tags, search terms, categories, etc
 * @returns {JSX.Element} A Browse component.
 */
function Browse() {
  return (
    <div>
      <TextField fullWidth label="Search" id="searchTerms" margin="normal" autoFocus />
      <Tooltip title="Separate each tag with a comma" placement="top-start" size="small">
        <TextField
          fullWidth
          id="searchTags"
          label="Tags"
          multiline
          maxRows={4}
          margin="normal"
        />
      </Tooltip>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem"}}>
        <TextField
          id="searchSort"
          select
          label="Sort by"
          defaultValue={sortOptions[0]}
          margin="normal"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained">
          <SearchIcon />
          Search
        </Button>
      </div>

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

export default Browse