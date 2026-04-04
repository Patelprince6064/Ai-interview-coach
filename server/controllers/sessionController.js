import Session from '../models/Session.js';
import User from '../models/User.js';

// @desc  Create a new session
// @route POST /api/sessions
export const createSession = async (req, res, next) => {
  try {
    const { roleId, roleTitle } = req.body;
    const session = await Session.create({ user: req.user._id, roleId, roleTitle });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc  Submit an answer to a session
// @route POST /api/sessions/:id/answers
export const submitAnswer = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const { questionText, questionType, difficulty, answerText, duration } = req.body;

    // AI scoring with Claude
    const { score, feedback } = await scoreWithClaude(answerText, questionText, questionType, difficulty);

    session.answers.push({ questionText, questionType, difficulty, answerText, score, feedback, duration });
    await session.save();

    res.json({ success: true, data: { score, feedback }, session });
  } catch (error) {
    next(error);
  }
};

// @desc  Complete a session
// @route PUT /api/sessions/:id/complete
export const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.status = 'completed';
    session.completedAt = new Date();
    session.totalDuration = req.body.totalDuration || 0;
    await session.save();

    // Update user stats
    const allSessions = await Session.find({ user: req.user._id, status: 'completed' });
    const totalSessions = allSessions.length;
    const averageScore = Math.round(allSessions.reduce((s, x) => s + (x.overallScore || 0), 0) / totalSessions);
    await User.findByIdAndUpdate(req.user._id, { totalSessions, averageScore });

    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all sessions for current user
// @route GET /api/sessions
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(20)
      .select('-answers');
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single session
// @route GET /api/sessions/:id
export const getSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc  Get analytics for current user
// @route GET /api/sessions/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id, status: 'completed' });

    if (!sessions.length) return res.json({ success: true, data: null });

    const scoreHistory = sessions
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
      .slice(-10)
      .map((s) => ({ date: s.completedAt, score: s.overallScore, role: s.roleTitle }));

    const allAnswers = sessions.flatMap((s) => s.answers);
    const byType = {};
    allAnswers.forEach((a) => {
      if (!byType[a.questionType]) byType[a.questionType] = [];
      byType[a.questionType].push(a.score);
    });
    const skillBreakdown = Object.entries(byType).map(([type, scores]) => ({
      type,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    const byRole = {};
    sessions.forEach((s) => {
      if (!byRole[s.roleTitle]) byRole[s.roleTitle] = [];
      byRole[s.roleTitle].push(s.overallScore);
    });
    const roleBreakdown = Object.entries(byRole).map(([role, scores]) => ({
      role,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));

    res.json({ success: true, data: { scoreHistory, skillBreakdown, roleBreakdown, totalSessions: sessions.length } });
  } catch (error) {
    next(error);
  }
};

// ─── Claude AI Scoring ──────────────────────────────────────────────────────

async function scoreWithClaude(answerText, questionText, questionType, difficulty) {
  // Fallback values in case the API call fails
  const fallback = { score: scoreFallback(answerText, difficulty), feedback: feedbackFallback(answerText, questionType) };

  if (!process.env.ANTHROPIC_API_KEY) return fallback;

  const difficultyNote = difficulty === 'hard' ? 'This is a hard question — apply stricter scoring.' :
    difficulty === 'easy' ? 'This is an easy question — expect clear, structured answers.' :
    'This is a medium-difficulty question.';

  const prompt = `You are an expert interview coach evaluating a candidate's answer.

Question: "${questionText}"
Question Type: ${questionType}
Difficulty: ${difficulty}
${difficultyNote}

Candidate's Answer:
"""
${answerText}
"""

Evaluate this answer and respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{
  "score": <integer from 0 to 100>,
  "feedback": "<2-4 sentences of specific, actionable feedback>"
}

Scoring rubric:
- 85-100: Excellent — clear STAR structure, specific examples, quantified impact, confident delivery
- 70-84: Good — mostly structured, relevant examples, minor gaps in specifics or results
- 55-69: Needs work — answer is relevant but lacks structure, specifics, or measurable outcomes
- 0-54: Poor — vague, off-topic, very short, or missing key elements entirely

For behavioral questions, check for STAR method (Situation, Task, Action, Result).
For technical questions, check for accuracy, depth, and clarity of explanation.
For situational questions, check for problem-solving approach and reasoning.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const raw = data.content?.[0]?.text?.trim();
    if (!raw) return fallback;

    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    const score = Math.min(100, Math.max(0, Math.round(Number(parsed.score))));
    const feedback = typeof parsed.feedback === 'string' && parsed.feedback.length > 0
      ? parsed.feedback
      : fallback.feedback;

    return { score, feedback };
  } catch {
    return fallback;
  }
}

// ─── Fallback (used when ANTHROPIC_API_KEY is not set) ───────────────────────

function scoreFallback(text, difficulty) {
  let base = 55 + Math.random() * 12;
  const words = text.trim().split(/\s+/).length;
  if (words > 120) base += 10;
  else if (words > 70) base += 5;
  const starWords = ['situation','task','action','result','outcome','achieved','implemented','led','solved','increased','reduced','improved','delivered','managed'];
  base += starWords.filter((w) => text.toLowerCase().includes(w)).length * 2.5;
  if (difficulty === 'hard') base -= 6;
  if (difficulty === 'easy') base += 6;
  return Math.min(100, Math.max(28, Math.round(base)));
}

function feedbackFallback(text, type) {
  const score = scoreFallback(text, 'medium');
  const parts = [];
  if (score >= 82) parts.push('Strong answer with clear structure and compelling specifics.');
  else if (score >= 68) parts.push('Good answer. A few targeted refinements would make it stand out.');
  else parts.push('Your answer shows potential but needs deeper structure and concrete examples.');
  const words = text.trim().split(/\s+/).length;
  if (words < 60) parts.push('Try to expand further — aim for 100–150 words to fully develop your response.');
  if (!text.toLowerCase().includes('result') && !text.toLowerCase().includes('outcome'))
    parts.push('Always close with the quantifiable result or outcome to complete the STAR framework.');
  if (type === 'behavioral' && score < 75)
    parts.push("Use 'I' statements to clarify your personal contribution versus the team's work.");
  if (score < 70)
    parts.push('Add a specific metric or number to make your impact concrete and memorable.');
  return parts.join(' ');
}


// @desc  Create a new session
// @route POST /api/sessions
export const createSession = async (req, res, next) => {
  try {
    const { roleId, roleTitle } = req.body;
    const session = await Session.create({ user: req.user._id, roleId, roleTitle });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc  Submit an answer to a session
// @route POST /api/sessions/:id/answers
export const submitAnswer = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const { questionText, questionType, difficulty, answerText, duration } = req.body;

    // AI scoring via Claude (falls back to heuristic if API key missing)
    const { score, feedback } = await scoreWithClaude(answerText, questionText, questionType, difficulty);

    session.answers.push({ questionText, questionType, difficulty, answerText, score, feedback, duration });
    await session.save();

    res.json({ success: true, data: { score, feedback }, session });
  } catch (error) {
    next(error);
  }
};

// @desc  Complete a session
// @route PUT /api/sessions/:id/complete
export const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.status = 'completed';
    session.completedAt = new Date();
    session.totalDuration = req.body.totalDuration || 0;
    await session.save();

    // Update user stats
    const allSessions = await Session.find({ user: req.user._id, status: 'completed' });
    const totalSessions = allSessions.length;
    const averageScore = Math.round(allSessions.reduce((s, x) => s + (x.overallScore || 0), 0) / totalSessions);
    await User.findByIdAndUpdate(req.user._id, { totalSessions, averageScore });

    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all sessions for current user
// @route GET /api/sessions
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(20)
      .select('-answers');
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single session
// @route GET /api/sessions/:id
export const getSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

// @desc  Get analytics for current user
// @route GET /api/sessions/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const sessions = await Session.find({ user: req.user._id, status: 'completed' });

    if (!sessions.length) return res.json({ success: true, data: null });

    const scoreHistory = sessions
      .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
      .slice(-10)
      .map((s) => ({ date: s.completedAt, score: s.overallScore, role: s.roleTitle }));

    const allAnswers = sessions.flatMap((s) => s.answers);
    const byType = {};
    allAnswers.forEach((a) => {
      if (!byType[a.questionType]) byType[a.questionType] = [];
      byType[a.questionType].push(a.score);
    });
    const skillBreakdown = Object.entries(byType).map(([type, scores]) => ({
      type,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));

    const byRole = {};
    sessions.forEach((s) => {
      if (!byRole[s.roleTitle]) byRole[s.roleTitle] = [];
      byRole[s.roleTitle].push(s.overallScore);
    });
    const roleBreakdown = Object.entries(byRole).map(([role, scores]) => ({
      role,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }));

    res.json({ success: true, data: { scoreHistory, skillBreakdown, roleBreakdown, totalSessions: sessions.length } });
  } catch (error) {
    next(error);
  }
};
