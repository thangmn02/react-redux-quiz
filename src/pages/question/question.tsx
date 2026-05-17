import { Box, Button, Container, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import {decode} from 'html-entities'
import type { RootState } from "../../store"
import React from "react";
import type { IResult } from "../../types/question.type";

function Question() {
  const dashboard = useSelector((state: RootState) => state.dashboard)
  // https://opentdb.com/api.php?amount=3&category=11&difficulty=easy&type=multiple
  const { category, difficulty, type, amount } = dashboard;
  const [dataSource, setDataSource] = React.useState<IResult[]>([]);
  const [options, setOptions] = React.useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = React.useState(0);
 
  React.useEffect(() => {
    if (!category || !difficulty || !type || !amount) return;

    async function fetchResults() {
      try {
        const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`);
        const data = await res.json();
        const results = data.results;
        const question = results[questionIndex];
        const anwsers = [...question.incorrect_answers];
        anwsers.splice(
          Math.floor(Math.random() * 4),
          0,
          question.correct_answer
        )
        setOptions(anwsers)
        setDataSource(results);
      } catch (e) {
        console.log('error fetch question: ', e)
      }
    }
    fetchResults();

  }, [category, difficulty, type, amount])

  return (
    <>
      <Container maxWidth='md'>
        <Typography variant="h3" style={{ textAlign: 'center' }}>Question {questionIndex + 1}</Typography>
        <br /><br />

        <Typography>
          {decode(dataSource[questionIndex]?.question)}
        </Typography>

        <Box sx={{ my: 3 }}>
          {options.map(option => (
            <>
              <Button fullWidth key={option} type="button" variant="contained">{decode(option)}</Button>
              <br /><br />
            </>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>
            Score 0/{dataSource.length}
          </Typography>
          <Typography>
            Timer: 0:28
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default Question