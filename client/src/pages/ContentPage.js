import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import React from "react";
import { Pagination, Typography, Button, Container, IconButton } from "@mui/material"
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ContentDetails from "../components/ContentDetails"
import Comment from "../components/Comment"
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown';
import getToken from "../getToken"

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
  const navigate = useNavigate()
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

  async function onRate (rating) {
    const token = getToken ()
    const username = localStorage.getItem('username')

    if (!token || !username) {
      alert ("Please log in")
      navigate(`/login`)
      return
    }
    
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `/api/rate/${ContentID}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      data: {
        username: username,
        rating: rating
      },
    }

    axios.request(config).then((response) => {
      alert ("Content successfully rated!")
    }).catch ((reason)=>alert ("Error (Note that you can't rate multiple times): " + reason))
  }

  return (
    <div>
      <ContentDetails ContentID={ContentID} />

      <Container>
        <div style={{marginTop: "1rem", marginBottom: "0.35rem", display: "flex", gap: "0.8rem", justifyContent: "left", alignItems: "center"}}>
          <IconButton onClick={()=>onRate(false)} style={{height: "80%"}}>
            <ArrowCircleDownIcon />
          </IconButton>
          <IconButton onClick={()=>onRate(true)} style={{height: "80%"}}>
            <ArrowCircleUpIcon />
          </IconButton>

          <IconButton style={{height: "80%"}}>
            <InsertCommentIcon />
          </IconButton>
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