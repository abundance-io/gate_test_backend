import { User } from "@prisma/client";

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = Omit<User, "profile_picture" | "id" | "photos">;
export type UserData = Omit<User, "password" | "id">;

export type JwtToken = {
  token: string;
};

export type ImageId = {
  publicId: string;
};

export type ImageIds = {
  publicIds: string[];
};

export type Mail = {
  to: string;
  subject: string;
  body: string;
};

export type Message = {
  message: string;
};
