import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quizanalysis = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [totalQuizImpressions, setTotalQuizImpressions] = useState(0);

  useEffect(() => {
    // Fetch quizzes with respective impressions when the component mounts
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

        // Fetch quizzes with impressions
        const quizResponse = await axios.get(`http://localhost:3000/api/quizzesWithImpressions/${userId}`);
        const fetchedQuizzes = quizResponse.data.quizzes;
        
        // Calculate total quiz impressions
        const totalQuizImpressions = fetchedQuizzes.reduce((total, quiz) => total + quiz.impressionofQuiz, 0);
        setTotalQuizImpressions(totalQuizImpressions);

        setQuizzes(fetchedQuizzes);

        const questionResponse = await axios.get(`http://localhost:3000/api/questionCount/${userId}`);
        setQuestionCount(questionResponse.data.questionCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <ul>
        {quizzes.map((quiz,index) => (
          <li key={quiz._id}>
            <strong>{quiz.quizName}</strong> - Impressions: {quiz.impressionofQuiz}
            <p>- created on: {quiz.date}</p> 
        <p>
            <a href={`/question-analysis/${quiz._id}`}>Question Analytics</a>
        </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizanalysis;
