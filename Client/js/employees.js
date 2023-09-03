const API_BASE_URL = "http://localhost:8081";
const API_EMPLOYEES_URL = "http://localhost:8081/api/employees";

document.addEventListener("DOMContentLoaded", () => {
    const employeeContainer = document.getElementById("employee-list");
    console.log(employeeContainer);
    // Fetch employees
    fetch(API_EMPLOYEES_URL)
        .then(response => response.json())
        .then(employees => {
            console.log(employees);
            employees.forEach(employee => {
                employeeContainer.innerHTML += createEmployeeCard(employee);
            });
        });
});

function createEmployeeCard(employee) {
    return `
        <div class="card">
            <h3>${employee.name}</h3>
            <p>Address: ${employee.address || 'N/A'}</p>
            <p>Phone: ${employee.phone || 'N/A'}</p>
            <p>Email: ${employee.email || 'N/A'}</p>
            <p>Job Title: ${employee.jobtitle || 'N/A'}</p>
            <p>Salary: ${employee.salary || 'N/A'}</p>

            ${employee.photo ? `<img src=http://localhost:8081/${employee.photo} alt="${employee.name} Photo">` : ''}
        </div>
    `;
}