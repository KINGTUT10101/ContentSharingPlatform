import { Typography, TextField, Button, Tooltip } from "@mui/material"

/**
 * @module Pages
 */
/**
 * Allows users to log into their profiles, which is required to upload content and leave comments
 * @returns {JSX.Element} A Login component.
 */
function Upload() {
  return (
    <div>
      <Typography align="center" variant="h5" paddingBottom={1}>
        Upload Content
      </Typography>

      <TextField label="Title" fullWidth margin="normal" />
      <TextField label="Description" multiline rows={4} fullWidth margin="normal" />

      <Typography align="left" variant="subtitle1">
        Content
      </Typography>
      <TextField type="file" accept=".zip" />

      <Typography align="left" variant="subtitle1">
        Thumbnail
      </Typography>
      <TextField type="file" accept="image/*" />
      
      <Tooltip title="Separate each tag with a comma" placement="top-start" size="small">
        <TextField label="Tags" fullWidth margin="normal" />
      </Tooltip>
      <Button variant="contained" color="primary" type="submit">
        Upload
      </Button>
    </div>
  )
}

export default Upload