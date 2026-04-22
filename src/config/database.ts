import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    console.error(`❌ Error MongoDB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
