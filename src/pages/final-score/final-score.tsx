import { Box, Button, TextField } from "@mui/material"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

function FinalScore() {
  return (
    <Container maxWidth='md'>
      <Typography variant="h2">Final Score: 1</Typography>
      <br /><br />

      <form>
        <TextField fullWidth id="firstName" label="First Name" variant="outlined" />
        <br /> <br />
        <TextField fullWidth id="firstName" label="Last Name" variant="outlined" />
        <br /> <br />
        <TextField fullWidth id="firstName" label="Email Name" variant="outlined" />

        <Box
            sx={{
              width: '100%',
              textAlign: 'right',
              marginTop: 3
            }}
          >
            <Button type="submit" variant="contained">Submit</Button>
          </Box>
      </form>
    </Container>
  )
}

export default FinalScore