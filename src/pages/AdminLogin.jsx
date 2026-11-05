import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "../index.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Погрешна е-пошта или лозинка.");
    } else {
        navigate("/admin");
    }

    setLoading(false);
  }

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h1>Администраторска најава</h1>

        <p>Најавете се за да ги управувате производите.</p>

        <label htmlFor="email">Е-пошта</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Внесете е-пошта"
          required
        />

        <label htmlFor="password">Лозинка</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Внесете лозинка"
          required
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Се најавувате..." : "Најави се"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;