import { User } from "@prisma/client";

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = Omit<User, "profile_picture" | "id">;
export type UserData = Omit<User, "password" | "id">;
