import React, { useContext } from 'react'
import { Routes, Route,Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext'

// we will check if the user not authenticated it will be redirected to login page, and if it is authenticated then it will be redirected to the homepage of profile page.
const App = () => {
  const {authUser}=useContext(AuthContext)  // ye ham AuthContest.js file se le rhe hain.
  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain"> {/* bg-contain---> Ye  background image ko pura container me fit karne ke liye use hota hai */}
    <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage />:<Navigate to="/login"/>} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/"/>} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
