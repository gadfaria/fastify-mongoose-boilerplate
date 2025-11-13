import mongoose, { model, Schema, type Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true });

export type UserModelType = Model<IUser>;

export const UserModel: UserModelType =
  (mongoose.models.User as UserModelType | undefined) || model<IUser>('User', userSchema);
