import axios from "axios";
import React from "react";
import { Typography, TextField, Button, Tooltip } from "@mui/material"
import { Navigate } from "react-router-dom";
import getToken from "../getToken"
import fileToBase64 from "../fileToBase64"

/**
 * @module Pages
 */
/**
 * Allows users to log into their profiles, which is required to upload content and leave comments
 * @returns {JSX.Element} A Login component.
 */
function Upload() {
  const token = getToken()
  const username = localStorage.getItem('username')
  const [contentData, setContentData] = React.useState (null)
  const [thumbnailData, setThumbnailData] = React.useState (null)
  const [title, setTitle] = React.useState ('')
  const [description, setDescription] = React.useState ('')
  const [tags, setTags] = React.useState ('')

  if (!token || !username) {
    return <Navigate to="/login" />
  }

  async function onSubmit () {
    // Get user email
    let email
    await axios.get(`/api/getEmail/${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    }).then((response) => {
      email = response.data.email
    }).catch ((reason)=>alert ("Error: " + reason))
    
    // Check if fields are filled
    if (!email || !title || !description || !contentData || !thumbnailData) {
      alert ("Upload failed: Please make sure all the fields are filled")
      return
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `/api/contentUpload`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      data: {
        AuthorEmail: email,
        ContentType: "map",
        Title: title,
        Description: description,
        Tags: tags.replace(/\s/g, '').split(','),
        FileData: await fileToBase64 (contentData),
        ThumbnailData: await fileToBase64 (thumbnailData)
      },
    }

    axios.request(config).then((response) => {
      alert(response.data);
    }).catch ((reason)=>alert ("Error: " + reason))
  }

  return (
    <div>
      <Typography align="center" variant="h5" paddingBottom={1}>
        Upload Content
      </Typography>

      <TextField label="Title" fullWidth margin="normal" onChange={(event)=>setTitle(event.target.value)} />
      <TextField label="Description" multiline rows={4} fullWidth margin="normal" onChange={(event)=>setDescription(event.target.value)} />

      <Typography align="left" variant="subtitle1">
        Content
      </Typography>
      <TextField
        type="file"
        inputProps={{accept: ".slf"}}
        onChange={(event)=>setContentData(event.target.files[0])}
      />

      <Typography align="left" variant="subtitle1">
        Thumbnail
      </Typography>
      <TextField
        type="file"
        inputProps={{accept: "image/png"}}
        onChange={(event)=>setThumbnailData(event.target.files[0])}
      />
      
      <Tooltip title="Separate each tag with a comma" placement="top-start" size="small">
        <TextField label="Tags" fullWidth margin="normal" onChange={(event)=>setTags(event.target.value)} />
      </Tooltip>
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Upload
      </Button>
    </div>
  )
}

export default Upload