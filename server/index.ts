import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { stateStore } from './stateStore.js';
import { getMockTelemetryFeed, triggerAlertSpike } from './mockThingspeak.js';
import { ToastAlertPayload } from '../src/types/socketEvents.js';

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// --- REST Endpoints ---

// Simulated ThingSpeak Endpoint (MicroPython boards query this if offline)
app.get('/api/feed', (req, res) => {
  res.json(getMockTelemetryFeed());
});

// Admin endpoint to trigger sensor demo changes (heat/dry/reset)
app.post('/api/trigger-alert', (req, res) => {
  const { type } = req.body;
  if (type === 'heat' || type === 'dry' || type === 'reset') {
    triggerAlertSpike(type);
    res.json({ success: true, message: `Alert condition set to: ${type}` });
  } else {
    res.status(400).json({ error: 'Invalid type. Use heat, dry, or reset' });
  }
});

// Teams list endpoint
app.get('/api/teams', (req, res) => {
  res.json(stateStore.getTeams());
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), teamsCount: stateStore.getTeams().length });
});

// --- WebSocket Event Handlers ---

io.on('connection', (socket) => {
  // Send current room state on initial connection
  socket.emit('leaderboard:update', stateStore.getTeams());
  socket.emit('admin:fallbackToggle', stateStore.getMockFeedState());

  // Team login
  socket.on('team:login', (teamName: string, ack) => {
    const team = stateStore.loginTeam(teamName);
    if (team) {
      if (typeof ack === 'function') ack({ success: true, state: team });
      io.emit('leaderboard:update', stateStore.getTeams());
    } else {
      if (typeof ack === 'function') ack({ success: false, error: 'Team name not found on authorized roster.' });
    }
  });

  // Level complete
  socket.on('level:complete', ({ teamName, level }) => {
    const result = stateStore.completeLevel(teamName, level);
    if (result) {
      io.emit('leaderboard:update', stateStore.getTeams());

      // If team was first in room to finish this level, blast room toast!
      if (result.isFirst) {
        const toast: ToastAlertPayload = {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: 'speed_race',
          title: '⚡ SPEED CHALLENGE WINNER!',
          message: `${teamName} is the FIRST team to complete Level ${level}!`,
          teamName,
          timestamp: Date.now()
        };
        io.emit('room:toast', toast);
      }
    }
  });

  // Raise hand
  socket.on('help:raiseHand', ({ teamName, level }) => {
    const team = stateStore.raiseHand(teamName, level);
    if (team) {
      io.emit('leaderboard:update', stateStore.getTeams());
      io.emit('hand:updated', { teamName, handRaised: true });
    }
  });

  // Cancel hand
  socket.on('help:cancelHand', ({ teamName }) => {
    const team = stateStore.cancelHand(teamName);
    if (team) {
      io.emit('leaderboard:update', stateStore.getTeams());
      io.emit('hand:updated', { teamName, handRaised: false });
    }
  });

  // Peer bonus awarded
  socket.on('peer:bonusAwarded', ({ fromTeam, toTeam }) => {
    const res = stateStore.awardPeerBonus(fromTeam, toTeam);
    if (res.success) {
      io.emit('leaderboard:update', stateStore.getTeams());
      const toast: ToastAlertPayload = {
        id: `toast-${Date.now()}-${Math.random()}`,
        type: 'peer_help',
        title: '🤝 TEAMWORK BONUS!',
        message: `${fromTeam} awarded +50 Peer-Help Bonus points to ${toTeam}!`,
        teamName: toTeam,
        timestamp: Date.now()
      };
      io.emit('room:toast', toast);
    }
  });

  // Admin reset
  socket.on('admin:reset', () => {
    stateStore.reset();
    io.emit('leaderboard:update', stateStore.getTeams());
  });

  // Admin toggle mock feed
  socket.on('admin:toggleMock', (useMock: boolean) => {
    stateStore.setMockFeed(useMock);
    io.emit('admin:fallbackToggle', useMock);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[IoT Platform Server] Running on http://localhost:${PORT}`);
  console.log(`[IoT Platform Server] Simulated ThingSpeak feed at: http://localhost:${PORT}/api/feed`);
});
