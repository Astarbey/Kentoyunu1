import React, { useState, useEffect } from 'react';
  import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
  import Login from './components/Login';
  import AdminPanel from './components/AdminPanel';
  import UserPanel from './components/UserPanel';
  import QuestionPage from './components/QuestionPage';

  function App() {
    const [user, setUser] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
      setQuestions(storedQuestions);
    }, []);

    const handleLogin = (username, password) => {
      if (password === '1234') {
        setUser({ username });
        showFeedbackMessage('Başarıyla giriş yaptınız.');
      } else if (username === 'admin' && password === 'admin') {
        setUser({ username: 'admin' });
        showFeedbackMessage('Başarıyla giriş yaptınız.');
      } else {
        setFeedbackMessage('Geçersiz kullanıcı adı veya şifre');
        setShowFeedback(true);
      }
    };

    const handleLogout = () => {
      setUser(null);
    };

    const showFeedbackMessage = (message) => {
      setFeedbackMessage(message);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    };

    return (
      <div>
        {showFeedback && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: '#d4af37', color: 'white', padding: '10px', textAlign: 'center' }}>
            {feedbackMessage}
          </div>
        )}
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.username === 'admin' ? '/admin' : '/user'} /> : <Login onLogin={handleLogin} />} />
          <Route path="/admin" element={user?.username === 'admin' ? <AdminPanel onLogout={handleLogout} setFeedbackMessage={setFeedbackMessage} showFeedbackMessage={showFeedbackMessage} /> : <Navigate to="/" />} />
          <Route path="/user" element={user?.username !== 'admin' ? <UserPanel user={user} onLogout={handleLogout} setFeedbackMessage={setFeedbackMessage} showFeedbackMessage={showFeedbackMessage} /> : <Navigate to="/" />} />
          <Route path="/question/:questionId" element={<QuestionPage user={user} questions={questions} />} />
        </Routes>
      </div>
    );
  }

  export default App;
