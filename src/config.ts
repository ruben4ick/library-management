function getEnvironmentVariable(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

const CONFIG = {
  jwtSecret: getEnvironmentVariable("JWT_SECRET"),
  jwtExpiresIn: getEnvironmentVariable("JWT_EXPIRES_IN", "15m"),
  refreshTokenExpiresIn: getEnvironmentVariable(
    "REFRESH_TOKEN_EXPIRES_IN",
    "7d",
  ),
  port: Number.parseInt(getEnvironmentVariable("PORT", "8080"), 10),
  smtpHost: getEnvironmentVariable("SMTP_HOST", ""),
  smtpPort: Number.parseInt(getEnvironmentVariable("SMTP_PORT", "587"), 10),
  smtpAuthUser: getEnvironmentVariable("SMTP_AUTH_USER", ""),
  smtpAuthPass: getEnvironmentVariable("SMTP_AUTH_PASS", ""),
  senderEmail: getEnvironmentVariable("SENDER_EMAIL", "noreply@library.com"),
  clientUrl: getEnvironmentVariable("CLIENT_URL", "http://localhost:3000"),
};

export default CONFIG;
