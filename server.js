const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 9090;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'roster.json');

// Load roster data
function loadRoster() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) {}
    return {};
}

// Save roster data
function saveRoster(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET - Load all selections
app.get('/api/roster', (req, res) => {
    res.json(loadRoster());
});

// POST - Save a selection
app.post('/api/roster', (req, res) => {
    const { week, person, day } = req.body;
    if (!week || !person || !day) {
        return res.status(400).json({ error: 'Missing week, person, or day' });
    }
    const roster = loadRoster();
    roster[week] = { person, day, updatedAt: new Date().toISOString() };
    saveRoster(roster);
    res.json({ success: true, roster });
});

// DELETE - Clear a selection
app.delete('/api/roster/:week', (req, res) => {
    const roster = loadRoster();
    delete roster[req.params.week];
    saveRoster(roster);
    res.json({ success: true, roster });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏠 House Rules server running on http://0.0.0.0:${PORT}`);
});
