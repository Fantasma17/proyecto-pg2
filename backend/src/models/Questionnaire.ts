import mongoose, { Schema, Document } from 'mongoose';

interface IResponse {
  questionId: string;
  question: string;
  answer: any;
  answeredAt: Date;
}

interface IScore {
  total: number;
  interpretation?: string;
  severity?: 'minimal' | 'mild' | 'moderate' | 'severe';
}

export interface IQuestionnaire extends Document {
  patientId: mongoose.Types.ObjectId;
  questionnaireType: 'initial_assessment' | 'phq9' | 'gad7' | 'custom';
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  responses: IResponse[];
  score?: IScore;
  assignedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questionnaireType: {
      type: String,
      enum: ['initial_assessment', 'phq9', 'gad7', 'custom'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    responses: [{
      questionId: String,
      question: String,
      answer: Schema.Types.Mixed,
      answeredAt: Date
    }],
    score: {
      total: Number,
      interpretation: String,
      severity: {
        type: String,
        enum: ['minimal', 'mild', 'moderate', 'severe']
      }
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IQuestionnaire>('Questionnaire', QuestionnaireSchema);