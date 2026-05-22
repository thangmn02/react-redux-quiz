import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import { decode } from 'html-entities';
import type { RootState, AppDispatch } from "../../store";
import React from "react";
import { fetchQuestions, answerQuestion, skipQuestion } from "../../slices/quiz.slice";

function Question() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const { category, difficulty, type, amount } = dashboard;

  const { questions, currentQuestionIndex, score, status, error } = useSelector((state: RootState) => state.quiz);

  // Local state for options and timer
  const [options, setOptions] = React.useState<string[]>([]);
  const [timer, setTimer] = React.useState(30);

  // 1. Fetch questions on mount
  React.useEffect(() => {
    if (!category || !difficulty || !type || !amount) {
      navigate('/');
      return;
    }
    dispatch(fetchQuestions({ category, difficulty, type, amount }));
  }, [category, difficulty, type, amount, dispatch, navigate]);

  // 2. Shuffle options when current question changes
  React.useEffect(() => {
    if (questions.length === 0 || status !== 'succeeded') return;
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const answers = [...currentQuestion.incorrect_answers];
    answers.splice(
      Math.floor(Math.random() * (answers.length + 1)),
      0,
      currentQuestion.correct_answer
    );
    setOptions(answers);
  }, [questions, currentQuestionIndex, status]);

  // 3. Countdown timer logic
  React.useEffect(() => {
    if (status !== 'succeeded' || questions.length === 0 || currentQuestionIndex >= questions.length) return;

    setTimer(30);

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleNextQuestion(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentQuestionIndex, questions.length, status]);

  // 4. Handle transition to next question or end
  const handleNextQuestion = (selectedAnswer: string | null) => {
    if (selectedAnswer !== null) {
      dispatch(answerQuestion({ selectedAnswer }));
    } else {
      dispatch(skipQuestion());
    }

    if (currentQuestionIndex + 1 >= questions.length) {
      navigate('/final-score');
    }
  };

  // Rendering loading state
  if (status === 'loading') {
    return (
      <Container maxWidth='md'>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="textSecondary">Loading Quiz Questions...</Typography>
        </Box>
      </Container>
    );
  }

  // Rendering error state
  if (status === 'failed') {
    return (
      <Container maxWidth='md'>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error">{error || 'Failed to load quiz'}</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>Back to Dashboard</Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <>
      <Container maxWidth='md'>
        <Typography variant="h3" style={{ textAlign: 'center', margin: '20px 0' }}>
          Question {currentQuestionIndex + 1}
        </Typography>
        <br /><br />

        <Typography variant="h5" sx={{ mb: 4, lineHeight: 1.6 }}>
          {decode(currentQuestion.question)}
        </Typography>

        <Box sx={{ my: 3 }}>
          {options.map((option) => (
            <Box key={option} sx={{ mb: 2 }}>
              <Button
                fullWidth
                type="button"
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
                onClick={() => handleNextQuestion(option)}
              >
                {decode(option)}
              </Button>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, borderTop: '1px solid #ddd', pt: 2 }}>
          <Typography variant="h6" color="textSecondary">
            Score: {score}/{questions.length}
          </Typography>
          <Typography variant="h6" sx={{ color: timer <= 10 ? 'error.main' : 'text.secondary' }}>
            Timer: 0:{timer < 10 ? `0${timer}` : timer}
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default Question