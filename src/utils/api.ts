import { User } from "@prisma/client";
import blacklist from "blacklist";

export function getUserDataFields(user: User) {
  return blacklist(user, "id", "password");
}
