import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    // Fetch quizzes with respective impressions when the component mounts
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

        // Fetch quizzes with impressions
        const quizResponse = await axios.get(`http://localhost:3000/api/quizzesWithImpressions/${userId}`);
        setQuizzes(quizResponse.data.quizzes);

        const questionResponse = await axios.get(`http://localhost:3000/api/questionCount/${userId}`);
        setQuestionCount(questionResponse.data.questionCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total quizzes created: {quizzes.length}</p>

      <h2>List of Quizzes with Impressions</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <strong>{quiz.quizName}</strong> - Impressions: {quiz.impressionofQuiz}
            {/* <ul>
              {quiz.questions.map((question, index) => (
                <li key={index}>
                  <strong>Question {index + 1}:</strong> {question.question} - Impressions: {question.impressionofQuestion}
                </li>
              ))}
            </ul> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
