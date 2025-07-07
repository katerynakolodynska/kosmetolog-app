import mongoose from "mongoose";

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connection successfully");
  } catch (error) {
    console.error("Error connecting to MongoDb: ", error.message);
    throw error;
  }
};
