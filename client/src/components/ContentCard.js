import Paper from "@mui/material/Paper"
import Typography from '@mui/material/Typography';

let teststr = ""

for (let i = 0; i < 100000; ++i) {
  teststr += i
}

export default function ContentCard () {
  return (
    <div>
      <Paper elevation={30}>
        THIS IS A MAP
      </Paper>
      <Typography variant="h1" component="h2" noWrap={false}>
        {teststr}
      </Typography>
    </div>
  )
}