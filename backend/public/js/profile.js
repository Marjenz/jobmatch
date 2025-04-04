// document.addEventListener("DOMContentLoaded", async () => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       window.location.href = "login.html";
//       return;
//     }
  
//     try {
//       const response = await fetch("http://localhost:3000/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error("Errore nel recupero del profilo");
//       }
  
//       const data = await response.json();
  
//       document.getElementById("profile-name").textContent = data.name;
//       document.getElementById("profile-surname").textContent = data.surname || "N/A";
//       document.getElementById("profile-email").textContent = data.email;
//       document.getElementById("profile-job").textContent = data.job || "N/A";
  
//       const jobHistory = document.getElementById("job-history");
//       data.acceptedJobs.forEach((job) => {
//         const jobItem = document.createElement("li");
//         jobItem.textContent = job.title;
//         jobHistory.appendChild(jobItem);
//       });
//     } catch (error) {
//       console.error("Errore:", error);
//     }
//   });