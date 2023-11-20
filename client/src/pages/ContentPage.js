import { useParams } from 'react-router-dom';
import { Pagination, Typography, Button, Container } from "@mui/material"
import ContentDetails from "../components/ContentDetails"
import Comment from "../components/Comment"

/**
 * @module Pages
 */
/**
 * Shows more detailed information about a piece of content and its comments
 * @returns {JSX.Element} A ContentPage component.
 */
function ContentPage() {
  let { ContentID } = useParams();
  
  return (
    <div>
      <ContentDetails ContentID={ContentID} />

      <Container>
        <div style={{marginTop: "1rem", marginBottom: "0.35rem", display: "flex", gap: "0.8rem", justifyContent: "left", alignItems: "center"}}>
          <Button variant="contained" style={{height: "80%"}}>Leave a comment</Button>
          <Typography align="left" variant="h5" fontSize="1.25rem" paddingY={1}>
            45 Comments
          </Typography>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
          {Array.from(Array(8)).map((_, index) => (
            <Comment CommentID="16558" />
          ))}
        </div>
      </Container>
      <Pagination count={10} variant="outlined" shape="rounded" style={{display: "flex", justifyContent: "center", paddingTop: "1rem"}} />
    </div>
  )
}

export default ContentPage