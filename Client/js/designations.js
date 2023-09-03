const API_BASE_URL = "http://localhost:8081";
const API_DESIGNATIONS_URL = "http://localhost:8081/api/designations";

document.addEventListener("DOMContentLoaded", () => {
    const designationContainer = document.getElementById("designation-list");

    // Fetch designations
    fetch(API_DESIGNATIONS_URL)
        .then(response => response.json())
        .then(designations => {
            designations.forEach(designation => {
                designationContainer.innerHTML += createDesignationCard(designation);
            });
        });
});

function createDesignationCard(designation) {
    return `
        <div class="card">
            <h3>${designation.name}</h3>
            <p>${designation.description || 'No description available'}</p>
        </div>
    `;
}