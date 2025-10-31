import React from "react";

const Profile = ({ user }) => {
  return (
    <div>
      <h3>My Profile</h3>
      <p>User ID: {user.uid}</p>
      <p>Phone: {user.phoneNumber || "Not available"}</p>
      {/* Aadhaar entry could be added here */}
    </div>
  );
};

export default Profile;
