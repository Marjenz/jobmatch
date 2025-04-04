document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "login.html";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Errore nel recupero dei lavori");
      }
  
      const jobs = await response.json();
  
      const jobsContainer = document.getElementById("jobs-container");
      jobs.forEach((job) => {
        const jobElement = document.createElement("div");
        jobElement.innerHTML = `
          <h3>${job.title}</h3>
          <p>${job.description}</p>
          <button class="accept-btn" data-id="${job.id}">Accetta</button>
          <button class="reject-btn" data-id="${job.id}">Rifiuta</button>
          <button class="details-btn" data-id="${job.id}">Dettagli</button>
        `;
        jobsContainer.appendChild(jobElement);
      });
  
      document.querySelectorAll(".accept-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const jobId = event.target.dataset.id;
          await handleJobAction(jobId, "accept");
        });
      });
  
      document.querySelectorAll(".reject-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const jobId = event.target.dataset.id;
          await handleJobAction(jobId, "reject");
        });
      });
    } catch (error) {
      console.error("Errore:", error);
    }
  });
  
  async function handleJobAction(jobId, action) {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`http://localhost:3000/jobs/${jobId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Errore nell'azione sul lavoro");
      }
  
      alert(`Lavoro ${action === "accept" ? "accettato" : "rifiutato"} con successo!`);
      window.location.reload();
    } catch (error) {
      console.error("Errore:", error);
    }
  }