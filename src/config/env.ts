import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  PORT: parseInt(process.env["PORT"] ?? "3000", 10),
  DB_HOST: requireEnv("DB_HOST"),
  DB_PORT: parseInt(process.env["DB_PORT"] ?? "3306", 10),
  DB_NAME: requireEnv("DB_NAME"),
  DB_USER: requireEnv("DB_USER"),
  DB_PASS: requireEnv("DB_PASS"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"] ?? "7d",
  UPLOAD_DIR: process.env["UPLOAD_DIR"] ?? "uploads",
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
};
