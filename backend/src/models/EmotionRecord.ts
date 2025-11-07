import mongoose, { Schema, Document } from 'mongoose';

export interface IEmotionRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  timestamp: Date;
  emotionType: 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'fear' | 'disgust' | 'surprise';
  intensity: number;
  confidence?: number;
  detectionMethod: 'text_analysis' | 'facial_recognition' | 'voice_analysis' | 'self_reported';
  context?: string;
  triggerEvent?: string;
  notes?: string;
  createdAt: Date;
}

const EmotionRecordSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    emotionType: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'anxious', 'neutral', 'fear', 'disgust', 'surprise'],
      required: true
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    detectionMethod: {
      type: String,
      enum: ['text_analysis', 'facial_recognition', 'voice_analysis', 'self_reported'],
      required: true
    },
    context: {
      type: String
    },
    triggerEvent: {
      type: String
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IEmotionRecord>('EmotionRecord', EmotionRecordSchema);