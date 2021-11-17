import './App.css';
import NavbarPage from './Components/Navbar';
import SignUp from './Components/SignUp';
import Profile from './Components/Profile';
import Login from './Components/Login';
import Home from './Components/Home';
import PageNotFound from './Components/PageNotFound';
import Passanger from './Components/Passanger';
import NewPassanger from './Components/NewPassanger';
import { AuthProvider } from "./Context/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <NavbarPage />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/passanger' element={<NewPassanger />} />
            <Route default element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
