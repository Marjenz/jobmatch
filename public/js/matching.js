document.addEventListener("DOMContentLoaded", () => {
    fetchJobsAndCandidates();
});

async function fetchJobsAndCandidates() {
    try {
        const jobsResponse = await fetch('/api/jobs');
        const candidatesResponse = await fetch('/api/candidates');
        
        const jobs = await jobsResponse.json();
        const candidates = await candidatesResponse.json();

        matchJobsToCandidates(jobs, candidates);
    } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
    }
}

function matchJobsToCandidates(jobs, candidates) {
    let matches = [];
    
    jobs.forEach(job => {
        candidates.forEach(candidate => {
            let score = calculateMatchScore(job, candidate);
            if (score > 70) { // Soglia per considerare un buon match
                matches.push({
                    job: job.title,
                    candidate: candidate.name,
                    score: score
                });
            }
        });
    });
    
    displayMatches(matches);
}

function calculateMatchScore(job, candidate) {
    let score = 0;
    
    if (candidate.skills.includes(job.requiredSkill)) {
        score += 50;
    }
    
    if (candidate.experienceYears >= job.minExperience) {
        score += 30;
    }
    
    if (candidate.location === job.location) {
        score += 20;
    }
    
    return score;
}

function displayMatches(matches) {
    const matchesContainer = document.getElementById("matches-container");
    matchesContainer.innerHTML = "";

    if (matches.length === 0) {
        matchesContainer.innerHTML = "<p>Nessun match trovato.</p>";
        return;
    }

    matches.forEach(match => {
        const matchElement = document.createElement("div");
        matchElement.classList.add("match-card");
        matchElement.innerHTML = `
            <p><strong>${match.candidate}</strong> è compatibile con <strong>${match.job}</strong> (Score: ${match.score}%)</p>
        `;
        matchesContainer.appendChild(matchElement);
    });
}
