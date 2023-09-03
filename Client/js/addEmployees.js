document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("employee-submit-button");
    submitButton.addEventListener("click", createEmployee);
    
    const goBackButton = document.getElementById("go-back-button");
    goBackButton.addEventListener("click", goBack);
});

function createEmployee() {
    const name = document.getElementById("employee-name").value;
    const address = document.getElementById("employee-address").value;
    const phone = document.getElementById("employee-phone").value;
    const email = document.getElementById("employee-email").value;
    const jobtitle = document.getElementById("employee-job-title").value;
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

    fetch("http://localhost:8081/api/employees", {
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