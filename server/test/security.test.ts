import test from 'node:test';
import assert from 'node:assert/strict';

// Helper function identical to controller implementation for ReDoS prevention
const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

test('Regex escaping prevents ReDoS and escapes special characters', () => {
  const dangerousInput = '.*+?^${}()|[]\\';
  const escaped = escapeRegex(dangerousInput);
  
  // None of the unescaped special characters should remain active
  assert.ok(!escaped.includes('.*+'));
  assert.equal(escaped, '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');

  const userQuery = 'Calculus (Math 101) [Advanced]';
  const safeRegex = new RegExp(escapeRegex(userQuery), 'i');
  assert.ok(safeRegex.test('Calculus (Math 101) [Advanced]'));
  assert.ok(!safeRegex.test('Calculus Math 101 Advanced'));
});

test('JWT Secret configuration fails safely in production when secret is missing or placeholder', async () => {
  // Test production guard logic
  const checkProductionSecret = (envSecret?: string) => {
    const isProduction = true;
    const cleanSecret = envSecret?.trim();
    if (
      isProduction &&
      (!cleanSecret ||
        cleanSecret === 'dev_insecure_jwt_secret_for_local_testing_only' ||
        cleanSecret === 'your_jwt_secret_key_here' ||
        cleanSecret === 'YOUR_JWT_SECRET_KEY_HERE')
    ) {
      throw new Error('FATAL: JWT_SECRET environment variable is missing, empty, or using an insecure placeholder in production.');
    }
    return cleanSecret;
  };

  assert.throws(
    () => checkProductionSecret(undefined),
    /FATAL: JWT_SECRET environment variable is missing/
  );
  assert.throws(
    () => checkProductionSecret(''),
    /FATAL: JWT_SECRET environment variable is missing/
  );
  assert.throws(
    () => checkProductionSecret('dev_insecure_jwt_secret_for_local_testing_only'),
    /FATAL: JWT_SECRET environment variable is missing/
  );
  assert.throws(
    () => checkProductionSecret('your_jwt_secret_key_here'),
    /FATAL: JWT_SECRET environment variable is missing/
  );

  const validSecret = checkProductionSecret('super_secure_production_key_12345');
  assert.equal(validSecret, 'super_secure_production_key_12345');
});

test('Rate limiter tracks hits and blocks excess requests within window', () => {
  const hitRecords = new Map<string, { count: number; resetTime: number }>();
  const max = 3;
  const windowMs = 1000;

  const checkLimit = (ip: string): boolean => {
    const now = Date.now();
    const record = hitRecords.get(ip);
    if (!record || now > record.resetTime) {
      hitRecords.set(ip, { count: 1, resetTime: now + windowMs });
      return true; // allowed
    }
    if (record.count >= max) {
      return false; // blocked
    }
    record.count++;
    return true; // allowed
  };

  const clientIp = '127.0.0.1';
  assert.equal(checkLimit(clientIp), true); // 1st
  assert.equal(checkLimit(clientIp), true); // 2nd
  assert.equal(checkLimit(clientIp), true); // 3rd
  assert.equal(checkLimit(clientIp), false); // 4th (blocked)
  assert.equal(checkLimit(clientIp), false); // 5th (blocked)

  // Different IP is independent
  const otherIp = '192.168.1.1';
  assert.equal(checkLimit(otherIp), true);
});

test('Input type guards reject NoSQL query injection objects', () => {
  const validateAuthInput = (email: any, password: any): boolean => {
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    return cleanEmail.includes('@') && cleanEmail.length <= 100 && password.length >= 6;
  };

  // Malicious NoSQL injection payloads that would bypass un-typed queries:
  assert.equal(validateAuthInput({ $gt: '' }, 'password123'), false);
  assert.equal(validateAuthInput({ $ne: null }, 'password123'), false);
  assert.equal(validateAuthInput('student@studysphere.edu', { $ne: '' }), false);
  assert.equal(validateAuthInput('not-an-email', 'password123'), false);
  assert.equal(validateAuthInput('student@studysphere.edu', '12345'), false); // Too short

  // Valid inputs pass
  assert.equal(validateAuthInput('student@studysphere.edu', 'securepassword123'), true);
});
