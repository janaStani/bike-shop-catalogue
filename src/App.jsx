
import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import shopLogo from "./assets/web logo.png";
import { supabase } from "./lib/supabase";
import { imageSrc } from "./lib/imageUrl";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProductModal from "./components/ProductModal.jsx";

const SHOP = {
  phone: "+38975437572",
  phoneDisplay: "+389 75 437 572",
  address: "Трајко Бошковски - Тарцан бр.6, Ѓорче Петров, 1000 Скопје",
  hours: "",
  mapsUrl:
    "https://www.google.com/maps/place/Used+Bike+Macedonia/@42.0059342,21.3366672,17z/data=!3m1!4b1!4m6!3m5!1s0x1354132726285d71:0x68531133cea6ca58!8m2!3d42.0059342!4d21.3392421!16s%2Fg%2F11hzxqgp7v",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=42.0059342,21.3392421",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=42.0059342,21.3392421&z=16&output=embed",
};

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
  const filtersRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

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

  useEffect(() => {
    const bar = filtersRef.current;
    const active = bar?.querySelector(".filter-button.active");
    if (!bar || !active) return;

    bar.scrollTo({
      left: active.offsetLeft - (bar.clientWidth - active.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeCategory]);

  const isAvailable = (product) => product.available !== false;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Сите производи" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  filteredProducts.sort(
    (a, b) => Number(isAvailable(b)) - Number(isAvailable(a))
  );

  const selectedIndex = filteredProducts.findIndex(
    (product) => product.id === selectedId
  );
  const selectedProduct =
    selectedIndex >= 0 ? filteredProducts[selectedIndex] : null;
  const productCount = filteredProducts.length;

  const closeProduct = useCallback(() => setSelectedId(null), []);

  const showPrevProduct = useCallback(() => {
    if (selectedIndex < 0 || productCount === 0) return;
    const prev = (selectedIndex - 1 + productCount) % productCount;
    setSelectedId(filteredProducts[prev].id);
  }, [selectedIndex, productCount, filteredProducts]);

  const showNextProduct = useCallback(() => {
    if (selectedIndex < 0 || productCount === 0) return;
    const next = (selectedIndex + 1) % productCount;
    setSelectedId(filteredProducts[next].id);
  }, [selectedIndex, productCount, filteredProducts]);

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

          <a href="#categories" onClick={() => setMenuOpen(false)}>
            <span className="condensed-text">Категории</span>
          </a>

          <a href="#catalogue" onClick={() => setMenuOpen(false)}>
            <span className="condensed-text">Производи</span>
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
          aria-label={menuOpen ? "Затвори мени" : "Отвори мени"}
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
            {categories.map((category) => (
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
            <div className="filters" ref={filtersRef}>
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
              aria-label="Пребарај производи"
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
                <article
                  className={
                    isAvailable(product)
                      ? "product-card"
                      : "product-card is-sold-out"
                  }
                  key={product.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Погледни ${product.name}`}
                  onClick={() => setSelectedId(product.id)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(product.id);
                    }
                  }}
                >
                  <div className="product-image">
                    {product.image_url ? (
                      <img
                        src={imageSrc(product.image_url)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="product-image-empty">Нема слика</div>
                    )}

                    <span className="product-category condensed-text">
                      {product.category}
                    </span>

                    {!isAvailable(product) && (
                      <span className="product-sold-out">Распродадено</span>
                    )}
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
                        onClick={(event) => {
                          event.stopPropagation();
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
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

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            index={selectedIndex}
            total={productCount}
            phone={SHOP.phone}
            phoneDisplay={SHOP.phoneDisplay}
            onClose={closeProduct}
            onPrev={showPrevProduct}
            onNext={showNextProduct}
          />
        )}

        <section className="contact-section" id="contact">
          <div className="contact-info">
            <span className="eyebrow">ТИ ТРЕБА ПОМОШ?</span>

            <h2>Да го пронајдеме вистинскиот велосипед за тебе.</h2>

            <p>Имаш прашања за некој производ? Контактирај нè.</p>

            <dl className="contact-details">
              <div>
                <dt>Телефон</dt>
                <dd>
                  <a href={`tel:${SHOP.phone}`}>{SHOP.phoneDisplay}</a>
                </dd>
              </div>

              {SHOP.address && (
                <div>
                  <dt>Адреса</dt>
                  <dd>{SHOP.address}</dd>
                </div>
              )}

              {SHOP.hours && (
                <div>
                  <dt>Работно време</dt>
                  <dd>{SHOP.hours}</dd>
                </div>
              )}
            </dl>

            <div className="contact-actions">
              <a href={`tel:${SHOP.phone}`} className="primary-button">
                Повикај →
              </a>

              <a
                href={SHOP.directionsUrl}
                className="secondary-button"
                target="_blank"
                rel="noreferrer"
              >
                Насоки →
              </a>
            </div>
          </div>

          <div className="contact-map">
            <iframe
              title="Локација на продавницата"
              src={SHOP.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="#" className="logo-link">
          <img src={shopLogo} alt="Лого на продавницата" />
        </a>

        <p>
          <span className="condensed-text">
            © 2026 Вози Си Точак. Сите права се задржани.
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
