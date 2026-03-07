import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MongoDB connection error: MONGODB_URI is not set (check .env at project root)");
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    // TLS/SSL: avoid "tlsv1 alert internal error" with Atlas and some Node/OpenSSL versions
    tls: true,
    ...(process.env.MONGODB_TLS_ALLOW_INVALID === "true" && {
      tlsAllowInvalidCertificates: true,
    }),
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
