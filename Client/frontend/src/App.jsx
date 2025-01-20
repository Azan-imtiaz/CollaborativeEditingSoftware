import React, { useEffect, useState } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CreateDocs from './pages/createDocs';

const App = () => {
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === "true");

  // useEffect to listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === "true");
    };

    // Add event listener for 'storage' event
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/createDocs/:docsId' element={isLoggedIn ? <CreateDocs /> : <Navigate to="/login" />} />
          <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;







// import React from 'react'
// import "./App.css"
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Home from './pages/Home';
// import NoPage from './pages/NoPage';
// import SignUp from './pages/SignUp';
// import Login from './pages/Login';
// import CreateDocs from './pages/createDocs';

// const App = () => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn') === "true";
// ;
// console.log(isLoggedIn)
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//             <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login"/>} />
//             <Route path='/signUp' element={<SignUp />} />
//             <Route path='/login' element={<Login />} />
//             <Route path='/createDocs/:docsId' element={isLoggedIn ? <CreateDocs /> : <Navigate to="/login"/>} />
//             <Route path="*" element={isLoggedIn ? <NoPage /> : <Navigate to="/login"/>} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App