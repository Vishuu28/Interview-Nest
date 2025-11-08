import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

const apiKey = "AIzaSyBmEaOOF8aRG91P8MuXoM9IWMUKrODQAE4";
const MODEL_NAME = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

export default function App() {
  const [mode, setMode] = useState('PREP'); // PREP | TOPIC_SELECT | INTERVIEW
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [resumeText, setResumeText] = useState('');
  const [interviewTopic, setInterviewTopic] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userInput, setUserInput] = useState('');
  const [questionCount, setQuestionCount] = useState(0);

  const answerRef = useRef(null);

  useEffect(() => {
    if (mode === 'INTERVIEW' && answerRef.current) {
      answerRef.current.focus();
    }
  }, [mode, currentQuestion]);

  // ✅ Stable input handler — keeps focus while typing
  const handleInputChange = (setter) => (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 500) {
      setter(e.target.value);
    }
  };

  const fetchWithRetry = useCallback(async (payload) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  }, []);

  // ---------------- PREP MODE ----------------
  const handlePrepAsk = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const payload = {
        contents: [{ parts: [{ text: question }] }],
        systemInstruction: {
          parts: [{ text: "You are an expert interview preparation coach. Respond clearly and professionally." }]
        }
      };
      const text = await fetchWithRetry(payload);
      setResponse(text);
    } catch (err) {
      setError("Error connecting to Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- INTERVIEW MODE ----------------
  const startInterview = (topic) => {
    setInterviewTopic(topic);
    setMode('INTERVIEW');
    setQuestionCount(0);
    getNextQuestion(topic, resumeText, '');
  };

  const getNextQuestion = async (topic, resume, lastAnswer) => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `
        You are an interviewer for ${topic}.
        ${resume ? `Candidate resume: ${resume}` : "No resume provided."}
        Ask the next question (out of 20 total).
        Last answer: ${lastAnswer}
      `;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const text = await fetchWithRetry(payload);
      setCurrentQuestion(text);
    } catch {
      setError("Error fetching question.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewResponse = async () => {
    if (!userInput.trim()) return;
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);
    const answer = userInput;
    setUserInput('');

    if (nextCount < 20) {
      await getNextQuestion(interviewTopic, resumeText, answer);
    } else {
      setCurrentQuestion("✅ Interview completed! Great job!");
    }
  };

  // ---------------- KEY HANDLING ----------------
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'PREP') handlePrepAsk();
      else if (mode === 'INTERVIEW') handleInterviewResponse();
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="app">
      <header className="header">
        <h1>Interview Nest</h1>
        <div className="mode-buttons">
          {mode !== 'PREP' && (
            <button onClick={() => setMode('PREP')}>Prep Mode</button>
          )}
          {mode === 'PREP' && (
            <button onClick={() => setMode('TOPIC_SELECT')}>Mock Interview</button>
          )}
          {mode === 'INTERVIEW' && (
            <button onClick={() => setMode('TOPIC_SELECT')}>⬅ Back</button>
          )}
        </div>
      </header>

      <main className="content">
        {mode === 'PREP' && (
          <>
            <textarea
              rows={6}
              value={question}
              onChange={handleInputChange(setQuestion)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here (max 500 words)"
            />
            <button onClick={handlePrepAsk} disabled={isLoading || !question.trim()}>
              {isLoading ? "Thinking..." : "Ask Query"}
            </button>
            {isLoading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
            {response && <div className="response">{response}</div>}
          </>
        )}

        {mode === 'TOPIC_SELECT' && (
          <>
            <h2>Select Interview Topic</h2>
            <textarea
              rows={6}
              value={resumeText}
              onChange={handleInputChange(setResumeText)}
              placeholder="Paste your resume here (max 500 words)"
            />
            <div className="buttons-grid">
              {['Frontend', 'Full Stack', 'Data Analyst', 'Data Scientist', 'HR'].map(topic => (
                <button key={topic} onClick={() => startInterview(topic)}>
                  {topic}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'INTERVIEW' && (
          <>
            <h2>{interviewTopic} Interview</h2>
            {isLoading && <p className="loading">Generating next question...</p>}
            {error && <p className="error">{error}</p>}
            {currentQuestion && <div className="response">{currentQuestion}</div>}

            {questionCount < 20 && (
              <>
                <textarea
                  ref={answerRef}
                  rows={6}
                  value={userInput}
                  onChange={handleInputChange(setUserInput)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here (max 500 words)"
                />
                <button onClick={handleInterviewResponse} disabled={isLoading || !userInput.trim()}>
                  Submit Answer
                </button>
              </>
            )}
          </>
        )}
      </main>

      <div className="ai-footer-gif">
        <p>✨ By Vaishnavi</p>
      </div>
    </div>
  );
}
