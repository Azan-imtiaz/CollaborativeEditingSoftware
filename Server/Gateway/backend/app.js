const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const axios = require('axios');  // Add axios for HTTP requests
const app = express();
const createError = require('http-errors');

// Helper function to forward requests
const forwardRequest = async (url, req, res) => {
  console.log("helo2")
  try {
    console.log("helo")
    console.log(`Forwarding request to ${url}`);
    console.log(req.body)
    const response = await axios.post(        url   , req.body    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding request to ${url}:`, error.message);
    res.status(error.response ? error.response.status : 500).json({
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// Routes for user operations
app.post('/users/signUp', (req, res) => forwardRequest('http://localhost:4001/users/signUp', req, res));
app.post('/users/login', (req, res) => forwardRequest('http://localhost:4001/users/login', req, res));
app.post('/users/getUser', (req, res) => forwardRequest('http://localhost:4001/users/getUser', req, res));
app.post('/users/logout', (req, res) => forwardRequest('http://localhost:4001/users/logout', req, res));
// app.post('/users/addcol', (req, res) => forwardRequest('http://localhost:4001/users/addcol', req, res));




// Proxy route for /documents
app.post('/documents/createDoc',(req, res) => forwardRequest('http://localhost:4002/documents/createDoc', req, res));
app.post('/documents/uploadDoc',(req, res) => forwardRequest('http://localhost:4002/documents/uploadDoc', req, res));
app.post('/documents/getDoc',(req, res) => forwardRequest('http://localhost:4002/documents/getDoc', req, res));
app.post('/documents/deleteDoc',(req, res) => forwardRequest('http://localhost:4002/documents/deleteDoc', req, res));
app.post('/documents/getAllDocs',(req, res) => forwardRequest('http://localhost:4002/documents/getAllDocs', req, res));

// Proxy route for /collaboration
app.post('/collaboration/addcol', (req, res) => forwardRequest('http://localhost:4003/collaboration/addcol', req, res));
app.post('/collaboration/getHistory', (req, res) => forwardRequest('http://localhost:4003/collaboration/getHistory', req, res));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  const errorResponse = {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  };
  res.status(err.status || 500).json(errorResponse);
});

// Start the server on port 3000
app.listen(3000, () => console.log('API Gateway running on port 3000'));

module.exports = app;
