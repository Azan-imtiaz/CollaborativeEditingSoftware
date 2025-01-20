
# Collaborative Editing System Using Microservice Architecture 

 Project Created By: Azan Imtiaz

Requirement:
Use Microservice Architecture




## Usecases of the Project

Users can create , store  and edit documents

Users can add collaborators to specific documents

Teams can collaborate and work on a document together 

A revert-to-previous-state functionality is available














## Features

User Management:
(User sign-up, login, logout, and retrieval of user data).

Document Management:
( Create, upload, retrieve, delete, and fetch all documents ).

Collaboration:
( Add collaborators to documents.
View collaboration history.Revert to Previous State)


## Features (Microservices)

- User Management:
  --> User sign-up, login, logout, and retrieval of user data
- Document Management: -->  Create, upload, retrieve, delete, and fetch all documents 
- Collaboration: --> Add collaborators to documents. View collaboration history.Revert to Previous State

## Technologies Used

- React (For Frontend)
- Tailwind Css (For Styling)
- Node.js And Express js (For Backend)
- Mongodb For Storing Records
- Axios for HTTP requests
- Morgan for request logging
- Cors for handling cross-origin resource sharing
- Cookie-Parser for cookie management
- Path for handling file paths

## API Endpoints

User Operations

POST /users/signUp — Sign up a new user.

POST /users/login — Log in an existing user.

POST /users/getUser — Retrieve user details.

POST /users/logout — Log out a user.

Document Operations

POST /documents/createDoc — Create a new document.

POST /documents/uploadDoc — Upload a document.

POST /documents/getDoc — Retrieve a specific document.

POST /documents/deleteDoc — Delete a document.

POST /documents/getAllDocs — Fetch all documents.

Collaboration

POST /collaboration/addcol — Add a collaborator to a document.

POST /collaboration/getHistory — Retrieve collaboration history for a document.


## Error Handling

The system includes robust error handling. If a request fails to reach a microservice, the server responds with:

- Error message

- Status code

- Details (if available)