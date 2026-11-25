import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { stateStore } from './stateStore.js';
import { getMockTelemetryFeed, triggerAlertSpike } from './mockThingspeak.js';
import { ToastAlertPayload } from '../src/types/socketEvents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

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

// Admin login validation (Credentials: admin / admin)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ success: true, message: 'Admin authenticated' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }
});

// Teams list and roster endpoints
app.get('/api/teams', (req, res) => {
  res.json(stateStore.getTeams());
});

app.get('/api/roster', (req, res) => {
  res.json(stateStore.getTeamNames());
});

app.post('/api/admin/teams', (req, res) => {
  const { teamName } = req.body;
  if (!teamName || typeof teamName !== 'string') {
    res.status(400).json({ error: 'teamName required' });
    return;
  }
  const added = stateStore.addTeam(teamName);
  if (added) {
    io.emit('roster:update', stateStore.getTeamNames());
    io.emit('leaderboard:update', stateStore.getTeams());
    res.json({ success: true, roster: stateStore.getTeamNames() });
  } else {
    res.status(409).json({ error: 'Team already exists' });
  }
});

app.delete('/api/admin/teams/:teamName', (req, res) => {
  const { teamName } = req.params;
  const removed = stateStore.removeTeam(teamName);
  if (removed) {
    io.emit('roster:update', stateStore.getTeamNames());
    io.emit('leaderboard:update', stateStore.getTeams());
    res.json({ success: true, roster: stateStore.getTeamNames() });
  } else {
    res.status(404).json({ error: 'Team not found' });
  }
});

app.post('/api/admin/presets', (req, res) => {
  const roster = stateStore.loadPresetTeams();
  io.emit('roster:update', roster);
  io.emit('leaderboard:update', stateStore.getTeams());
  res.json({ success: true, roster });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), teamsCount: stateStore.getTeams().length });
});

// --- WebSocket Event Handlers ---

io.on('connection', (socket) => {
  // Send current room state and roster on initial connection
  socket.emit('leaderboard:update', stateStore.getTeams());
  socket.emit('roster:update', stateStore.getTeamNames());
  socket.emit('admin:fallbackToggle', stateStore.getMockFeedState());

  // Dynamic Roster Management from Admin Dashboard
  socket.on('roster:addTeam', (teamName: string, ack) => {
    const added = stateStore.addTeam(teamName);
    if (added) {
      io.emit('roster:update', stateStore.getTeamNames());
      io.emit('leaderboard:update', stateStore.getTeams());
      if (typeof ack === 'function') ack({ success: true });
    } else {
      if (typeof ack === 'function') ack({ success: false, error: 'Team name already exists' });
    }
  });

  socket.on('roster:removeTeam', (teamName: string, ack) => {
    const removed = stateStore.removeTeam(teamName);
    if (removed) {
      io.emit('roster:update', stateStore.getTeamNames());
      io.emit('leaderboard:update', stateStore.getTeams());
      if (typeof ack === 'function') ack({ success: true });
    } else {
      if (typeof ack === 'function') ack({ success: false });
    }
  });

  socket.on('roster:loadPresets', (ack) => {
    const roster = stateStore.loadPresetTeams();
    io.emit('roster:update', roster);
    io.emit('leaderboard:update', stateStore.getTeams());
    if (typeof ack === 'function') ack({ success: true, teams: roster });
  });

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

// --- Static Frontend File Serving (Full-Stack Single-URL Production Mode) ---
if (fs.existsSync(distPath)) {
  console.log(`[IoT Platform Server] Serving compiled frontend from: ${distPath}`);
  app.use(express.static(distPath));
  // Single-Page Application (SPA) fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`[IoT Platform Server] Running on http://localhost:${PORT}`);
  console.log(`[IoT Platform Server] Simulated ThingSpeak feed at: http://localhost:${PORT}/api/feed`);
});
