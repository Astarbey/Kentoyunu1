import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';

  function QuestionPage({ user, questions }) {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [userProgress, setUserProgress] = useState({ correct: 0, wrong: 0 });
    const [userAnswers, setUserAnswers] = useState({});

    useEffect(() => {
      if (!user) {
        navigate('/');
      } else {
        const storedProgress = JSON.parse(localStorage.getItem(user.username)) || { correct: 0, wrong: 0 };
        setUserProgress(storedProgress);
        const storedUserAnswers = JSON.parse(localStorage.getItem(`${user.username}_answers`)) || {};
        setUserAnswers(storedUserAnswers);
        const currentQuestion = questions[questionId - 1];
        setQuestion(currentQuestion);
        setUserAnswer(storedUserAnswers[questionId - 1] ? storedUserAnswers[questionId - 1].answer : '');
      }
    }, [user, questions, questionId]);

    const handleAnswerSubmit = () => {
      const isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();
      let updatedProgress = { ...userProgress };
      let updatedUserAnswers = { ...userAnswers };

      const previousAnswerWasCorrect =
        userAnswers[questionId - 1] !== undefined &&
        userAnswers[questionId - 1].answer.toLowerCase() === question.answer.toLowerCase();
      const previousAnswerExists = userAnswers[questionId - 1] !== undefined;

      if (isCorrect) {
        if (!previousAnswerExists) {
          updatedProgress.correct += 1;
        } else if (!previousAnswerWasCorrect) {
          updatedProgress.correct += 1;
          updatedProgress.wrong = Math.max(0, updatedProgress.wrong - 1);
        }
      } else {
        if (!previousAnswerExists) {
          updatedProgress.wrong += 1;
        } else if (previousAnswerWasCorrect) {
          updatedProgress.wrong += 1;
          updatedProgress.correct = Math.max(0, updatedProgress.correct - 1);
        }
      }

      updatedUserAnswers[questionId - 1] = { answer: userAnswer, isCorrect: isCorrect };
      setUserAnswers(updatedUserAnswers);
      localStorage.setItem(`${user.username}_answers`, JSON.stringify(updatedUserAnswers));

      localStorage.setItem(user.username, JSON.stringify(updatedProgress));
      setUserProgress(updatedProgress);
      setUserAnswer('');
    };

    if (!user) {
      return null;
    }

    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {question && (
          <div>
            <h3>Soru {questionId}</h3>
            <p>{question.question}</p>
            <div>
              <input type="text" placeholder="Cevabınız" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
              <button onClick={handleAnswerSubmit}>Cevabı Gönder</button>
            </div>
            <p>Doğru Cevap: {userProgress.correct}</p>
            <p>Yanlış Cevap: {userProgress.wrong}</p>
          </div>
        )}
      </div>
    );
  }

  export default QuestionPage;
