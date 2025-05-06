import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from 'lucide-react';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { authUser } from './redux/thunks/userThunks';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const { themes } = useSelector((state) => state.userTheme); // ✅ Access theme from state

  useEffect(() => {
    dispatch(authUser())
      .unwrap()
      .catch(() => {
        // Optional: Handle auth error
      });
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }

  return (
    <div data-theme={themes}> {/* ✅ Apply current theme */ }
      <Navbar isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/settings' element={isAuthenticated ? <SettingsPage /> : <Navigate to='/login' />} />
        <Route path='/profile' element={isAuthenticated ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='*' element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
