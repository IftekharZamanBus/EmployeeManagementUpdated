const express = require('express');
const path = require('path');
const multer = require('multer');
// Added this line at 6:01 PM
const {Pool, Client} = require('pg')
const cors = require('cors'); // Import the cors package
require('dotenv').config()

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

const port = process.env.PORT

let db_hostname;
let db_username;
let db_database;
let db_password;
let db_port;
let db_ssl;

if(process.env.NODE_ENV === "development") {
    db_hostname = process.env.LOCALDB_HOST;
    db_username = process.env.LOCALDB_USER;
    db_database = process.env.LOCALDB_DATABASE;
    db_password = process.env.LOCALDB_PASSWORD;
    db_port = process.env.LOCALDB_PORT;
    db_ssl = false;
} else {
    db_hostname = process.env.PRODDB_HOST;
    db_username = process.env.PRODDB_USER;
    db_database = process.env.PRODDB_DATABASE;
    db_password = process.env.PRODDB_PASSWORD;
    db_port = process.env.PRODDB_PORT;
    db_ssl = true;
}

const pool = new Pool ({
    user: db_username,
    host: db_hostname,
    database: db_database,
    password: db_password,
    port: db_port,
    ssl: db_ssl
})

async function connectToDB() {
    try {
        const client = new Client ({
            user: db_username,
            host: db_hostname,
            database: db_database,
            password: db_password,
            port: db_port
        })
    
        await client.connect();
    
        const dbRowCount = (await client.query('SELECT NOW()')).rowCount;
    
        if(dbRowCount > 0) {
            console.log(`Database successfully connected to the server`)
        } else {
            console.log(`Unable to connect database to the server`);
        }
    
        await client.end();
    } catch(error) {
        console.log(`An error occured while connecting to the database. Please see this following: ${error}`)
    }
}

connectToDB();

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
