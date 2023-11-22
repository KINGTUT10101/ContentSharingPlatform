import axios from "axios";
import React from "react";
import { useSearchParams } from 'react-router-dom';
import ContentCard from "../components/ContentCard"
import { Grid, TextField, Button, Tooltip, MenuItem, Pagination } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'

const sortOptions = [
  "Downloads",
  "UploadDate",
]
const cardsPerPage = 12

/**
 * @module Pages
 */
/**
 * Allows users to browse for content by applying tags, search terms, categories, etc
 * @returns {JSX.Element} A Browse component.
 */
function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = React.useState(Number (searchParams.get('page')))
  if (page === undefined || page < 1) setPage (1)
  const [sortBy, setSortBy] = React.useState(searchParams.get('sortBy') ?? sortOptions[0])
  const [tags, setTags] = React.useState(searchParams.get('tags') ?? "")
  const [searchString, setSearchString] = React.useState(searchParams.get('searchString') ?? "")

  const [contentIDArr, setContentIDArr] = React.useState(null);
  const [contentCount, setContentCount] = React.useState(null);
  React.useEffect(() => {
    let pageString = `/api/browseContent?page=${searchParams.get('page')}&count=${cardsPerPage}&sortBy=${searchParams.get('sortBy')}`
    let countString = `/api/countContent?`
    if (tags !== '') {
      pageString += `&tags=${searchParams.get("tags")}`
      countString += `&tags=${searchParams.get("tags")}`
    }
    if (searchString !== '') {
      pageString += `&searchString=${searchParams.get("searchString")}`
      countString += `&searchString=${searchParams.get("searchString")}`
    }

    axios.get(pageString).then((response) => {
      setContentIDArr(response.data);
    });

    axios.get(countString).then((response) => {
      setContentCount(response.data);
    });
  }, [searchParams, searchString, tags]);
  if (!contentIDArr || !contentCount) return null

  function onSubmit () {
    setSearchParams ({
      page: page,
      sortBy: sortBy, 
      tags: tags.replace(/\s/g, ''),
      searchString: searchString.replace(/\s/g, '+')
    })
  }

  return (
    <div>
      <TextField fullWidth label="Search" id="searchTerms" margin="normal" autoFocus onChange={(event)=>setSearchString(event.target.value)} />
      <Tooltip title="Separate each tag with a comma" placement="top-start" size="small">
        <TextField
          fullWidth
          id="searchTags"
          label="Tags"
          multiline
          maxRows={4}
          margin="normal"
          onChange={(event)=>setTags(event.target.value)}
        />
      </Tooltip>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem"}}>
        <TextField
          id="searchSort"
          select
          label="Sort by"
          margin="normal"
          value={sortBy}
          onChange={(event)=>setSortBy(event.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={onSubmit}
        >
          <SearchIcon />
          Search
        </Button>
      </div>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 16 }} justifyContent="center" alignItems="center">
        {contentIDArr.map((item) => (
          <Grid item xs={2} sm={3} md={4}>
            <ContentCard ContentID={item} />
          </Grid>
        ))}
      </Grid>

      <Pagination count={contentCount} page={page} onChange={()=>{}} variant="outlined" shape="rounded" style={{display: "flex", justifyContent: "center", paddingTop: "1rem"}} />
    </div>
  )
}

export default Browse