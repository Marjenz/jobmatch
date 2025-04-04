const express = require("express");
const path = require("path");
const cors = require("cors");
const { readDB, writeDB } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Ottenere tutti i lavori
app.get("/jobs", (req, res) => {
  const db = readDB();
  res.json(db.jobs); // Restituisce tutti i lavori
});

// 📌 Ottenere i dettagli di un lavoro
app.get("/jobs/:id", (req, res) => {
  const db = readDB();
  const job = db.jobs.find((job) => job.id == req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Lavoro non trovato" });
  }

  res.json(job); // Restituisce i dettagli di un lavoro specifico
});

// 📌 Accettare o rifiutare un lavoro
app.post("/jobs/:id/:action", (req, res) => {
  const { id, action } = req.params;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const db = readDB();
  const user = db.users.find((user) => user.token === token);
  const company = db.companies.find((company) => company.token === token);

  if (!user && !company) {
    return res.status(401).json({ message: "Non autorizzato" });
  }

  const job = db.jobs.find((job) => job.id === parseInt(id));
  if (!job) {
    return res.status(404).json({ message: "Lavoro non trovato" });
  }

  if (action === "accept" && user) {
    user.acceptedJobs = user.acceptedJobs || [];
    user.acceptedJobs.push(job); // Aggiunge il lavoro alla lista dei lavori accettati dell'utente
  
  } else if (action === "reject" && user) {
    user.rejectedJobs = user.rejectedJobs || [];
    user.rejectedJobs.push(job); 


  } else if (action === "reject" && company) {
    company.rejectedJobs = company.rejectedJobs || [];
    company.rejectedJobs.push(job); // Aggiunge il lavoro alla lista dei lavori rifiutati dell'azienda
  } else {
    return res.status(400).json({ message: "Azione non valida" });
  }

  writeDB(db); // Salva i dati aggiornati nel database
  res.json({ message: `Lavoro ${action} con successo` });
});



// 📌 Registrazione utente
app.post("/register", (req, res) => {
  const { name, surname, email, password, job } = req.body;
  const db = readDB();
  const newUser = { id: Date.now(), name, surname, email, password, job };
  db.users.push(newUser);
  writeDB(db);
  res.json({ message: "Registrazione avvenuta con successo!" });
});

// 📌 Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  console.log("📢 Login request received");

  const user = db.users.find((user) => user.email === email && user.password === password);
  const company = db.companies.find((company) => company.email === email && company.password === password);

  if (user) {
    const token = `user-${Date.now()}`;
    user.token = token;
    writeDB(db);
    return res.json({ success: true, token, user, userType: "user" });
  }

  if (company) {
    const token = `company-${Date.now()}`;
    company.token = token;
    writeDB(db);
    return res.json({ success: true, token, company, userType: "company" });
  }

  res.status(400).json({ message: "Email o password errati" });
});

// 📌 Profilo utente
app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token mancante o non valido" });
  }

  const token = authHeader.split(" ")[1];
  const db = readDB();
  const user = db.users.find((user) => user.token === token);

  if (!user) {
    return res.status(404).json({ message: "Profilo non trovato" });
  }

  res.json({
    name: user.name,
    surname: user.surname,
    email: user.email,
    job: user.job,
    acceptedJobs: user.acceptedJobs || [],
  });
});



// 📌 Servire i file statici
app.use(express.static(path.join(__dirname, "public")));

// 📌 Tutte le altre richieste vanno all'index.html (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));


});




// Avvia il server
app.listen(3000, () => console.log("🚀 Server in esecuzione su http://localhost:3000"));

