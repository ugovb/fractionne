"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/app");
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "#000",
      }}
    >
      <h1 style={{ marginBottom: "40px", fontSize: "24px", fontWeight: 400 }}>
        LOGIN
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="email" style={{ fontSize: "12px" }}>
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              background: "#111",
              border: "1px solid #333",
              color: "#fff",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="password" style={{ fontSize: "12px" }}>
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px",
              background: "#111",
              border: "1px solid #333",
              color: "#fff",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "14px",
            }}
          />
        </div>
        {error && (
          <p style={{ color: "#ff4444", fontSize: "12px" }}>{error}</p>
        )}
        <button
          type="submit"
          style={{
            padding: "14px",
            background: "#fff",
            color: "#000",
            border: "none",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "14px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          SIGN IN
        </button>
      </form>
    </div>
  );
}
