const express = require("express");
const router = express.Router();
const db = require("../db"); // Database SQLite/PostgreSQL
const authenticate = require("../middleware/auth");

// Il candidato mette "Mi piace" a un'azienda
router.post("/like-job", authenticate, async (req, res) => {
    const { jobId } = req.body;
    const userId = req.user.id; // Dall'autenticazione

    try {
        await db.run("INSERT INTO job_likes (user_id, job_id) VALUES (?, ?)", [userId, jobId]);

        // Controlliamo se anche l'azienda ha già messo like al candidato
        const match = await db.get("SELECT * FROM candidate_likes WHERE user_id = ? AND job_id = ?", [userId, jobId]);

        if (match) {
            // MATCH TROVATO! Creiamo la connessione
            await db.run("INSERT INTO matches (user_id, job_id) VALUES (?, ?)", [userId, jobId]);
            return res.json({ success: true, match: true });
        }

        res.json({ success: true, match: false });
    } catch (error) {
        res.status(500).json({ error: "Errore nel like al lavoro" });
    }
});

// L'azienda mette "Mi piace" a un candidato
router.post("/like-candidate", authenticate, async (req, res) => {
    const { candidateId, jobId } = req.body;
    const companyId = req.user.id;

    try {
        await db.run("INSERT INTO candidate_likes (company_id, user_id, job_id) VALUES (?, ?, ?)", [companyId, candidateId, jobId]);

        // Controlliamo se il candidato ha già messo like al lavoro
        const match = await db.get("SELECT * FROM job_likes WHERE user_id = ? AND job_id = ?", [candidateId, jobId]);

        if (match) {
            // MATCH TROVATO!
            await db.run("INSERT INTO matches (user_id, job_id) VALUES (?, ?)", [candidateId, jobId]);
            return res.json({ success: true, match: true });
        }

        res.json({ success: true, match: false });
    } catch (error) {
        res.status(500).json({ error: "Errore nel like al candidato" });
    }
});

// Recuperare i match di un utente
router.get("/my-matches", authenticate, async (req, res) => {
    const userId = req.user.id;
    try {
        const matches = await db.all("SELECT * FROM matches WHERE user_id = ?", [userId]);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: "Errore nel recupero dei match" });
    }
});

module.exports = router;
