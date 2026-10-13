const isProduction = process.env.NODE_ENV === 'production';
const envSecret = process.env.JWT_SECRET?.trim();

// In production, require a non-empty, genuine secret (do not allow missing or dev fallback secrets)
if (isProduction) {
  if (
    !envSecret ||
    envSecret === 'dev_insecure_jwt_secret_for_local_testing_only' ||
    envSecret === 'your_jwt_secret_key_here' ||
    envSecret === 'YOUR_JWT_SECRET_KEY_HERE'
  ) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is missing, empty, or using an insecure placeholder in production. You must set a strong, unique JWT_SECRET in production.'
    );
  }
}

// Development/testing fallback secret - ONLY used when NOT in production
export const JWT_SECRET: string =
  envSecret || 'dev_insecure_jwt_secret_for_local_testing_only';
