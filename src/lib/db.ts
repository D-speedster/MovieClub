import "server-only";
import mongoose from "mongoose";
const state = globalThis as typeof globalThis & { movieclubDB?: Promise<typeof mongoose> };
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required");
  if (!state.movieclubDB) {
    state.movieclubDB = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, autoIndex: false })
      .catch(error => { state.movieclubDB = undefined; throw error; });
  }
  return state.movieclubDB;
}
