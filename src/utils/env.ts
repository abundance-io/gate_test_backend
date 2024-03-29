export function checkEnvs() {
  let envList = [
    "DATABASE_URL",
    "SECRET_KEY",
    "CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "POSTMARK_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  for (let envVariable of envList) {
    if (!process.env[envVariable]) {
      throw new Error("Missing env variable: " + envVariable);
    }
  }
}
