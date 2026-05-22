import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import DescriptionIcon from '@mui/icons-material/Description';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

function Leaderboard() {
  // Retrieve leaderboard entries from Redux store
  const { entries } = useSelector((state: RootState) => state.leaderboard);

  // CSV Export Action
  const handleExportCSV = () => {
    if (entries.length === 0) return;

    const headers = ["First Name", "Last Name", "Email", "Score"];
    
    const csvRows = entries.map(entry => [
      `"${entry.firstName.replace(/"/g, '""')}"`,
      `"${entry.lastName.replace(/"/g, '""')}"`,
      `"${entry.email.replace(/"/g, '""')}"`,
      entry.score
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quiz_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth='md'>
      <Typography variant="h2" sx={{ textAlign: 'center', margin: '20px 0' }}>Leaderboard</Typography>
      
      <Box
        sx={{
          width: '100%',
          textAlign: 'right',
          my: 3
        }}
      >
        <Button 
          type="button" 
          variant="contained" 
          startIcon={<DescriptionIcon />}
          onClick={handleExportCSV}
          disabled={entries.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      {entries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', my: 2 }}>
          <Typography variant="h6" color="textSecondary">
            No submissions yet! Be the first to take the quiz and save your score.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="leaderboard table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1rem' }}>First Name</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Last Name</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Email</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow
                  key={`${entry.email}-${index}`}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <TableCell>{entry.firstName}</TableCell>
                  <TableCell>{entry.lastName}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default Leaderboard