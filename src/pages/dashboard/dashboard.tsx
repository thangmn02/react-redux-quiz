
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { type ICategory } from "../../types/dashboard.type";
import { settingQuestion } from "../../slices/dashboard.slice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // state
  const [categories, setCategories] = React.useState<ICategory[]>([]);

  
  // effect
  React.useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch('https://opentdb.com/api_category.php');
        const data = await res.json();
        setCategories(data.trivia_categories);
      } catch (e) {
        console.log('error fetch category: ', e)
      }
    }
    fetchCategory();
  }, [])

  // action
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const bodyData = {
      category: 11,
      difficulty: 'easy',
      type: 'multiple',
      amount: 3
    }
    dispatch(settingQuestion(bodyData))
    navigate('question')
  }

  // UI
  return (
    <>
      <Container maxWidth='md'>
        <Typography variant="h3" style={{ textAlign: 'center' }}>Quiz App</Typography>
        <br /><br />
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              label="Category"
            >
              {categories.map(category => {
                return (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <br /><br />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-select-label"
              id="difficulty-select"
              label="Difficulty"
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <br /><br />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              label="Type"
            >
              <MenuItem value="multiple">Multiple Choice</MenuItem>
              <MenuItem value="boolean">True/False</MenuItem>
            </Select>
          </FormControl>
          <br /><br />
          <TextField fullWidth id="outlined-basic" label="Amount of Question" variant="outlined" />
        
          <Box
            sx={{
              width: '100%',
              textAlign: 'center',
              marginTop: 3
            }}
          >
            <Button type="submit" variant="contained">GET STARTED</Button>
          </Box>
        </form>
      </Container>
    </>
  )
}

export default Dashboard