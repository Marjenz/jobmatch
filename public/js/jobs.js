document.addEventListener("DOMContentLoaded", async () => {
    const jobContainer = document.getElementById("job-list");
    
    async function fetchJobs() {
        const response = await fetch("http://localhost:3000/api/jobs");
        const jobs = await response.json();

        jobContainer.innerHTML = "";
        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "job-card";
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.company} - ${job.salary}€</p>
                <button class="like-btn" data-id="${job.id}">❤️ Mi Piace</button>
                <button class="pass-btn">❌ Passa</button>
            `;

            jobCard.querySelector(".like-btn").addEventListener("click", async () => {
                const res = await fetch("http://localhost:3000/api/match/like-job", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
                    body: JSON.stringify({ jobId: job.id })
                });

                const data = await res.json();
                if (data.match) {
                    alert("MATCH! Ora puoi chattare.");
                } else {
                    alert("Hai messo Mi Piace!");
                }
            });

            jobCard.querySelector(".pass-btn").addEventListener("click", () => {
                jobCard.remove();
            });

            jobContainer.appendChild(jobCard);
        });
    }

    fetchJobs();
});
