Project Title: Interview Nest – AI-Powered Interview Preparation App
Overview

Interview Nest is a smart web application that helps users prepare for interviews or practice mock interviews in real time using Google Gemini AI.
It allows users to either:

Ask any interview-related question and instantly get AI-generated, professional answers.

Select a topic (e.g., Data Science, Full Stack, HR, etc.) and enter a mock interview mode, where the app behaves like a real interviewer — asking around 20 questions one by one and evaluating user responses interactively.

This project aims to create an engaging, conversational, and adaptive learning environment using modern AI.

 Features
 1. Two Main Modes

Prep Mode – Users can ask any question (like “Explain normalization in SQL”) and receive a detailed, AI-generated answer.

Interview Mode – Gemini AI acts as an interviewer, asking sequential, context-aware questions based on the selected topic and user’s answers.

 2. Conversational Flow

Each question appears line-by-line like a real human interviewer.

The system waits for user input before proceeding to the next question.

After 20 questions, the interview automatically ends with feedback.

 3. Resume-based Personalization

In interview mode, users can paste their resume text.

Gemini uses this context to generate custom, profile-relevant questions.

 4. Clean & Interactive UI

Modern React interface with smooth transitions.

Background image and footer GIF for professional, engaging appearance.

Real-time “Thinking…” state while Gemini processes the next question.

 5. Back Navigation

Easy to switch between “Prep Mode” and “Interview Mode” with a Back button.

 Technologies Used
Frontend

 React.js (Vite) – For fast, component-based UI rendering and state management.

 CSS3 (Custom Styling) – Handles layout, background image, and footer animations.

 Vite – Modern build tool that provides fast refresh and efficient bundling.

Backend / AI

 Google Gemini API (via REST fetch call)
Used for generating:

Interview questions

Explanations and answers

Real-time conversation flow

Contextual question progression based on user input

Model Used: gemini-2.0-flash
Endpoint:

https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

Deployment

 Netlify – For easy CI/CD deployment directly from GitHub repository.

GitHub – For version control and hosting the source code repository.
 How It Works

User selects a mode:

Prep Mode: Enters a question manually.

Interview Mode: Chooses a topic (e.g., Data Analyst) and optionally pastes a resume.

Gemini API Call:

The frontend sends the user’s query or resume to the Gemini model using a fetch() POST request with the API key.

Gemini Generates Output:

The model returns structured text — either an explanation or a question depending on the mode.

Dynamic Rendering:

The app updates the UI with a typing-like animation using React state updates (setCurrentQuestion with intervals).

User Responds:

User types the answer (max 500 words) and submits.

Gemini then generates the next question based on the user’s previous answer.

After 20 Questions:

The interview session ends with a success message.

 Key React Concepts Used
Concept	Purpose
useState()	Managing dynamic data such as mode, question, response, and input.
useEffect()	Focusing text areas automatically when switching modes.
useRef()	Referencing input fields for focus control.
useCallback()	Optimizing API fetch logic for performance.
Conditional Rendering	Dynamically showing/hiding sections based on mode (PREP / INTERVIEW).
 UI Enhancements

Background Image: Creates a professional and focused look for the workspace.

Footer GIF: Adds a touch of creativity and motion at the bottom-right corner.

Smooth Animations: Questions appear line-by-line for a realistic “conversation” effect.

Buttons Grid: Simple and intuitive topic selection layout.

 Deployment Steps (Quick Recap)

Push your project to GitHub repository.

Login to Netlify → click “Add new site → Import from GitHub”.

Select your repository and click Deploy.

In vite.config.js, make sure:

base: './',


After deploy, open your live URL like:
https://interviewnest.netlify.app/
