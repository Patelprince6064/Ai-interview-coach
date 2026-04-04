import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['behavioral', 'technical', 'situational'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  answerText: { type: String, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  feedback: { type: String, required: true },
  duration: { type: Number, default: 0 }, // seconds spent on this question
});

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleId: { type: String, required: true },
    roleTitle: { type: String, required: true },
    answers: [answerSchema],
    overallScore: { type: Number, min: 0, max: 100 },
    totalDuration: { type: Number, default: 0 }, // seconds
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
  },
  { timestamps: true }
);

// Auto-calculate overall score before save
sessionSchema.pre('save', function (next) {
  if (this.answers && this.answers.length > 0) {
    this.overallScore = Math.round(
      this.answers.reduce((sum, a) => sum + a.score, 0) / this.answers.length
    );
  }
  next();
});

export default mongoose.model('Session', sessionSchema);
