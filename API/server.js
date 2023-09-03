const express = require('express');
const path = require('path');
const multer = require('multer');
// Added this line at 6:01 PM
const {Pool} = require('pg')
const cors = require('cors'); // Import the cors package

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./images")
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${getExtenstion(file.mimetype)}`)
     }
})

const getExtenstion = mimetype => {
    switch(mimetype){
        case "image/png":
            return ".png"
        case "image/jpeg":
            return ".jpeg"
        case "image/jpg":
            return ".jpg"
        
    }
}

const app = express();
app.use(express.json());
app.use(cors())
const upload = multer({storage: storage});

app.use("/images", express.static("images"))

const port = 8081

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'Draco_3111',
    port: 5432
})

// CRUD Functions

// GET all designations (Database System)
app.get("/api/designations", async (req, res) => {
    try {
        const query = "SELECT * FROM designations";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// GET individual designation (Database System)
app.get("/api/designations/:id", async (req, res) => {
    try {
        const designationId = parseInt(req.params.id);
        const query = "SELECT * FROM designations WHERE id = $1";
        const result = await pool.query(query, [designationId]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Designation not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// POST create a new designation (Database System)
app.post("/api/designations", async(req, res) => {
    try {
        const {name, description} = req.body 
        const result = await pool.query("INSERT INTO designations (name, description) VALUES ($1, $2) RETURNING designation_id", [name, description])
        console.log(result);
        const getDesignationByIdQuery = await pool.query("SELECT * FROM designations WHERE designation_id = $1", [result.rows[0].designation_id]) 
        console.log(getDesignationByIdQuery);
        res.status(201).json({ message: 'Designation created successfully', designation: getDesignationByIdQuery.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// DELETE a designation (Database System)
app.delete("/api/designations/:id", async (req, res) => {
    try {
        const designationId = parseInt(req.params.id);
        const query = "DELETE FROM designations WHERE id = $1";
        await pool.query(query, [designationId]);
        res.json({ message: 'Designation deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET all employees (Database System)
app.get("/api/employees", async (req, res) => {
    try {
        const query = "SELECT * FROM employees";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// GET individual employee (Database System)
app.get("/api/employees/:id", async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const query = "SELECT * FROM employees WHERE id = $1";
        const result = await pool.query(query, [employeeId]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST create a new employee (Database System)
app.post("/api/employees", upload.single('photo'), async(req, res) => {
    try {
        const {name, address, phone, email, jobtitle, salary} = req.body 
        let photo = req.file.path
        console.log(photo);
        const result = await pool.query("INSERT INTO employees (name, address, phone, email, jobtitle, salary, photo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id", [name, address, phone, email, jobtitle, salary, photo])
        const getEmployeeByIdQuery = await pool.query("SELECT * FROM employees WHERE id = $1", [result.rows[0].id]) 
        res.status(201).json({ message: 'Employee created successfully', employee: getEmployeeByIdQuery.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE an employee (Database System)
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const employeeId = parseInt(req.params.id);
        const query = "DELETE FROM employees WHERE id = $1";
        await pool.query(query, [employeeId]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Root path handler
app.get("/", (req, res) => {
    res.send("Welcome to the Employee Management API");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
