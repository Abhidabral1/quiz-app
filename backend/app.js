require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Question = require("./models/question");
const authenticateAdmin = require("./middleware/authenticateAdmin");

const app = express();

// Middleware setup 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection 
mongoose.connect("mongodb://localhost:27017/usersignupdetail", {})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
 
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstname, lastname, email, password: hashedPassword, role });
    await user.save();

    res.json({ message: `Signup successful for ${firstname} ${lastname}` });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ 
      message: `Login request received for ${email}`, 
      isAdmin: user.role === 'admin', 
      role: user.role,
      token
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
});
   
// Add Question Route
app.post('/api/questions', authenticateAdmin, async (req, res) => {
  const { question, options, correctAnswer } = req.body;
  
if(options && options.length > 0 && !options.includes(correctAnswer)){
  return res.status(400).json({message: "Correct answer must be one of the options"});
}

  try {
    const newQuestion = new Question({ question, options, correctAnswer });
    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully!" });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Error creating question" });
  }
});

// Get Questions Route
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});
// Submit Answers Route
app.post('/api/submit-answers', async (req, res) => {
  const { userAnswers } = req.body;

  try {
    const questions = await Question.find({ _id: { $in: Object.keys(userAnswers) } });

    let score = 0;
    const results = questions.map(question => {
      const isCorrect = question.correctAnswer === userAnswers[question._id];
      if (isCorrect) score += 1;
      
      return {
        questionId: question._id,
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswers[question._id],
        isCorrect
      };
    });

    res.json({ message: "Answers submitted", score, results });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ message: "Error submitting answers" });
  }
});          

// delete route
app.delete('/api/questions/:id', authenticateAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Error deleting question" });
  }
});

app.get("/logout", function(req, res){
  res.send("user data is deleted");
  User.findOneAndDelete(User)
})

// Edit Question Route
app.put('/api/questions/:id', authenticateAdmin, async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  // Validate that the correct answer is one of the options
 if(options && options.length > 0 && !options.includes(correctAnswer)){
  return res.status(400).json({ message: "Correct answer must be one of the options"})
 } 
  try {
    // Find the question by ID and update it with the new data
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id, 
      { question, options, correctAnswer }, 
      { new: true } // return the updated document
    );

    // If no question found, return an error
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Send the updated question in the response
    res.json({
      message: "Question updated successfully",
      updatedQuestion,
    });

  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question" });
  }
});


app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

// Code with Sloba