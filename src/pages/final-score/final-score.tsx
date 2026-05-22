import { Box, Button, TextField, Container, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../store";
import { addLeaderboardEntry } from "../../slices/leaderboard.slice";
import React from "react";

interface InfoFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

function FinalScore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read quiz details from Redux store
  const { score, questions } = useSelector((state: RootState) => state.quiz);
  const totalQuestions = questions.length;

  // react-hook-form setup
  const { register, handleSubmit, formState: { errors } } = useForm<InfoFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  function onSubmit(data: InfoFormValues) {
    const newEntry = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      score: score,
      totalQuestions: totalQuestions,
      date: new Date().toLocaleString('en-US', { hour12: false })
    };

    // Add entry and persist it to localStorage via Redux leaderboard slice
    dispatch(addLeaderboardEntry(newEntry));

    // Navigate to the Leaderboard page
    navigate('/leaderboard');
  }

  // Guard against direct page access
  React.useEffect(() => {
    if (totalQuestions === 0) {
      navigate('/');
    }
  }, [totalQuestions, navigate]);

  if (totalQuestions === 0) {
    return null;
  }

  return (
    <Container maxWidth='md'>
      <Typography variant="h2" sx={{ textAlign: 'center', margin: '20px 0' }}>
        Final Score: {score} / {totalQuestions}
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
        Great job! Please fill in your information to save your score.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("firstName", {
            required: "First name is required",
            minLength: { value: 2, message: "First name must be at least 2 characters" },
            maxLength: { value: 50, message: "First name must be at most 50 characters" }
          })}
          fullWidth
          id="firstName"
          label="First Name"
          variant="outlined"
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <br /> <br />

        <TextField
          {...register("lastName", {
            required: "Last name is required",
            minLength: { value: 2, message: "Last name must be at least 2 characters" },
            maxLength: { value: 50, message: "Last name must be at most 50 characters" }
          })}
          fullWidth
          id="lastName"
          label="Last Name"
          variant="outlined"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <br /> <br />

        <TextField
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address"
            }
          })}
          fullWidth
          id="email"
          label="Email Address"
          variant="outlined"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Box
          sx={{
            width: '100%',
            textAlign: 'right',
            marginTop: 3
          }}
        >
          <Button type="submit" variant="contained" size="large">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  )
}

export default FinalScore