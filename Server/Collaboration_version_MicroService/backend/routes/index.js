var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var axios=require("axios");
const secret = "secret";

/* GET home page. */
router.post("/addcol", async (req, res) => {
  const { docId, collaboratorEmail } = req.body;

  try {
    // Call the user microservice to get the user details
    const response = await axios.post("http://localhost:4001/users/findUser", req.body);

    if (!response.data.success) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Call the document microservice to get the document details
    const response2 = await axios.post("http://localhost:4002/documents/getDocument", req.body);

    if (!response2.data.success) {
      return res.status(404).send({ success: false, message: "Document not found" });
    }

    const document = response2.data.doc;

    // Check if the user is already a collaborator
    if (document.collaborators.includes(response.data.userData._id)) {
      return res.status(400).send({ success: false, message: "Collaborator already exists in the document" });
    }

    // Update the document in the database
    document.collaborators.push(response.data.userData._id);

    // Call the document microservice to update the document
    const updateResponse = await axios.post("http://localhost:4002/documents/updateDocument", {
      docId: document._id,
      collaborators: document.collaborators,
    });

    if (!updateResponse.data.success) {
      return res.status(500).send({ success: false, message: "Failed to update document" });
    }

    res.status(200).send({ success: true, message: "Collaborator added successfully" });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res.status(500).send({ success: false, message: "An error occurred while adding collaborator" });
  }
});





   router.post("/getHistory", async (req, res) => {
    
    try {
    // Send request to the external service to get document
    const response = await axios.post("http://localhost:4002/documents/getDocument", req.body);

    // Check if the response is successful
    if (!response.data.success) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const document = response.data.doc;
    // Return successful response with the document
   
    return res.status(200).json({
      success: true,
      message: "Document found",
      doc:{ "lastUpdatedBy":document.lastUpdatedBy,"previousContent":document.previousContent,"lastUpdate":document.lastUpdate  } ,
    });


  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error fetching document:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the document",
    });
  }

});




module.exports = router;


