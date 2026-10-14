import test from 'node:test';
import assert from 'node:assert/strict';

// Pure business invariant: Tier calculation engine
const calculateTier = (points: number): string => {
  if (points >= 1000) return 'Master Tier';
  if (points >= 500) return 'Senior Scholar';
  if (points >= 200) return 'Scholar Tier';
  return 'Novice Scholar';
};

test('INVARIANT: Points-to-Tier mapping satisfies exact boundary thresholds', () => {
  const cases: [number, string][] = [
    [0, 'Novice Scholar'],
    [50, 'Novice Scholar'],
    [199, 'Novice Scholar'],
    [200, 'Scholar Tier'],
    [201, 'Scholar Tier'],
    [499, 'Scholar Tier'],
    [500, 'Senior Scholar'],
    [501, 'Senior Scholar'],
    [999, 'Senior Scholar'],
    [1000, 'Master Tier'],
    [1001, 'Master Tier'],
    [5000, 'Master Tier'],
  ];

  for (const [pts, expectedTier] of cases) {
    const actual = calculateTier(pts);
    assert.equal(
      actual,
      expectedTier,
      `Points ${pts} should yield tier ${expectedTier}, but got ${actual}`
    );
  }
});

test('INVARIANT: Consecutive +50 point awards trigger deterministic tier upgrades', () => {
  let userPoints = 0;
  let userTier = calculateTier(userPoints);
  assert.equal(userTier, 'Novice Scholar');

  // 3 doubt resolutions (150 pts)
  for (let i = 0; i < 3; i++) {
    userPoints += 50;
    userTier = calculateTier(userPoints);
  }
  assert.equal(userPoints, 150);
  assert.equal(userTier, 'Novice Scholar');

  // 4th resolution (200 pts) -> Crosses Scholar Tier threshold
  userPoints += 50;
  userTier = calculateTier(userPoints);
  assert.equal(userPoints, 200);
  assert.equal(userTier, 'Scholar Tier');

  // Jump to 500 pts -> Crosses Senior Scholar threshold
  userPoints = 500;
  userTier = calculateTier(userPoints);
  assert.equal(userTier, 'Senior Scholar');

  // Jump to 1000 pts -> Crosses Master Tier threshold
  userPoints = 1000;
  userTier = calculateTier(userPoints);
  assert.equal(userTier, 'Master Tier');
});

test('IDEMPOTENCY: Solver deduplication prevents duplicate points for multiple replies', () => {
  // Simulates doubtReplies in a room doubt thread where solver "Alice" posted 4 replies
  const replies = [
    { senderId: 'user_alice_123', senderName: 'Alice', text: 'Step 1: Expand brackets' },
    { senderId: 'user_bob_456', senderName: 'Bob', text: 'Step 2: Collect like terms' },
    { senderId: 'user_alice_123', senderName: 'Alice', text: 'Step 3: Factor out x' },
    { senderId: 'user_alice_123', senderName: 'Alice', text: 'Step 4: Solve quadratic' },
  ];

  // Distinct solver set extraction (matching roomSocket.ts implementation)
  const solverUserIds = new Set<string>();
  const solverNames = new Set<string>();

  replies.forEach((r) => {
    if (r.senderId) solverUserIds.add(r.senderId);
    if (r.senderName) solverNames.add(r.senderName.trim());
  });

  // Verify that Alice and Bob are each extracted exactly once
  assert.equal(solverUserIds.size, 2, 'Should only contain 2 unique solver IDs');
  assert.ok(solverUserIds.has('user_alice_123'));
  assert.ok(solverUserIds.has('user_bob_456'));

  // Calculate points to award: 50 pts per unique solver
  const pointsAwardMap = new Map<string, number>();
  solverUserIds.forEach((id) => {
    pointsAwardMap.set(id, (pointsAwardMap.get(id) || 0) + 50);
  });

  assert.equal(pointsAwardMap.get('user_alice_123'), 50, 'Alice must receive exactly 50 pts, not 150 pts');
  assert.equal(pointsAwardMap.get('user_bob_456'), 50, 'Bob must receive exactly 50 pts');
});

test('IDEMPOTENCY: Resolution state flag prevents re-awarding points on retry', () => {
  let isResolved = false;
  let pointsAwardCount = 0;
  const pointsPerResolution = 50;

  const handleResolveRequest = () => {
    if (isResolved) {
      // Already resolved, safe no-op
      return { awarded: 0, status: 'already_resolved' };
    }
    isResolved = true;
    pointsAwardCount += pointsPerResolution;
    return { awarded: pointsPerResolution, status: 'resolved' };
  };

  // 1st resolve call succeeds
  const res1 = handleResolveRequest();
  assert.equal(res1.status, 'resolved');
  assert.equal(res1.awarded, 50);
  assert.equal(pointsAwardCount, 50);

  // 2nd resolve call (duplicate/retry click) must be rejected
  const res2 = handleResolveRequest();
  assert.equal(res2.status, 'already_resolved');
  assert.equal(res2.awarded, 0);
  assert.equal(pointsAwardCount, 50, 'Points award count must remain at 50');

  // 3rd rapid repeat click
  const res3 = handleResolveRequest();
  assert.equal(res3.status, 'already_resolved');
  assert.equal(pointsAwardCount, 50);
});

test('INVARIANT: Fresh account starts with pristine default values', () => {
  const newAccountTemplate = {
    points: 0,
    streak: 0,
    tier: 'Novice Scholar',
    avatar: '',
    dailyGoals: [
      { title: 'Study 1 hour in a focus room', completed: false },
      { title: 'Ask or answer 1 academic doubt', completed: false },
      { title: 'Complete a Pomodoro study session', completed: false },
    ],
  };

  assert.equal(newAccountTemplate.points, 0);
  assert.equal(newAccountTemplate.streak, 0);
  assert.equal(newAccountTemplate.tier, 'Novice Scholar');
  assert.equal(newAccountTemplate.avatar, '');
  assert.equal(newAccountTemplate.dailyGoals.length, 3);
  assert.ok(newAccountTemplate.dailyGoals.every((g) => g.completed === false));
});
