// document.addEventListener("DOMContentLoaded", () => {
//     const submitButton = document.getElementById("employee-submit-button");
//     submitButton.addEventListener("click", createEmployee);
    
//     const goBackButton = document.getElementById("go-back-button");
//     goBackButton.addEventListener("click", goBack);
// });

// function createEmployee() {
//     const name = document.getElementById("employee-name").value;
//     const address = document.getElementById("employee-address").value;
//     const phone = document.getElementById("employee-phone").value;
//     const email = document.getElementById("employee-email").value;
//     const jobtitle = document.getElementById("employee-job-title").value;
//     const salary = document.getElementById("employee-salary").value;
//     const photoInput = document.getElementById("employee-photo");

//     console.log(name);
//     console.log(address);
//     console.log(phone);
//     console.log(email);
//     console.log(jobtitle);
//     console.log(salary);
//     console.log(photoInput);

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("address", address);
//     formData.append("phone", phone);
//     formData.append("email", email);
//     formData.append("jobtitle", jobtitle);
//     formData.append("salary", salary);
//     formData.append("photo", photoInput.files[0]);

//     fetch(`${BASE_API_URL}/api/employees`, {
//         method: "POST",
//         body: formData,
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data); // Log the response from the server
//         window.location.href = "employees.html"; // Redirect after successful submission
//     })
//     .catch((error) => {
//         console.error(error); // Log any errors that occur
//         // Handle errors here
//     });
// }

// function goBack() {
//     window.location.href = "index.html"; // Redirect to the main page
// }

const API_DESIGNATIONS_URL = `${BASE_API_URL}/api/designations`;

document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("employee-submit-button");
    submitButton.addEventListener("click", createEmployee);
    
    const goBackButton = document.getElementById("go-back-button");
    goBackButton.addEventListener("click", goBack);

    const jobTitleSelect = document.getElementById("employee-job-title");

    // Fetch designations and populate the dropdown
    fetch(API_DESIGNATIONS_URL)
        .then(response => response.json())
        .then(designations => {
            designations.forEach(designation => {
                const option = document.createElement("option");
                option.value = designation.name;
                option.text = designation.name;
                jobTitleSelect.appendChild(option);
            });
        });
});

function createEmployee() {
    const name = document.getElementById("employee-name").value;
    const address = document.getElementById("employee-address").value;
    const phone = document.getElementById("employee-phone").value;
    const email = document.getElementById("employee-email").value;
    const jobtitle = document.getElementById("employee-job-title").value; // Get selected job title
    const salary = document.getElementById("employee-salary").value;
    const photoInput = document.getElementById("employee-photo");

    console.log(name);
    console.log(address);
    console.log(phone);
    console.log(email);
    console.log(jobtitle);
    console.log(salary);
    console.log(photoInput);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("jobtitle", jobtitle);
    formData.append("salary", salary);
    formData.append("photo", photoInput.files[0]);

    fetch(`${BASE_API_URL}/api/employees`, {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data); // Log the response from the server
        window.location.href = "employees.html"; // Redirect after successful submission
    })
    .catch((error) => {
        console.error(error); // Log any errors that occur
        // Handle errors here
    });
}

function goBack() {
    window.location.href = "index.html"; // Redirect to the main page
}
