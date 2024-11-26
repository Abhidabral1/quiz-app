import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
// import "../stylesheets/ViewQuestion.css";
import "../stylesheets/style.css";
export const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [message , setMessage]= useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user || !user.token) {
        console.warn("No token found. Redirecting to login.");
        navigate('/'); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/questions", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setQuestions(questions.filter((question) => question._id !== id));
      setMessage("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question.");
    }
  };

  const handleEdit = (question) => {
    navigate("/admin", { state: { question } });
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="VQuestion-container">
      <h2 className="vq-h2">All Questions</h2>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <ul>
          {questions.map((question) => (
            <li key={question._id}>
              <strong>Question: </strong>{question.question}<br />
              <strong>Type: </strong>{question.options?.length > 0 ? 'Option-Type' : 'Text-Type'}<br />
              {question.options?.length > 0 && (
  <>
    <strong>Options: </strong>{question.options.join(', ')}<br />
  </>
)}


              <strong>Correct Answer: </strong>{question.correctAnswer.toLowerCase().trim()}<br />
              <button className="vqt-btn" onClick={() => handleEdit(question)}>Edit</button>
              <button className="vqt-btn" onClick={() => handleDelete(question._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/admin">
        <button id="vqt-id">Your Admin Dashboard</button>
      </Link>
      {message && <p className="alert-message">{message}</p>}
    </div>
  );
};
