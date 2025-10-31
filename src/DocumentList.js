import React, { useEffect, useState } from "react";
import { firestore } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import log from "loglevel";

const DocumentList = ({ user, aadhaar }) => {
  const [documents, setDocuments] = useState([]);
  const [shareInputs, setShareInputs] = useState({});

  useEffect(() => {
    const q = query(
      collection(firestore, "documents"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    });
    return () => unsubscribe();
  }, [user]);

  const shareWithFamily = async (docId) => {
    const shareAadhaar = shareInputs[docId];
    if (!shareAadhaar) return alert("Enter Aadhaar number to share with");

    try {
      const docRef = doc(firestore, "documents", docId);
      await updateDoc(docRef, {
        sharedWith: arrayUnion(shareAadhaar),
      });
      log.info(`Document ${docId} shared with Aadhaar ${shareAadhaar}`);
      alert("Shared successfully");
      setShareInputs((prev) => ({ ...prev, [docId]: "" }));
    } catch (error) {
      log.error("Error sharing document", error);
      alert("Failed to share");
    }
  };

  return (
    <div>
      <h3>Your Documents</h3>
      {documents.length === 0 && <p>No documents uploaded yet.</p>}
      {documents.map((doc) => (
        <div key={doc.id} style={{ border: "1px solid gray", margin: "10px" }}>
          <p>
            <strong>Name:</strong> {doc.fileName}
          </p>
          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
          <div>
            <input
              type="text"
              placeholder="Share with Aadhaar"
              value={shareInputs[doc.id] || ""}
              onChange={(e) =>
                setShareInputs({ ...shareInputs, [doc.id]: e.target.value })
              }
            />
            <button onClick={() => shareWithFamily(doc.id)}>Share</button>
            <p>Shared with: {doc.sharedWith?.join(", ") || "None"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
