import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Questionanalytics = () => {
    const {quizId} = useParams();
  const [questions, setQuestions] = useState([]);
  const [quiztype,setQuiztype] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store userId in localStorage

        // Fetch quizzes with impressions
        const quiz = await axios.get(`http://localhost:3000/api/getquiz/${quizId}`);
        const fetchedquiz = quiz.data.quiz;
        setQuiztype(fetchedquiz.quizType);
        setQuestions(fetchedquiz.questions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {quiztype === "poll" ?
      <>
        <ul>
        {questions.map((questionInfo, index) => (
        <li key={index}>
          <p>Q.{index + 1} : {questionInfo.question}</p>
          {questionInfo.options.map((opt, optIndex) => (
            // Add a return statement here
            <p key={optIndex}>No of people opted for {opt.option} is {opt.impressionofOption}</p>
          ))}
        </li>
      ))}

      </ul>
      </>
      :
      <ul>
        {questions.map((questionInfo,index) => (
          <li key={index}>
            <p>Q.{index+1} : {questionInfo.question}</p>
            <p>People Attempted Question : {questionInfo.impressionofQuestion}</p>
            <p>Answered Correctly : {questionInfo.answeredCorrectly}</p>
            <p>Answered Incorrectly : {questionInfo.impressionofQuestion-questionInfo.answeredCorrectly}</p>
          </li>
        ))}
      </ul>}
    </div>
  );
};

export default Questionanalytics;
