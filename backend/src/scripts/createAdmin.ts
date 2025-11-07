import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';

dotenv.config();

async function main() {
  // Aceptar cualquiera de las dos variables (por compatibilidad)
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL || 'admin@local';
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!mongoUri) {
    console.error('MONGO_URI no está definido en las variables de entorno.');
    process.exit(1);
  }

  if (!password) {
    console.error('ADMIN_PASSWORD no está definido en las variables de entorno.');
    process.exit(1);
  }

  // Conectar usando la URI detectada
  await mongoose.connect(mongoUri as string);

  try {
    // Verificar si ya existe admin por role o por email
    const existingByRole = await User.findOne({ role: 'admin' });
    const existingByEmail = await User.findOne({ email });

    if (existingByRole || existingByEmail) {
      console.log('Ya existe un administrador (por role o email). No se crea ninguno nuevo.');
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: 'admin'
    });

    const adminSafe = admin.toObject();
    delete (adminSafe as any).password;

    console.log('Administrador creado correctamente:', adminSafe);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creando administrador:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
