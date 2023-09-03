document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("designation-submit-button");
    submitButton.addEventListener("click", createDesignation);

    const goBackButton = document.getElementById("go-back-button");
    goBackButton.addEventListener("click", goBack);
});

function createDesignation() {
    const name = document.getElementById("designation-name").value;
    const description = document.getElementById("designation-description").value;

    const newDesignation = {
        name: name,
        description: description
    };

    fetch("http://localhost:8081/api/designations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newDesignation),
    }).then(() => {
        window.location.href = "designations.html"; // Redirect to the main page
    }).catch(error => {
        console.error(error);
        // Handle errors here
    });
}

function goBack() {
    window.location.href = "index.html"; // Redirect to the main page
}
