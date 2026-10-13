import test from 'node:test';
import assert from 'node:assert/strict';
import { io as Client } from '../../client/node_modules/socket.io-client/build/esm/index.js';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

test('Integration: GET /api/doubts returns array of doubts', async () => {
  const res = await fetch(`${API_BASE}/doubts`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data), 'Doubts should be an array');
  assert.ok(data.length > 0, 'Should have initial doubts');
});

test('Integration: POST /api/doubts/:id/answers marks resolved and adds answer to thread', async () => {
  // First get a doubt
  const listRes = await fetch(`${API_BASE}/doubts`);
  const doubts = await listRes.json();
  const targetDoubt = doubts[0];
  assert.ok(targetDoubt, 'Target doubt must exist');

  const doubtId = targetDoubt._id || targetDoubt.id;
  const answerContent = `Integration test solution: verify step 1 to step 4 at ${Date.now()}`;

  const res = await fetch(`${API_BASE}/doubts/${doubtId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: answerContent,
      authorName: 'Test Solver',
      authorAvatar: 'https://example.com/avatar.png',
    }),
  });

  assert.equal(res.status, 201);
  const updated = await res.json();
  assert.equal(updated.status, 'solved', 'Status must be marked solved');
  assert.equal(updated.isResolved, true, 'isResolved flag must be true');

  const allAnswers = updated.answers || [updated.newAnswer];
  const foundAnswer = allAnswers.find((a: any) => a.content === answerContent);
  assert.ok(foundAnswer, 'Submitted answer must exist in the answers thread');
});

test('Integration: WebSocket in-room doubt flow (raise, reply, resolve)', async () => {
  const roomId = 'test-room-math-101';
  const socketClient1 = Client(SOCKET_URL, { transports: ['websocket'] });
  const socketClient2 = Client(SOCKET_URL, { transports: ['websocket'] });

  await new Promise<void>((resolve) => {
    let connected = 0;
    const check = () => {
      connected++;
      if (connected === 2) resolve();
    };
    socketClient1.on('connect', check);
    socketClient2.on('connect', check);
  });

  socketClient1.emit('join_room', { roomId, userName: 'Peer 1' });
  socketClient2.emit('join_room', { roomId, userName: 'Peer 2' });

  // Wait 100ms for room join
  await new Promise((r) => setTimeout(r, 100));

  // 1. Peer 1 raises a live doubt
  const doubtTitle = `Live room question about integrals ${Date.now()}`;
  let raisedDoubtId = '';

  const doubtPromise = new Promise<void>((resolve) => {
    socketClient2.on('new_message', (msg: any) => {
      if (msg.type === 'doubt_alert' && msg.text === doubtTitle) {
        raisedDoubtId = msg._id;
        assert.equal(msg.senderName, 'Peer 1');
        assert.equal(msg.isResolved, false);
        resolve();
      }
    });
  });

  socketClient1.emit('raise_doubt_alert', { roomId, title: doubtTitle });
  await doubtPromise;
  assert.ok(raisedDoubtId, 'Doubt ID must be returned');

  // 2. Peer 2 replies to the live doubt inside the room
  const replyPromise = new Promise<void>((resolve) => {
    socketClient1.on('room_doubt_replied', ({ doubtId, reply }: any) => {
      if (doubtId === raisedDoubtId) {
        assert.equal(reply.senderName, 'Peer 2');
        assert.equal(reply.text, 'Use integration by parts: u = x, dv = e^x dx');
        resolve();
      }
    });
  });

  socketClient2.emit('reply_room_doubt', {
    roomId,
    doubtId: raisedDoubtId,
    text: 'Use integration by parts: u = x, dv = e^x dx',
  });
  await replyPromise;

  // 3. Peer 1 resolves the live doubt
  const resolvePromise = new Promise<void>((resolve) => {
    socketClient2.on('room_doubt_resolved', ({ doubtId }: any) => {
      if (doubtId === raisedDoubtId) {
        resolve();
      }
    });
  });

  socketClient1.emit('resolve_room_doubt', { roomId, doubtId: raisedDoubtId });
  await resolvePromise;

  // Cleanup sockets
  socketClient1.disconnect();
  socketClient2.disconnect();
});
