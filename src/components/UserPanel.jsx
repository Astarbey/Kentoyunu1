import React, { useState, useEffect } from 'react';

  function UserPanel({ user, onLogout, setFeedbackMessage, showFeedbackMessage }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [answeredCount, setAnsweredCount] = useState(0);
    const [userProgress, setUserProgress] = useState({ correct: 0, wrong: 0 });
    const [userAnswers, setUserAnswers] = useState({});

    useEffect(() => {
      const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
      setQuestions(storedQuestions);
      const storedAnsweredCount = JSON.parse(localStorage.getItem(`${user.username}_answeredCount`)) || 0;
      setAnsweredCount(storedAnsweredCount);
      const storedProgress = JSON.parse(localStorage.getItem(user.username)) || { correct: 0, wrong: 0 };
      setUserProgress(storedProgress);
      const storedUserAnswers = JSON.parse(localStorage.getItem(`${user.username}_answers`)) || {};
      setUserAnswers(storedUserAnswers);
    }, [user.username]);

    useEffect(() => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (!users.includes(user.username)) {
        users.push(user.username);
        localStorage.setItem('users', JSON.stringify(users));
      }
    }, [user.username]);

    useEffect(() => {
      if (answeredCount === questions.length && questions.length > 0) {
        showFeedbackMessage('Tüm soruları yanıtladınız!');
      }
    }, [answeredCount, questions.length]);

    useEffect(() => {
      setUserAnswer('');
    }, [currentQuestionIndex]);

    const handleAnswerSubmit = () => {
      const isCorrect = userAnswer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();
      let updatedProgress = { ...userProgress };
      let updatedUserAnswers = { ...userAnswers };

      // Önceki cevabın doğru olup olmadığını ve var olup olmadığını kontrol et
      const previousAnswerWasCorrect =
        userAnswers[currentQuestionIndex] !== undefined &&
        userAnswers[currentQuestionIndex].answer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();
      const previousAnswerExists = userAnswers[currentQuestionIndex] !== undefined;

      if (isCorrect) {
        // Yeni cevap doğru
        // Yalnızca doğru cevap verildiğinde answeredCount değerini artır
        const newAnsweredCount = answeredCount + 1;
        setAnsweredCount(newAnsweredCount);
        localStorage.setItem(`${user.username}_answeredCount`, JSON.stringify(newAnsweredCount));

        // Eğer önceki cevap yanlışsa veya cevap yoksa, doğru sayısını artır ve yanlış sayısını azalt
        if (!previousAnswerWasCorrect) {
          updatedProgress.correct += 1;
          updatedProgress.wrong = Math.max(0, updatedProgress.wrong - 1);
        }

        showFeedbackMessage('Cevabınız doğru!');
      } else {
        // Yeni cevap yanlış
        showFeedbackMessage('Cevabınız yanlış!');

        // Eğer önceki cevap doğruysa veya cevap yoksa, yanlış sayısını artır
        if (!previousAnswerWasCorrect) {
          updatedProgress.wrong += 1;
        }

        // Önceki cevap doğruysa, doğru sayısını azaltma
      }

      // Cevabı, doğru/yanlış bilgisini ve localStorage'a kaydet
      updatedUserAnswers[currentQuestionIndex] = { answer: userAnswer, isCorrect: isCorrect };
      setUserAnswers(updatedUserAnswers);
      localStorage.setItem(`${user.username}_answers`, JSON.stringify(updatedUserAnswers));

      // Diğer güncellemeler
      localStorage.setItem(user.username, JSON.stringify(updatedProgress));
      setUserProgress(updatedProgress);
      setUserAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

    const handleEditAnswer = (index) => {
      setCurrentQuestionIndex(index);
      // Doğru değeri userAnswers nesnesinden al
      setUserAnswer(userAnswers[index] ? userAnswers[index].answer : '');
    };

    const handleSaveAndLogout = () => {
      localStorage.setItem(`${user.username}_answers`, JSON.stringify(userAnswers));
      showFeedbackMessage('Cevaplar kaydedildi.');
    };

    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Hoşgeldin, {user.username}!</h2>
        {questions.length > 0 && (
          <div>
            {questions.map((question, index) => (
              <div key={index}>
                <h3>Soru {index + 1}</h3>
                <p>{question.question}</p>
                {userAnswers[index] !== undefined && (
                  <div>
                    <p>Cevabınız: {userAnswers[index].answer}</p>
                    <button onClick={() => handleEditAnswer(index)}>Cevabı Değiştir</button>
                  </div>
                )}
                {(currentQuestionIndex === index) && (
                  <div>
                    <input
                      type="text"
                      placeholder="Cevabınız"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    {/* Tüm sorular yanıtlandığında butonu gizle */}
                    {answeredCount !== questions.length && (
                      <button onClick={handleAnswerSubmit}>
                        {userAnswers[index] !== undefined ? 'Cevabı Güncelle' : 'Cevabı Gönder'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <p>Doğru Cevap: {userProgress.correct}</p>
        <p>Yanlış Cevap: {userProgress.wrong}</p>
        {/* Tüm sorular yanıtlandığında bu butonu gösterme */}
        {answeredCount !== questions.length && (
          <button onClick={handleSaveAndLogout}>Cevapları Kaydet</button>
        )}
        <button onClick={onLogout}>Çıkış Yap</button>
      </div>
    );
  }

  export default UserPanel;
