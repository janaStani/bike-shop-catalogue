
import { useState } from "react";
import "./index.css";
import shopLogo from "./assets/web logo.png";

const categories = [
  "Сите производи",
  "Планински велосипеди",
  "Електрични велосипеди",
  "Велосипеди за друмско возење",
  "Делови за велосипеди",
  "Додатоци",
];

const products = [
  {
    id: 1,
    name: "Mountain Bike Pro",
    brand: "Trek",
    category: "Планински велосипеди",
    price: 899,
    image:
      "https://res.cloudinary.com/trekbikes/image/upload/f_auto,c_fill,ar_4:3,w_1080,q_auto/FuelEX98XTDI2-27-79594-B-Primary",
  },
  {
    id: 2,
    name: "Electric Mountain Bike",
    brand: "Specialized",
    category: "Електрични велосипеди",
    price: 2499,
    image:
      "https://resources.specialized.com/media-libraries/mleF1gIlpsGs/images/containers/3HEcaaAbkqZteDw67FwMUSTCVxm/95727-10_LEVO-R-PRO-REDBLKCMLN-BLK-DLMMET-S2--_HERO-PDP.webp?bg=f1f1f1&w=2000&h=1125&fit=fill&crop=focalpoint&q=75",
  },
  {
    id: 3,
    name: "Road Bike Elite",
    brand: "Giant",
    category: "Велосипеди за друмско возење",
    price: 1299,
    image:
      "https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_850%2Cq_80/gnfkbuoldekzx6mzwsvw/MY27PropelAdvanced1_ColorACarbon.jpg",
  },
  {
    id: 4,
    name: "Bike Helmet",
    brand: "Abus",
    category: "Додатоци",
    price: 79,
    image:
      "https://c1.abus.com/akg-pim-assets-01/Mobile%20Sicherheit/Helme/Road/Macator%20MIPS/Kat2022/89224_Macator%20MIPS_polar%20white_side_abus_640.png",
  },
];

function App() {
  const [activeCategory, setActiveCategory] =
    useState("Сите производи");

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Сите производи" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      <header className="navbar">
        <a href="#" className="logo-link">
          <img src={shopLogo} alt="Лого на продавницата" />
        </a>

        <nav>
          <a href="#"><span className="condensed-text">Почетна</span></a>
          <a href="#catalogue"><span className="condensed-text">Производи</span></a>
          <a href="#categories"><span className="condensed-text">Категории</span></a>
          <a href="#contact"><span className="condensed-text">Контакт</span></a>
        </nav>

        <a href="#catalogue" className="nav-button">
          <span className="condensed-text">Разгледај велосипеди</span>
        </a>
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />

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
                        {product.price.toLocaleString("mk-MK")} €
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
            © 2026 Вози Си Точак. Сите права се задржани.
          </span>
        </p>
      </footer>
    </div>
  );
}

export default App;
