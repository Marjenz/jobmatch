// Attende che il documento sia completamente caricato prima di eseguire il codice
document.addEventListener("DOMContentLoaded", () => {
    
    // Gestione del login
    const loginBtn = document.getElementById("login-btn"); // Seleziona il pulsante di login
    
    if (loginBtn) { // Verifica se il pulsante di login esiste nella pagina
        loginBtn.addEventListener("click", async () => { // Aggiunge un evento al click del pulsante
            const email = document.getElementById("login-email").value; // Recupera il valore dell'input email
            const password = document.getElementById("login-password").value; // Recupera il valore dell'input password

            try {
                const response = await fetch("http://localhost:3000/login", { // Effettua una richiesta POST al server per il login
                    method: "POST", // Metodo HTTP POST per inviare dati al server
                    headers: { "Content-Type": "application/json" }, // Specifica che i dati inviati sono in formato JSON
                    body: JSON.stringify({ email, password }) // Converte i dati in una stringa JSON e li invia
                });

                const data = await response.json(); // Converte la risposta del server in un oggetto JavaScript
                console.log("Risposta server:", data); // Aggiungi questa linea per vedere la risposta
                if (data.success) { // Se il login ha avuto successo
                    localStorage.setItem("token", data.token); // Salva il token di autenticazione nel localStorage
                    window.location.href = "dashboard.html"; // Reindirizza l'utente alla pagina principale
                } else {
                    alert("Errore: " + data.message); // Mostra un messaggio di errore se il login fallisce
                }
            } catch (error) {
                console.error("Errore di login:", error); // Stampa l'errore nella console in caso di problemi con la richiesta
            }
        });
    }

    // Gestione della registrazione
    const registerBtn = document.getElementById("register-btn"); // Seleziona il pulsante di registrazione
    if (registerBtn) { // Verifica se il pulsante di registrazione esiste nella pagina
        registerBtn.addEventListener("click", async () => { // Aggiunge un evento al click del pulsante
            const name = document.getElementById("register-name").value; // Recupera il valore dell'input nome
            const email = document.getElementById("register-email").value; // Recupera il valore dell'input email
            const password = document.getElementById("register-password").value; // Recupera il valore dell'input password

            try {
                const response = await fetch("http://localhost:3000/api/register", { // Effettua una richiesta POST al server per la registrazione
                    method: "POST", // Metodo HTTP POST per inviare dati al server
                    headers: { "Content-Type": "application/json" }, // Specifica che i dati inviati sono in formato JSON
                    body: JSON.stringify({ name, email, password }) // Converte i dati in una stringa JSON e li invia
                });

                const data = await response.json(); // Converte la risposta del server in un oggetto JavaScript
                if (data.success) { // Se la registrazione ha avuto successo
                    alert("Registrazione riuscita! Ora puoi accedere."); // Mostra un messaggio di conferma
                    window.location.href = "login.html"; // Reindirizza l'utente alla pagina di login
                } else {
                    alert("Errore: " + data.message); // Mostra un messaggio di errore se la registrazione fallisce
                }
            } catch (error) {
                console.error("Errore di registrazione:", error); // Stampa l'errore nella console in caso di problemi con la richiesta
            }
        });
    }
});
