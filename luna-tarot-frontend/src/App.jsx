import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import TarotReading from './pages/TarotReading';
import Profile from './pages/Profile';
import History from './pages/History';
import Premium from './pages/Premium';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { TarotProvider } from './context/TarotContext';

function App() {
  return (
    <AuthProvider>
      <TarotProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-mystic-900 to-cosmic-800">
            {/* 별들 배경 효과 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="stars"></div>
              <div className="twinkling"></div>
            </div>
            
            <Header />
            
            <main className="relative z-10 min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reading" element={<TarotReading />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  className: 'toast-success',
                },
                error: {
                  className: 'toast-error',
                },
              }}
            />
          </div>
        </Router>
      </TarotProvider>
    </AuthProvider>
  );
}

export default App;
