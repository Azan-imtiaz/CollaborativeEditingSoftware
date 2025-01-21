var express = require('express');
var router = express.Router();
// var userModel = require("../models/useModel")
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var docModel = require("../models/docModel");
const axios=require("axios");
const secret = "secret";

router.post("/createDoc", async (req, res) => {
  let { userId, docName } = req.body;

  try {
    // Fetch user by userId
    // let user = await userModel.findById(userId);
    const response = await axios.post("http://localhost:4001/users/findUserWithId", req.body);

    if (!response.data.success) {
      return res.status(404).send({ success: false, message: "User not found" });
    
    
    }
    let doc = await docModel.create({
        
      title: docName,lastUpdatedBy:response.data.userData.name,
      
      collaborators: [response.data.userData._id]  // Adding the user's id to the collaborators array

    });

    return res.json({
      success: true,
      message: "Document created successfully and user added as collaborator",
      docId: doc._id
    });
    
    
      } catch (error) {
    // console.error("Error creating document:", error);
    return res.json({ success: false, message: "An error occurred while creating the document" });
  }
});
router.post("/uploadDoc", async (req, res) => {
  try {
    const { userId, docId, content } = req.body;

    // Validate required fields
    if (!userId || !docId || !content) {
      return res.status(400).send({
        success: false,
        message: "userId, docId, and content are required.",
      });
    }

    try {
      // Fetch user data from external service
      const response = await axios.post("http://localhost:4001/users/findUserWithId", { userId });

      if (!response.data.success) {
        return res.status(404).send({ success: false, message: "User not found." });
      }

      // Fetch the current document to get its content
      const existingDoc = await docModel.findById(docId);

      if (!existingDoc) {
        return res.status(404).send({ success: false, message: "Document not found." });
      }

      // Update the document with new content
      const updatedDoc = await docModel.findByIdAndUpdate(
        docId,
        {
          previousContent: existingDoc.content, // Store the current content as 'previousContent'
          content: content, // Replace with new content
          lastUpdatedBy: response.data.userData.name, // Track who updated it
        },
        { new: true } // Return the updated document
      );

      return res.json({
        success: true,
        message: "Document updated successfully.",
        document: updatedDoc,
      });
    } catch (error) {
      console.error("Error during user lookup or document update:", error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing the request.",
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
});

router.post("/getDoc", async (req, res) => {
  try {
    const { docId, userId } = req.body;

    // Validate required fields
    if (!docId || !userId) {
      return res.status(400).send({
        success: false,
        message: "docId and userId are required.",
      });
    }

    try {
      // Check if the user exists
      const response = await axios.post("http://localhost:4001/users/findUserWithId", { userId });

      if (!response.data.success) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }

      // Fetch the document
      const doc = await docModel.findById(docId);

      if (doc) {
        return res.json({
          success: true,
          message: "Document fetched successfully.",
          doc: doc,
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "Invalid document.",
        });
      }
    } catch (error) {
      console.error("Error during user verification or document retrieval:", error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing the request.",
      });
    }
  } catch (error) {
    // console.error("Unexpected error:", error);
    return res.status(500).send({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
});

router.post("/deleteDoc", async (req, res) => {
  try {
    const { userId, docId } = req.body;

    // Validate required fields
    if (!userId || !docId) {
      return res.status(400).send({
        success: false,
        message: "userId and docId are required.",
      });
    }

    try {
      // Verify if the user exists
      const response = await axios.post("http://localhost:4001/users/findUserWithId", { userId });

      if (!response.data.success) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }

      // Attempt to delete the document
      const doc = await docModel.findByIdAndDelete(docId);

      if (doc) {
        return res.json({
          success: true,
          message: "Document deleted successfully.",
          deletedDoc: doc, // Optionally return the deleted document for confirmation
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "Document not found or already deleted.",
        });
      }
    } catch (error) {
      // console.error("Error during user verification or document deletion:", error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing the request.",
      });
    }
  } catch (error) {
    // console.error("Unexpected error:", error);
    return res.status(500).send({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
});

router.post("/getAllDocs", async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "userId is required.",
      });
    }

    try {
      // Verify if the user exists
      const response = await axios.post("http://localhost:4001/users/findUserWithId", { userId });

      if (!response.data.success) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }

      // Fetch documents where the user is listed as a collaborator
      const docs = await docModel.find({
        collaborators: userId, // Check if userId exists in the collaborators array
      });

      if (docs.length > 0) {
        return res.json({
          success: true,
          message: "Documents fetched successfully.",
          docs: docs,
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "No documents found for the specified user.",
        });
      }
    } catch (error) {
      // console.error("Error verifying user or fetching documents:", error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while processing the request.",
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
});

router.post("/getDocument", async (req,res)=>{
  let {docId} = req.body;
  
    let doc = await docModel.findById(docId);
    if(doc){
    return res.json({success:true,message:"Document fetched successfully",doc:doc});
    }
    else{
      return res.json({success:false,message:"Invalid document"})
    }
  
  
});


router.post("/updateDocument", async (req, res) => {
  const { docId, collaborators } = req.body;

  try {
    const document = await docModel.findByIdAndUpdate(
      docId,
      { collaborators },
      { new: true } // Return the updated document
    );

    if (!document) {
      return res.status(404).send({ success: false, message: "Document not found" });
    }

    res.status(200).send({ success: true, message: "Document updated successfully", doc: document });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send({ success: false, message: "Failed to update document" });
  }
});

module.exports = router;
