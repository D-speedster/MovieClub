import "server-only";
import mongoose, { Schema } from "mongoose";
const textArray = { type: [String], default: [] };
const contentSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ["movie", "series"], required: true, index: true },
  year: Number, description: String, poster: { type: String, required: true },
  genres: textArray, actors: textArray, directors: textArray, writers: textArray,
  countries: textArray, languages: textArray, gallery: textArray,
  imdb: { rating: { type: Number, min: 0, max: 10, default: 0 }, votes: { type: Number, default: 0 } },
  movie: { duration: Number },
  series: { seasonsCount: Number, episodesCount: Number, isWeekly: Boolean, status: { type: String, enum: ["ongoing", "ended", "canceled"] } },
}, { timestamps: true });
contentSchema.index({ type: 1, createdAt: -1 });
const userSchema = new Schema({
  name: { type: String, required: true }, username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, password: { type: String, required: true, select: false },
  phone: String, role: { type: String, enum: ["User", "Admin", "Owner"], default: "User" },
}, { timestamps: true });
const commentSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: "Content", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  username: String, text: { type: String, minlength: 3, maxlength: 1000, required: true },
  rating: { type: Number, min: 1, max: 10, default: null },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  likes: { type: Number, default: 0 },
}, { timestamps: true });
const downloadSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: "Content", required: true, index: true },
  quality: String, size: String, url: String, encoder: String, subtitle: Boolean, subtitleUrl: String,
  dubbed: Boolean, label: String, season: Number, episode: Number,
}, { timestamps: true });
const settingSchema = new Schema({ key: { type: String, unique: true, required: true }, value: Schema.Types.Mixed, description: String }, { timestamps: true });
const trailerSchema = new Schema({ title: String, youtubeUrl: String, poster: String, contentId: { type: Schema.Types.ObjectId, ref: "Content" } }, { timestamps: true });
const sessionSchema = new Schema({ tokenHash: { type: String, unique: true }, userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, expiresAt: { type: Date, expires: 0 } });
export const Content = mongoose.models.Content || mongoose.model("Content", contentSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export const DownloadLink = mongoose.models.DownloadLink || mongoose.model("DownloadLink", downloadSchema);
export const SiteSettings = mongoose.models.SiteSettings || mongoose.model("SiteSettings", settingSchema);
export const Trailer = mongoose.models.Trailer || mongoose.model("Trailer", trailerSchema);
export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

const rateSchema = new Schema({key:{type:String,unique:true},count:{type:Number,default:0},expiresAt:{type:Date,expires:0}});
export const RateBucket=mongoose.models.RateBucket||mongoose.model('RateBucket',rateSchema);
const contactSchema=new Schema({name:String,email:String,message:String,read:{type:Boolean,default:false}},{timestamps:true});
export const ContactMessage=mongoose.models.ContactMessage||mongoose.model('ContactMessage',contactSchema);
