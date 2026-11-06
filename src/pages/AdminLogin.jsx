
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import shopLogo from "../assets/web logo.png";
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
    <div className="login-page">
      <div className="login-decoration">
        <span className="login-label">BIKE SHOP / ADMINISTRATION</span>
        <div className="login-decoration-content">
          <span>УПРАВУВАЈ СО</span>
          <h1>ТВОЈОТ<br />КАТАЛОГ<span>.</span></h1>
          <p>Административен пристап за управување со производите.</p>
        </div>
        <span className="login-footer-text">BIKE SHOP MANAGEMENT SYSTEM</span>
      </div>

      <div className="login-main">
        <div className="login-card">
          <Link to="/" className="login-logo">
            <img src={shopLogo} alt="Bike shop logo" />
          </Link>

          <div className="login-heading">
            <span className="admin-eyebrow">АДМИНИСТРАЦИЈА</span>
            <h2>Добредојдовте</h2>
            <p>Најавете се за да продолжите.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Е-ПОШТА</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Внесете е-пошта"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">ЛОЗИНКА</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Внесете лозинка"
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "СЕ НАЈАВУВАТЕ..." : "НАЈАВИ СЕ"}
              <span>→</span>
            </button>
          </form>

          <Link to="/" className="login-back">
            ← Назад кон продавницата
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
