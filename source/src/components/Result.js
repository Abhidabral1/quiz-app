import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../stylesheets/Result.css';

export const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userAnswers = [], questions = [], correctAnswersCount = 0 } = location.state || {};

  const totalQuestions = questions.length;
  const wrongAnswers = totalQuestions - correctAnswersCount;
  const score = (correctAnswersCount / totalQuestions) * 100;

  return (
    <div className="result-container">
      <div className="result-card">
        <h1>Quiz Result</h1>
        <div className="user-info">
          <p>User: </p> {/* Add user name if available */}
        </div>

        <div className="score-info">
          <p>Total Questions: {totalQuestions}</p>
          <p>Correct Answers: {correctAnswersCount}</p>
          <p>Wrong Answers: {wrongAnswers}</p>
          <p>Score: {score.toFixed(2)}%</p>
          
        </div>

        <div className="result-buttons">
          <button className="retake-btn" onClick={() => navigate("/user")}>Retake Quiz</button>
          <button className="details-btn"  onClick={() => navigate("/")}>logout</button>
        </div>

      </div>
    </div>
  );
};
