import React, { useState } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import log from "loglevel";

const PhoneAuth = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const setupRecaptcha = () => {
    // remove stale verifier if exists
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {}
      window.recaptchaVerifier = null;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal", // visible while testing
        callback: (response) => log.info("reCAPTCHA solved", response),
      },
      auth // ✅ correct, pass auth as 3rd argument
    );
  };

  const requestOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Enter phone number with country code, e.g., +91XXXXXXXXXX");
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      log.info("OTP sent to", phone);
      alert("OTP sent!");
    } catch (err) {
      console.error("OTP request failed:", err);
      alert("OTP request failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      onLoginSuccess(result.user);
      log.info("User signed in:", result.user.uid);
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      {!confirmationResult ? (
        <>
          <h3>Login with Phone</h3>
          <input
            type="tel"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: 8, marginBottom: 10 }}
          />
          <br />
          <button onClick={requestOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <div id="recaptcha-container" style={{ marginTop: 15 }}></div>
        </>
      ) : (
        <>
          <h3>Enter OTP</h3>
          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: 8, marginBottom: 10 }}
          />
          <br />
          <button onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneAuth;
