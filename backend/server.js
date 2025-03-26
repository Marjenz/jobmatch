// Importa i moduli necessari
const express = require("express"); // Framework per creare il server
const cors = require("cors"); // Middleware per abilitare le richieste CORS
const { readDB, writeDB } = require("./db"); // Funzioni per leggere e scrivere nel database simulato

// Inizializza l'applicazione Express
const app = express();
app.use(cors()); // Abilita CORS per permettere richieste da altri domini
app.use(express.json()); // Middleware per permettere il parsing dei JSON nel body delle richieste

// Endpoint per ottenere tutti i lavori
app.get("/jobs", (req, res) => {
  const db = readDB(); // Legge il database simulato
  res.json(db.jobs); // Restituisce la lista dei lavori
});

// Endpoint per registrare un nuovo utente
app.post("/register", (req, res) => {
  const { name, surname, email, password, job } = req.body; // Estrae i dati dal body della richiesta
  const db = readDB(); // Legge il database simulato

  // Crea un nuovo utente (simulando l'hashing della password, ma senza sicurezza reale)
  const newUser = { id: Date.now(), name, surname, email, password, job };
  db.users.push(newUser); // Aggiunge il nuovo utente al database
  writeDB(db); // Scrive il database aggiornato su file

  res.json({ message: "Registrazione avvenuta con successo!" }); // Risponde con un messaggio di conferma
});

// Endpoint per il login
app.post("/login", (req, res) => {
  const { email, password } = req.body; // Estrae email e password dalla richiesta
  const db = readDB(); // Legge il database simulato

  console.log("Tentativo di login per email:", email);

  const user = db.users.find(user => user.email === email); // Cerca l'utente nel database

  if (!user) { // Se l'utente non esiste
      console.log("Utente non trovato:", email);
      return res.status(400).json({ message: "Utente non trovato" }); // Risponde con errore
  }

  console.log("Utente trovato:", user.email);

  if (user.password !== password) { // Se la password è errata
      console.log("Password errata per:", user.email);
      return res.status(400).json({ message: "Password errata" }); // Risponde con errore
  }

  console.log("Login successo per:", user.email);
  res.json({ success: true, message: "Login effettuato con successo!", user }); // Risponde con un messaggio di successo e i dati dell'utente
});

// Avvia il server sulla porta 3000
app.listen(3000, () => console.log("Server in esecuzione su http://localhost:3000"));

