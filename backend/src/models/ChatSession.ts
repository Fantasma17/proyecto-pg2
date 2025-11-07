import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
  senderId?: mongoose.Types.ObjectId;
  senderType: 'patient' | 'psychologist' | 'ai';
  content: string;
  timestamp: Date;
  isRead: boolean;
  emotionDetected?: {
    emotion: string;
    confidence: number;
    timestamp: Date;
  };
}

export interface IChatSession extends Document {
  patientId: mongoose.Types.ObjectId;
  psychologistId?: mongoose.Types.ObjectId;
  sessionType: 'ai_chatbot' | 'psychologist_chat';
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'interrupted';
  messages: IMessage[];
  summary?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  senderType: {
    type: String,
    enum: ['patient', 'psychologist', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  emotionDetected: {
    emotion: String,
    confidence: Number,
    timestamp: Date
  }
});

const ChatSessionSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    psychologistId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    sessionType: {
      type: String,
      enum: ['ai_chatbot', 'psychologist_chat'],
      required: true
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'interrupted'],
      default: 'active'
    },
    messages: [MessageSchema],
    summary: {
      type: String
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);