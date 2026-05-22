"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

  try {

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // RECARGA COMPLETA
    window.location.href = "/dashboard";

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-black p-6 rounded shadow w-80">

        <h1 className="text-xl font-bold mb-4 text-white">
          Login
        </h1>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-4 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full p-2 rounded cursor-pointer"
        >
          Entrar
        </button>

      </div>

    </div>
  );
}