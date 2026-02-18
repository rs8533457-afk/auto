const express = require('express');
const cors = require('cors');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// OAuth2 Setup
const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
);

console.log(`[Auth] Initialized with Redirect URI: ${process.env.YOUTUBE_REDIRECT_URI}`);

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'];

app.use(cors());
app.use(express.json());

// Root route for status check
app.get('/', (req, res) => {
    res.send('<h1>YouTube Automation Backend is Online</h1><p>Visit <a href="http://localhost:5173">http://localhost:5173</a> for the frontend.</p>');
});

// Auth Endpoints
app.get('/api/auth/google', (req, res) => {
    if (!process.env.YOUTUBE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID === 'mock_id') {
        return res.status(400).json({
            error: 'Missing Credentials',
            message: 'Please set your real YouTube Client ID and Secret in the backend .env file.'
        });
    }
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.json({ url });
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // In a real app, save tokens to DB
        console.log('[Auth] Channel connected successfully');
        res.send('<h1>Authentication successful! You can close this tab.</h1>');
    } catch (error) {
        console.error('[Auth] Error exchanging code for tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

// Mock database for automation rules
let automationRules = [
    { id: 1, name: "Gaming Shorts", watchPath: "./watched/shorts", templateId: "tpl_1", active: true }
];

// Initialize folder watcher
const watchers = {};

function setupWatcher(rule) {
    if (watchers[rule.id]) watchers[rule.id].close();

    const watcher = chokidar.watch(rule.watchPath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true
    });

    watcher.on('add', (filePath) => {
        console.log(`[Automation] New file detected: ${filePath}`);
        triggerUpload(rule, filePath);
    });

    watchers[rule.id] = watcher;
    console.log(`[Automation] Watching folder: ${rule.watchPath}`);
}

// Simulated Upload Function
async function triggerUpload(rule, filePath) {
    console.log(`[YouTube] Starting automated upload for ${path.basename(filePath)} using template ${rule.templateId}`);

    // This is where you would call the YouTube API
    // Using googleapis: youtube.videos.insert(...)

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        console.log(`[YouTube] Upload Progress: ${progress}%`);
        if (progress >= 100) {
            clearInterval(interval);
            console.log(`[YouTube] Upload Complete: ${path.basename(filePath)}`);
        }
    }, 1000);
}

// Setup initial watchers
automationRules.forEach(setupWatcher);

// API Endpoints
app.get('/api/rules', (req, res) => res.json(automationRules));

app.post('/api/rules', (req, res) => {
    const newRule = { id: Date.now(), ...req.body, active: true };
    automationRules.push(newRule);
    setupWatcher(newRule);
    res.status(201).json(newRule);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        activeWatchers: Object.keys(watchers).length,
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
