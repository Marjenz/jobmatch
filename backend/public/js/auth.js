// Attende che il documento HTML sia completamente caricato prima di eseguire il codice
// Questo assicura che tutti gli elementi della pagina siano disponibili per essere selezionati e manipolati
document.addEventListener("DOMContentLoaded", () => {
    // Seleziona il pulsante di login dalla pagina
    const loginBtn = document.getElementById("login-btn");

    // Verifica se il pulsante di login esiste prima di aggiungere l'evento
    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
            // Recupera i valori inseriti dall'utente nei campi email e password
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            try {
                // Effettua una richiesta HTTP POST al server per il login
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST", // Specifica il metodo della richiesta
                    headers: { "Content-Type": "application/json" }, // Indica che i dati inviati sono in formato JSON
                    body: JSON.stringify({ email, password }) // Converte l'oggetto in una stringa JSON
                });

                // Converte la risposta del server in un oggetto JavaScript
                const data = await response.json();
                console.log("Risposta server:", data); // Stampa la risposta nella console per debugging

                if (data.success) {
                    // Salva i dati di login nel localStorage
                    localStorage.setItem("email", email);
                    localStorage.setItem("token", data.token);
                  
                    if (data.userType === "company") {
                      localStorage.setItem("name-company", data.company.name);
                      localStorage.setItem("industry", data.company.industry);
                      window.location.href = "dashboard.html";
                    } else {
                      // Salva i dati dell'utente (lavoratore)
                      localStorage.setItem("name", data.user.name);
                      localStorage.setItem("surname", data.user.surname);
                      localStorage.setItem("acceptedJobs", JSON.stringify(data.user.acceptedJobs));
                      window.location.href = "jobs.html";
                    }
                  } else {
                    // Mostra un messaggio di errore se il login fallisce
                    alert("Errore: " + data.message);
                  }
                  
            } catch (error) {
                // Gestisce eventuali errori durante la richiesta
                console.error("Errore di login:", error);
            }
        });
    }

    // Seleziona il pulsante di registrazione dalla pagina
    const registerBtn = document.getElementById("register-btn");
    
    // Verifica se il pulsante di registrazione esiste prima di aggiungere l'evento
    if (registerBtn) {
        registerBtn.addEventListener("click", async () => {
            // Recupera i valori inseriti dall'utente nei campi di registrazione
            const name = document.getElementById("register-name").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;

            try {
                // Effettua una richiesta HTTP POST al server per la registrazione
                const response = await fetch("http://localhost:3000/api/register", {
                    method: "POST", // Metodo HTTP utilizzato per inviare i dati
                    headers: { "Content-Type": "application/json" }, // Indica che i dati inviati sono JSON
                    body: JSON.stringify({ name, email, password }) // Converte i dati in una stringa JSON e li invia
                });

                // Converte la risposta del server in un oggetto JavaScript
                const data = await response.json();
                
                if (data.success) {
                    // Salva il token nel localStorage
                    localStorage.setItem("token", data.token);
                
                    // Salva i dati dell'utente o dell'azienda
                    if (data.user) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                    } else if (data.company) {
                        localStorage.setItem("company", JSON.stringify(data.company));
                    }
                
                    // Reindirizza alla dashboard o al profilo
                    window.location.href = "dashboard.html";
                } else {
                    alert("Errore: " + data.message);
                }
            } catch (error) {
                // Gestisce eventuali errori durante la richiesta
                console.error("Errore di registrazione:", error);
            }
        });
    }
});