
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import shopLogo from "./assets/web logo.png";
import { supabase } from "./lib/supabase";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const categories = [
  "Сите производи",
  "Планински велосипеди",
  "Електрични велосипеди",
  "Велосипеди за друмско возење",
  "Делови за велосипеди",
  "Додатоци",
];



function HomePage() {
  const [activeCategory, setActiveCategory] =
    useState("Сите производи");

  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      setError("Не може да се вчитаат производите.");
    } else {
      setProducts(data);
    }

    setLoading(false);
  }

  fetchProducts();
}, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Сите производи" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      <header className="navbar">
        <a href="#" className="logo-link" onClick={() => setMenuOpen(false)}>
          <img src={shopLogo} alt="Лого на продавницата" />
        </a>

        <nav className={menuOpen ? "mobile-nav open" : "mobile-nav"}>
          <a href="#" onClick={() => setMenuOpen(false)}>
            <span className="condensed-text">Почетна</span>
          </a>

          <a href="#catalogue" onClick={() => setMenuOpen(false)}>
            <span className="condensed-text">Производи</span>
          </a>

          <a href="#categories" onClick={() => setMenuOpen(false)}>
            <span className="condensed-text">Категории</span>
          </a>

          <a href="#contact" onClick={() => setMenuOpen(false)}>
            <span className="condensed-text">Контакт</span>
          </a>
        </nav>

        <a href="#catalogue" className="nav-button">
          <span className="condensed-text">Разгледај велосипеди</span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Отвори мени"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow condensed-text">
              ТВОЈ ВЕЛОСИПЕД. ТВОЈАТА АВАНТУРА.
            </span>

            <h1>
              <span className="condensed-text">
                Пронајди го
                <br />
                <span className="highlight">вистинскиот велосипед.</span>
              </span>
            </h1>

            <p>
              <span className="condensed-text">
                Разгледај ја нашата понуда на квалитетни
                велосипеди, делови и додатоци. Сè што ти
                е потребно за твојата следна авантура.
              </span>
            </p>

            <a href="#catalogue" className="primary-button">
              <span className="condensed-text">
                Разгледај ги понудите →
              </span>
            </a>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1535369643553-a33e0d1ac81d?q=80&w=1218&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Велосипед"
            />

            <div className="image-label">
              <span className="condensed-text">
                СОЗДАДЕН ЗА СЕКОЕ ВОЗЕЊЕ
              </span>
              <strong className="condensed-text">
                Пронајди го твојот следен велосипед.
              </strong>
            </div>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow condensed-text">
                ИСТРАЖИ ЈА НАШАТА ПОНУДА
              </span>
              <h2>
                <span className="condensed-text">
                  Купувај по категорија
                </span>
              </h2>
            </div>

            <p>
              <span className="condensed-text">
                Пронајди ја вистинската опрема за секое возење.
              </span>
            </p>
          </div>

          <div className="category-list">
            {categories.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  document
                    .getElementById("catalogue")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="category-button"
              >
                <span className="condensed-text">{category}</span>
                <span>↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="catalogue-section" id="catalogue">
          <div className="section-heading">
            <div>
              <span className="eyebrow condensed-text">
                НАШАТА ПОНУДА
              </span>
              <h2>
                <span className="condensed-text">
                  Издвоени производи
                </span>
              </h2>
            </div>

            <p>
              <span className="condensed-text">
                Квалитетни производи за секој велосипедист.
              </span>
            </p>
          </div>

          <div className="catalogue-controls">
            <div className="filters">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={
                    activeCategory === category
                      ? "filter-button active"
                      : "filter-button"
                  }
                >
                  <span className="condensed-text">
                    {category}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="search"
              placeholder="Пребарај производи..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="search-input"
            />
          </div>

          <div className="product-grid">
            {loading ? (
              <p>Се вчитуваат производите...</p>
            ) : error ? (
              <p>{error}</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={product.image_url} alt={product.name} />

                    <span className="product-category condensed-text">
                      {product.category}
                    </span>
                  </div>

                  <div className="product-info">
                    <span className="product-brand condensed-text">
                      {product.brand}
                    </span>

                    <h3>
                      <span className="condensed-text">
                        {product.name}
                      </span>
                    </h3>

                    <div className="product-bottom">
                      <strong className="condensed-text">
                        {Number(product.price).toLocaleString("mk-MK")} €
                      </strong>

                      <button
                        aria-label={`Прашај за ${product.name}`}
                        onClick={() =>
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <span className="condensed-text">
                          Прашај ↗
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-message">
                <span className="condensed-text">
                  Нема пронајдени производи. Обиди се со друго пребарување.
                </span>
              </p>
            )}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <span className="eyebrow condensed-text">
              ТИ ТРЕБА ПОМОШ?
            </span>

            <h2>
              <span className="condensed-text">
                Да го пронајдеме вистинскиот велосипед за тебе.
              </span>
            </h2>

            <p>
              <span className="condensed-text">
                Имаш прашања за некој производ? Контактирај нè.
              </span>
            </p>
          </div>

          <a href="mailto:info@example.com" className="primary-button">
            <span className="condensed-text">
              Контактирај нè →
            </span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="#" className="logo-link">
          <img src={shopLogo} alt="Лого на продавницата" />
        </a>

        <p>
          <span className="condensed-text">
            © 2026 Вози Си Точак. All rights reserved.
          </span>
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
