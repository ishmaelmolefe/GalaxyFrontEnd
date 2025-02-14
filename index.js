const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render("login/login");
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post('http://localhost:5000/login', {
      email,
      password,
    });

    if (response.status === 200) {
      res.cookie('authToken', response.data.token, { httpOnly: true, secure: false });
      return res.redirect("/dashboard");
    }
    
    res.render("login/login", { error: 'Invalid credentials. Please try again.' });

  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.render("login/login", { error: 'An error occurred. Please try again.' });
  }
});

app.get("/dashboard", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.redirect("/");

  res.render("dashboard/dashboard"); 
});

// Serve the Customers Page
app.get("/customers", (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.redirect("/");
  
    res.render("dashboard/customers");
  });
  

app.get("/api/dashboard-data", async (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const response = await axios.get('http://localhost:5000/rentals-insight', {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data.insights);

  } catch (error) {
    console.error("Error fetching rental insights:", error.message);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

app.post("/api/customer-data", async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
  
    try {
      const response = await axios.post('http://localhost:5000/customer-insight', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      res.json(response.data);
  
    } catch (error) {
      console.error("Error fetching customer insights:", error.message);
      res.status(500).json({ error: "Failed to fetch customer insights" });
    }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
