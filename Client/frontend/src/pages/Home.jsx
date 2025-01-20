import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { BsPlusLg } from "react-icons/bs";
import Docs from '../components/Docs';
import { MdOutlineTitle } from "react-icons/md";
import { api_base_url } from '../Helper';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const createDoc = () => {
    if(title === "") {
      setError("Please enter title");
    }
    else{
      fetch(api_base_url + "/documents/createDoc",{
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docName: title,
          userId: localStorage.getItem("userId")
        })
      }).then(res=>res.json()).then(data => {
        if(data.success) {
          setIsCreateModelShow(false);
          navigate(`/createDocs/${data.docId}`)
        }
        else{
          setError(data.message);
        }
      })
    }
  }

  const getData = () => {
    fetch(api_base_url + "/documents/getAllDocs",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res=>res.json()).then(data => {
      setData(data.docs);
    })
  };

  useEffect(() => {
    getData();
  }, [])
  


  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between px-[100px]">
        <h3 className='mt-7 mb-3 text-3xl'>All Documents</h3>
        <button className="btnBlue" onClick={() => { 
          setIsCreateModelShow(true);
          document.getElementById('title').focus();
          }}><i><BsPlusLg /></i> Create New Document</button>
      </div>

      <div className='allDocs px-[100px] mt-4'>
        {
          data ? data.map((el,index)=>{
            return (
              <>
                 <Docs docs={el} docID={`doc-${index + 1}`}/>
              </>
            )
          }) : ""
        }
      </div>


      {
        isCreateModelShow ?
          <>
           <div className="createDocsModelCon fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center">
  <div className="createDocsModel p-6 bg-white rounded-lg shadow-md w-[90%] max-w-[400px]">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Create New Document</h3>

    {/* Input Container */}
    <div className="inputCon mb-4">
      <label htmlFor="title" className="block text-sm text-gray-500 mb-1">Title</label>
      <div className="inputBox flex items-center bg-gray-100 rounded-md px-3 py-2">
        <MdOutlineTitle className="text-gray-500 text-lg mr-2" />
        <input 
          onChange={(e) => setTitle(e.target.value)} 
          value={title} 
          type="text" 
          placeholder="Enter document title" 
          id="title" 
          name="title" 
          className="w-full bg-transparent outline-none text-gray-700"
          required 
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex items-center gap-3">
      <button 
        onClick={createDoc} 
        className="btnBlue w-1/2 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition duration-200"
      >
        Create
      </button>
      <button 
        onClick={() => setIsCreateModelShow(false)} 
        className="w-1/2 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

          </> : ""
      }

      
    </>
  )
}

export default Home