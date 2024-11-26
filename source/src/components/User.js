import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import "../stylesheets/User.css";
import "../stylesheets/style.css";
export const User = () => { 
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [message, setMessage] = useState(""); // State to hold alert message
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);
  
  const handleNextQuestion = () => {
    if (userAnswers[currentQuestionIndex] == null || userAnswers[currentQuestionIndex] === "") {
      setMessage("Please provide an answer before proceeding."); // Set the alert message
      return;
    }
    setMessage(""); // Clear message if an answer is provided
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setMessage(""); // Clear message when navigating back
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleAnswerChange = (answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answer.toLowerCase().trim();
    setUserAnswers(updatedAnswers); 
    setMessage(""); // Clear message when an answer is provided
  };

  const handleQuizEnd = () => {
    let correctAnswersCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswersCount += 1;
      }
    });
    navigate("/result", { state: { userAnswers, questions, correctAnswersCount } });
  };

  return (
    <div className="final">
      <div className="User-container">
        {questions.length > 0 && (
          <div className="quest">
            <h2 id="quiz">Quiz</h2>
            <p className="question-progress">
              {currentQuestionIndex + 1}/{questions.length}
            </p>
            <p>Q) {questions[currentQuestionIndex].question}</p>

           

            <div className="user-opt">
              <h2 id="opt-h2">Options:</h2>
              {/* Check if options are present */}
              {questions[currentQuestionIndex].options && questions[currentQuestionIndex].options.length > 0 ? (
                <ol id="opt-id">
                  
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <label key={idx}>
                      <input
                        type="radio"
                        name={`question${currentQuestionIndex}`}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={() => handleAnswerChange(option)}
                      />
                      {option}<br />
                     
                    </label>
                  ))}
                </ol>
              ) : (
                // Render a text input if there are no options
                <input
                  type="text"
                  placeholder="Type your answer here"
                  value={userAnswers[currentQuestionIndex] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="user-answer-input"
                />
              )}
              {/* show alert message */}
 {message && <p className="alert-message">{message}</p>}
              <div className="navigation-buttons">
                {currentQuestionIndex > 0 && (
                  <button className="user-btn" onClick={handlePreviousQuestion}>
                    Previous
                  </button>
                )}
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <button className="user-btn" onClick={handleNextQuestion}>
                    Next
                  </button>
                ) : (
                  <button className="user-btn" onClick={handleQuizEnd}>
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
