import React, { useState, useEffect } from "react";
import "../assets/styles/loadingIcon.css";

const UserProfile = () => {
  const [userData, setUserData] = useState("");



  return (
    <div style={{ maxWidth: "1000px", margin: "auto", marginTop: "50px", padding: "20px", borderRadius: "8px", boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.2)", backgroundColor: "#fff" }}>
      <h2 style={{ marginBottom: "20px", color: "#1976D2" }}>Update Profile</h2>
        <>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>CIN:</span>
            <span style={{ marginLeft: "5px" }}>{userData.CIN}</span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>First Name:</span>
          
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Last Name:</span>
           
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Email:</span>
           
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Password:</span>
            
          </div>
          <button
            type="submit"
            className="btn btn-dark me-3"
            style={{ backgroundColor: "#007BFF", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
            
          >
            Save
          </button>
        </>
      
    </div>
  );
};

export default UserProfile;
