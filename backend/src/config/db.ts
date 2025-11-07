import mongoose from 'mongoose';

export const connectDB = async (uri?: string) => {
  const mongoUri = uri || process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('No se encontró la URI de MongoDB en las variables de entorno (MONGO_URI o MONGODB_URI).');
  }
  await mongoose.connect(mongoUri);
  console.log('MongoDB conectado');
};
