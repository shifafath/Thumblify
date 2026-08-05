import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('MongoDB connected')
    )
    console.log("MONGODB_URI =", process.env.MONGODB_URI);
    console.log("URI:", process.env.MONGODB_URI);

await mongoose.connect(process.env.MONGODB_URI as string);

console.log("Connected successfully");

 } catch (error) {
    console.error('Error connecting to MongoDB:', error)
}

}

export default connectDB;