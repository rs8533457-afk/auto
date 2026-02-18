const express = require('express');
const cors = require('cors');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
