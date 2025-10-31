// App.js
import React, { useEffect, useState } from "react";
import PhoneAuth from "./PhoneAuth";
import DocumentUpload from "./DocumentUpload";
import DocumentList from "./DocumentList";
import Profile from "./Profile";
import log from "loglevel";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

log.setLevel("info");

const isValidAadhaar = (val) => {
  // simple validation: 12 digits (no formatting). Adjust if you want spaces or dashes allowed.
  return /^\d{12}$/.test(val.trim());
};

const App = () => {
  const [user, setUser] = useState(null);
  const [aadhaar, setAadhaar] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state so login persists across refreshes
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          log.info("Auth state changed — user is signed in:", firebaseUser.uid);
        } else {
          setUser(null);
          log.info("Auth state changed — no user signed in");
        }
        setLoadingAuth(false);
      },
      (error) => {
        log.error("onAuthStateChanged error:", error);
        setLoadingAuth(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    // PhoneAuth will pass the user object after successful OTP verification.
    // We still rely on onAuthStateChanged to finalize state, but set here too for immediate UI update.
    setUser(loggedUser);
    log.info("User logged in (handleLoginSuccess):", loggedUser?.uid);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAadhaar("");
      log.info("User signed out successfully");
    } catch (err) {
      log.error("Error signing out:", err);
      alert("Failed to sign out. Check console for details.");
    }
  };

  if (loadingAuth) {
    return (
      <div style={styles.container}>
        <h3>Checking authentication...</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Sign in with Phone</h2>
        <PhoneAuth onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Logged in UI
  const aadhaarValid = aadhaar.trim() && isValidAadhaar(aadhaar);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Welcome</h2>
        <div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <p>
          <strong>User ID:</strong> {user.uid}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber || "Not available"}
        </p>

        <div style={styles.inputRow}>
          <label htmlFor="aadhaarInput">Aadhaar (12 digits):</label>
          <input
            id="aadhaarInput"
            type="text"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            placeholder="123412341234"
            style={styles.input}
          />
        </div>

        {!aadhaar ? (
          <p style={{ color: "#666" }}>
            Please enter your Aadhaar number to continue.
          </p>
        ) : !aadhaarValid ? (
          <p style={{ color: "crimson" }}>Aadhaar must be exactly 12 digits.</p>
        ) : null}
      </div>

      {aadhaarValid && (
        <>
          <DocumentUpload user={user} aadhaar={aadhaar} />
          <DocumentList user={user} aadhaar={aadhaar} />
          <Profile user={user} />
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 820,
    margin: "24px auto",
    padding: 20,
    fontFamily:
      "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  card: {
    padding: 14,
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    marginBottom: 18,
  },
  inputRow: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #ccc",
    minWidth: 220,
  },
};

export default App;
