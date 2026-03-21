import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

function parsePort(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  PORT: parsePort(process.env.PORT, 3000),
  FRONTEND_URL: requireEnv("FRONTEND_URL"),
};
