import React, { useState, useEffect } from 'react';

  function UserProgressPanel({ onClose }) {
    const [userProgress, setUserProgress] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
      setQuestions(storedQuestions);

      const users = JSON.parse(localStorage.getItem('users')) || [];
      let progress = {};
      users.forEach(username => {
        const storedProgress = JSON.parse(localStorage.getItem(username)) || { correct: 0, wrong: 0 };
        const storedUserAnswers = JSON.parse(localStorage.getItem(`${username}_answers`)) || {};
        progress[username] = { ...storedProgress, answers: storedUserAnswers };
      });
      setUserProgress(progress);
    }, []);

    const handleDeleteUser = (username) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.filter(u => u !== username);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem(username);
      localStorage.removeItem(`${username}_answers`);
      localStorage.removeItem(`${username}_answeredCount`);

      const updatedProgress = { ...userProgress };
      delete updatedProgress[username];
      setUserProgress(updatedProgress);
    };

    return (
      <div>
        <h3 style={{ color: '#d4af37' }}>Kullanıcı İlerlemesi</h3>
        {Object.keys(userProgress).length > 0 ? (
          Object.keys(userProgress).map((username) => (
            <div key={username}>
              <h4 style={{ color: '#d4af37' }}>{username}</h4>
              <p>Doğru Cevap: {userProgress[username].correct}</p>
              <p>Yanlış Cevap: {userProgress[username].wrong}</p>
              <h5>Cevap Detayları:</h5>
              {questions.map((question, index) => {
                const answerData = userProgress[username].answers[index];
                const isCorrect = answerData && answerData.isCorrect;
                return (
                  <div key={index}>
                    <p>
                      Soru {index + 1}: {question.question} -{' '}
                      {isCorrect !== undefined ? (
                        <span style={{ color: isCorrect ? 'green' : 'red' }}>
                          {isCorrect ? 'Doğru' : 'Yanlış'}
                        </span>
                      ) : (
                        <span>Cevap Yok</span>
                      )}
                    </p>
                    {answerData && <p>Cevap: {answerData.answer}</p>}
                  </div>
                );
              })}
              <button onClick={() => handleDeleteUser(username)}>Kullanıcıyı Sil</button>
            </div>
          ))
        ) : (
          <p>Henüz hiçbir kullanıcı soru yanıtlamadı.</p>
        )}
        <button onClick={onClose}>Admin Panel'e Geri Dön</button>
      </div>
    );
  }

  export default UserProgressPanel;
