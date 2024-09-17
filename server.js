// Veranstaltungen abrufen
app.get('/veranstaltungen', (req, res) => {
    db.all("SELECT * FROM veranstaltungen", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "events": rows });
    });
});

// Neue Veranstaltung hinzufügen
app.post('/veranstaltungen', (req, res) => {
    const { name, datum, ort } = req.body;
    db.run(`INSERT INTO veranstaltungen (name, datum, ort) VALUES (?,?,?)`,
        [name, datum, ort], function (err) {
            if (err) {
                return res.status(400).json({ "error": err.message });
            }
            res.json({ "event": { id: this.lastID, name, datum, ort } });
        });
});

// Veranstaltung löschen
app.delete('/veranstaltungen/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM veranstaltungen WHERE id = ?`, id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Veranstaltung gelöscht", changes: this.changes });
    });
});

// Datenbankinitialisierung für Veranstaltungen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS veranstaltungen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        datum TEXT,
        ort TEXT
    )`);
});
