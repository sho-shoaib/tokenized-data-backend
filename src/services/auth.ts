import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { env } from "../config/env.js";
import { createError } from "../middleware/error.js";
import type { Persona } from "../models/User.js";

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  persona: Persona;
  wallet?: string;
}) {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw createError("Email already in use", 409);

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    persona: data.persona,
    wallet: data.wallet ?? null,
  });

  return { user: sanitize(user), token: issueToken(user) };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw createError("Invalid credentials", 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw createError("Invalid credentials", 401);

  return { user: sanitize(user), token: issueToken(user) };
}

export async function me(userId: string) {
  const user = await User.findByPk(userId);
  if (!user) throw createError("User not found", 404);
  return sanitize(user);
}

function issueToken(user: User): string {
  return jwt.sign(
    { userId: user.id, persona: user.persona, wallet: user.wallet },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

function sanitize(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    persona: user.persona,
    wallet: user.wallet,
    createdAt: user.createdAt,
  };
}
