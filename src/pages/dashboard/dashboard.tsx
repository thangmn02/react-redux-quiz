import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Box, Button, Container, TextField, Typography, FormHelperText, CircularProgress } from "@mui/material"
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useForm, Controller } from "react-hook-form";

import { type ICategory } from "../../types/dashboard.type";
import { settingQuestion } from "../../slices/dashboard.slice";
import { resetQuiz } from "../../slices/quiz.slice";

interface FormValues {
  category: string;
  difficulty: string;
  type: string;
  amount: number;
}

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // state
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);

  // react-hook-form setup
  const { control, register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      category: '',
      difficulty: '',
      type: '',
      amount: 10
    }
  });

  // effect
  React.useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch('https://opentdb.com/api_category.php');
        const data = await res.json();
        setCategories(data.trivia_categories);
      } catch (e) {
        console.log('error fetch category: ', e)
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategory();
  }, [])

  // action
  function onSubmit(data: FormValues) {
    const bodyData = {
      category: data.category,
      difficulty: data.difficulty,
      type: data.type,
      amount: Number(data.amount)
    }
    
    // Dispatch selected parameters to settingQuestion (dashboard.slice)
    dispatch(settingQuestion(bodyData));
    
    // Reset any previous quiz states
    dispatch(resetQuiz());
    
    // Navigate to question page
    navigate('question');
  }

  if (loadingCategories) {
    return (
      <Container maxWidth='md'>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // UI
  return (
    <>
      <Container maxWidth='md'>
        <Typography variant="h3" style={{ textAlign: 'center', margin: '20px 0' }}>Quiz App</Typography>
        <br /><br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  {...field}
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
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          <br /><br />
          <Controller
            name="difficulty"
            control={control}
            rules={{ required: "Difficulty is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select
                  {...field}
                  labelId="difficulty-select-label"
                  id="difficulty-select"
                  label="Difficulty"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
                {errors.difficulty && (
                  <FormHelperText>{errors.difficulty.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          <br /><br />
          <Controller
            name="type"
            control={control}
            rules={{ required: "Type is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  {...field}
                  labelId="type-select-label"
                  id="type-select"
                  label="Type"
                >
                  <MenuItem value="multiple">Multiple Choice</MenuItem>
                  <MenuItem value="boolean">True/False</MenuItem>
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          <br /><br />
          <TextField
            {...register("amount", {
              required: "Amount of question is required",
              valueAsNumber: true,
              validate: {
                isNumber: (value) => !isNaN(Number(value)) || "Must be a valid number",
                min: (value) => Number(value) >= 1 || "Must be at least 1 question",
                max: (value) => Number(value) <= 50 || "Must be at most 50 questions"
              }
            })}
            fullWidth
            id="amount-input"
            label="Amount of Question"
            variant="outlined"
            type="number"
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
        
          <Box
            sx={{
              width: '100%',
              textAlign: 'center',
              marginTop: 3
            }}
          >
            <Button type="submit" variant="contained" size="large">GET STARTED</Button>
          </Box>
        </form>
      </Container>
    </>
  )
}

export default Dashboard