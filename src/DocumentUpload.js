import React, { useState } from "react";
import { storage, firestore } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import log from "loglevel";

const DocumentUpload = ({ user, aadhaar }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = () => {
    if (!file) {
      alert("Select a file first");
      return;
    }
    const storageRef = ref(storage, `documents/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(pct);
      },
      (error) => {
        log.error("Upload error:", error);
        alert("Upload failed");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(firestore, "documents"), {
          userId: user.uid,
          aadhaarNumber: aadhaar,
          fileName: file.name,
          fileUrl: downloadURL,
          sharedWith: [], // array of family Aadhaar numbers this doc is shared with
          createdAt: serverTimestamp(),
        });
        log.info(`Document uploaded by user ${user.uid}`);
        alert("Upload successful");
        setFile(null);
        setProgress(0);
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload Document</button>
      {progress > 0 && <p>Upload Progress: {progress.toFixed(2)}%</p>}
    </div>
  );
};

export default DocumentUpload;
