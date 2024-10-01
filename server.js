const express = require('express')
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();
app.use(express.json());
app.use(cors());



// Connect to the database 
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Check if db works
db.connect((err) => {
  if (err) {
    return console.log("Error connecting to MySQL database:", err);
  }
  console.log("Connection successful, ID:", db.threadId);
});


// Question 1 goes here
const patients = [
    {
      patient_id: 1,
      first_name: 'Diana',
      last_name: 'Doe',
      date_of_birth: '1990-01-01'
    },
    {
      patient_id: 2,
      first_name: 'Harry',
      last_name: 'Smith',
      date_of_birth: '1985-03-12'
    },
    {
      patient_id: 3,
      first_name: 'Michaela',
      last_name: 'John',
      date_of_birth: '1992-07-25'
    }
  ];
  
  // Create a GET endpoint to retrieve all patients
  // app.get('/patients', (req, res) => {
  //   // Return the patient data in JSON format
  //   res.json(patients);
  // });
  app.get('/patients', (req,res) => {
    db.query('SELECT * FROM patients',(err, results)=>{
        if (err){
            console.error(err);
            res.status(500).send('Error retrieving data');
        }else {
            //render the data in a template
            res.render('data',{results:results});
        }
    });
});
  


// Question 2 goes here

const providers = [
  {
    first_name: 'John',
    last_name: 'Doe',
    provider_specialty: 'Cardiology'
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
    provider_specialty: 'Dermatology'
  },
  {
    first_name: 'James',
    last_name: 'Johnson',
    provider_specialty: 'Neurology'
  }
];

// GET endpoint to display all providers
app.get('/providers', (req, res) => {
  db.query('SELECT * FROM providers',(err, results)=>{
    if (err){
        console.error(err);
        res.status(500).send('Error retrieving data');
    }else {
        //render the data in a template
        res.render('data',{results:results});
    }
});
});

// Question 3 goes here
app.get('/patients', (req, res) => {
  const { first_name } = req.query;

  if (!first_name) {
    return res.status(400);
  }


  const query = 'SELECT * FROM patients WHERE LOWER(first_name) = LOWER(?)';
  connection.query(query, [first_name], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500);
    }

    if (results.length === 0) {
      return res.status(404);
    }

    // Return the query results as JSON
    res.render('data',{results:results});
  });
});



// Question 4 goes here

app.get('/providers', (req, res) => {
  const { provider_specialty } = req.query; // Get provider specialty from query parameters

  if (!provider_specialty) {
    return res.status(400).json({ error: 'Provider specialty query parameter is required' });
  }

  const query = 'SELECT * FROM providers WHERE LOWER(provider_specialty) = LOWER(?)';

  db.query(query, [provider_specialty], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('No providers found with the given specialty');
    }

    // Render the results using EJS template
    res.render('data', { results: results });
  });
});

// listen to the server
// Define the port
const PORT = process.env.PORT || 3300;

// Listen to the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
