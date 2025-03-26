document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/profile", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const user = await response.json();
        if (user.success) {
            document.getElementById("user-name").innerText = user.name;
            document.getElementById("user-email").innerText = user.email;
            
            const savedJobsList = document.getElementById("saved-jobs");
            user.savedJobs.forEach(job => {
                const li = document.createElement("li");
                li.textContent = job.title + " - " + job.company;
                savedJobsList.appendChild(li);
            });
        } else {
            alert("Errore: " + user.message);
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Errore nel recupero del profilo:", error);
    }

    // Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});
