import { useParams, useSearchParams } from 'react-router-dom';
import axios from "axios";
import React from "react";
import { Pagination, Typography, Button, Container } from "@mui/material"
import ContentDetails from "../components/ContentDetails"
import Comment from "../components/Comment"

const commentsPerPage = 20

/**
 * @module Pages
 */
/**
 * Shows more detailed information about a piece of content and its comments
 * @returns {JSX.Element} A ContentPage component.
 */
function ContentPage() {
  let { ContentID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = React.useState(Number (searchParams.get('page')) ?? 1)
  if (page === undefined || page < 1) setPage (1)

  const [commentDataArr, setCommentDataArr] = React.useState(null);
  const [commentCount, setCommentCount] = React.useState(null);
  React.useEffect(() => {
    axios.get(`/api/comments/${ContentID}?page=${page}&count=${commentsPerPage}`).then((response) => {
      setCommentDataArr(response.data);
    });
    axios.get(`/api/commentCount/${ContentID}`).then((response) => {
      setCommentCount(response.data.count);
    });
  }, [ContentID, page]);
  if (!commentDataArr || !commentCount) return null

  const totalPages = Math.ceil (commentCount / commentsPerPage)

  function onPageChange (event, value) {
    setSearchParams ({page: value})
    setPage (value)
    window.scrollTo(0, 0)
  }

  return (
    <div>
      <ContentDetails ContentID={ContentID} />

      <Container>
        <div style={{marginTop: "1rem", marginBottom: "0.35rem", display: "flex", gap: "0.8rem", justifyContent: "left", alignItems: "center"}}>
          <Button variant="contained" style={{height: "80%"}}>Leave a comment</Button>
          <Typography align="left" variant="h5" fontSize="1.25rem" paddingY={1}>
            {commentCount} Comments
          </Typography>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
          {commentDataArr.map((item) => (
            <Comment CommentData={item} />
          ))}
        </div>
      </Container>
      <Pagination count={totalPages} page={page} onChange={onPageChange} variant="outlined" shape="rounded" style={{display: "flex", justifyContent: "center", paddingTop: "1rem"}} />
    </div>
  )
}

export default ContentPage