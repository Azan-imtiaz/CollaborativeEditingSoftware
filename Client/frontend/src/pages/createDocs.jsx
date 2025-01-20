import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from "jodit-pro-react";
import { api_base_url } from '../Helper';

const createDocs = () => {
  let { docsId } = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState("");
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [history1,setHistory]=useState({
    lastUpdate: null,
    lastUpdatedBy: null,
    previousContent: null
  })

  // Static history data (single object)

  const updateDoc = () => {
    fetch(api_base_url + "/documents/uploadDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
        content: content,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setError("");
        }
      });
  };

  const getContent = () => {
    fetch(api_base_url + "/documents/getDoc", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setContent(data.doc.content);
        }
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
        setError("An error occurred while fetching the document.");
      });
  };

  const saveChanges = () => {
    updateDoc();
    setIsDirty(false); // Reset dirty state after saving
  };

  const addCollaborator = () => {
    if (!collaboratorEmail) {
      alert("Please enter an email address.");
      return;
    }

    fetch(api_base_url + "/collaboration/addcol", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        docId: docsId,
        collaboratorEmail: collaboratorEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Collaborator added successfully!");
          setCollaboratorEmail(""); // Clear the input field
        } else {
          alert("Unable to add collaborator. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding collaborator:", error);
        alert("An error occurred while adding the collaborator.");
      });
  };

  useEffect(() => {
    getContent(); // Fetch content when component mounts
  }, []);


  const getHistory = () => {
    return fetch(api_base_url + "/collaboration/getHistory", { // Add `return` here
      mode: "cors",
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        docId: docsId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          setError(data.message);
        } else {
          setError("");
        }
        return data; // Ensure the data is returned
      });
  };
  


async function  handleHistoryClick(){
  setShowHistory(true)
const d = await getHistory();
console.log(d)
setHistory(d.doc);
}
function handleRevert(){
  
  setContent(history1.previousContent);
  
  updateDoc();
  setShowHistory(false)
   
}

  return (
    <>
      <Navbar />
      <div className="px-[100px] mt-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Document Editor</h1>
          <button
            onClick={() => handleHistoryClick()}
            className="px-5 py-2 bg-green-500 text-white rounded-lg shadow-md transition-all hover:bg-green-600 hover:shadow-lg"
          >
            Show History
          </button>
        </div>

        {/* Collaborator Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <input
              type="email"
              value={collaboratorEmail}
              onChange={(e) => setCollaboratorEmail(e.target.value)}
              placeholder="Enter collaborator's email"
              className="border border-gray-300 rounded-lg px-3 py-2 w-[250px] outline-none"
            />
            <button
              onClick={addCollaborator}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
            >
              + Add Collaborator
            </button>
          </div>
        </div>

        {/* Save Changes Warning */}
        {isDirty && (
          <div className="text-red-500 text-sm mb-3">
            Warning: You have unsaved changes. If you leave without saving, your data will be lost.
          </div>
        )}

        {/* Editor Section */}
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1}
          onChange={(e) => {
            setContent(e);
            setIsDirty(true); // Mark as dirty when content changes
          }}
        />

        {/* Save Button */}
        <button
          onClick={saveChanges}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md mt-4 transition-all hover:bg-blue-600 hover:shadow-lg"
        >
          Save Changes
        </button>

        {/* History Modal */}

        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated By:</span>
                  <span className="font-semibold text-gray-800">{ history1.lastUpdatedBy }</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Update on:</span>
                  <span className="font-semibold text-gray-800">
  {new Date(history1.lastUpdate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</span>

                </div>
                <div className="flex justify-between gap-4 mt-4">
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all " onClick={handleRevert}>
                    Revert to Previous State
                  </button>
                  {/* <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                    Remove
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default createDocs;






