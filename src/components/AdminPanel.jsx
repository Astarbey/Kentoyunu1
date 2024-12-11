import React, { useState, useEffect } from 'react';
  import UserProgressPanel from './UserProgressPanel';
  import { QRCodeCanvas } from 'qrcode.react';
  import { Link } from 'react-router-dom';

  function AdminPanel({ onLogout, setFeedbackMessage, showFeedbackMessage }) {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswer, setEditAnswer] = useState('');
    const [showUserProgress, setShowUserProgress] = useState(false);
    const [qrCodeIndex, setQRCodeIndex] = useState(null);

    useEffect(() => {
      const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
      setQuestions(storedQuestions);
    }, []);

    const handleAddQuestion = () => {
      setQuestions([...questions, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
    };

    const handleEditQuestion = (index) => {
      setEditIndex(index);
      setEditQuestion(questions[index].question);
      setEditAnswer(questions[index].answer);
    };

    const handleUpdateQuestion = () => {
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = { question: editQuestion, answer: editAnswer };
      setQuestions(updatedQuestions);
      setEditIndex(-1);
      setEditQuestion('');
      setEditAnswer('');
    };

    const handleDeleteQuestion = (index) => {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    };

    const handleSaveQuestions = () => {
      localStorage.setItem('questions', JSON.stringify(questions));
      showFeedbackMessage('Sorular kaydedildi!');
    };

    const toggleUserProgress = () => {
      setShowUserProgress(!showUserProgress);
    };

    const handleShowQRCode = (index) => {
      setQRCodeIndex(index);
    };

    const handleCloseQRCode = () => {
      setQRCodeIndex(null);
    };

    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        {!showUserProgress ? (
          <div>
            <h2>Yönetici Paneli</h2>
            <div>
              <h3>Yeni Soru Ekle</h3>
              <input type="text" placeholder="Soru" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
              <input type="text" placeholder="Cevap" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
              <button onClick={handleAddQuestion}>Soru Ekle</button>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '20px' }}>
              <h3>Soruları Düzenle</h3>
              {questions.map((q, index) => (
                <div key={index} style={{ borderBottom: '1px solid #8b4513', paddingBottom: '10px', marginBottom: '10px' }}>
                  {editIndex === index ? (
                    <div>
                      <input type="text" value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
                      <input type="text" value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} />
                      <button onClick={handleUpdateQuestion}>Güncelle</button>
                    </div>
                  ) : (
                    <div>
                      <p>
                        Soru: {q.question} - <Link to={`/question/${index + 1}`}>Soruya Git</Link>
                      </p>
                      <p>Cevap: {q.answer}</p>
                      <button onClick={() => handleEditQuestion(index)}>Düzenle</button>
                      <button onClick={() => handleDeleteQuestion(index)}>Sil</button>
                      <button onClick={() => handleShowQRCode(index)}>QR Kod Oluştur</button>
                      {qrCodeIndex === index && (
                        <div>
                          <QRCodeCanvas value={`${window.location.origin}/question/${index + 1}`} size={256} />
                          <br />
                          <button onClick={handleCloseQRCode}>Kapat</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSaveQuestions}>Soruları Kaydet</button>
            <button onClick={toggleUserProgress}>Kullanıcı İlerlemesi</button>
            <button onClick={onLogout}>Çıkış Yap</button>
          </div>
        ) : (
          <UserProgressPanel onClose={() => setShowUserProgress(false)} />
        )}
      </div>
    );
  }

  export default AdminPanel;
