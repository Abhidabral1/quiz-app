import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { User } from "./components/User";
import { Result } from "./components/Result";
import { Signup } from "./components/Signup";
import { Admin } from "./components/Admin";
import { ProtectedRoute } from "./authentication/ProtectedRoute";
import { useAuth, AuthProvider } from "./authentication/AuthContext";
 import { ViewQuestions } from "./components/ViewQuestions";
function App() {
  
  const { user } = useAuth(); // it use user instead of isadmin
  const isAdmin = user?.role === 'admin'; // it is use to determine admin status

  return (
    <div className="main">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<User />} />
          <Route path="/result" element={<Result />} />
          <Route path="/ViewQuestions" element={<ViewQuestions/>}/>
          <Route path="/admin" element={
            <ProtectedRoute isAdmin={isAdmin}>
              <Admin />
            </ProtectedRoute>   
          } />
          {/* <Route path='/admin' isAdmin={isAdmin} element={<Admin/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
