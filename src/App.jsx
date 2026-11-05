
import { useState } from "react";
import "./index.css";
import shopLogo from "./assets/web logo.png";


const categories = [
  "All Products",
  "Mountain Bikes",
  "Electric Bikes",
  "Road Bikes",
  "Bike Parts",
  "Accessories",
];

const products = [
  {
    id: 1,
    name: "Mountain Bike Pro",
    brand: "Trek",
    category: "Mountain Bikes",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1544191696-15693072a7c7?w=700",
  },
  {
    id: 2,
    name: "Electric Mountain Bike",
    brand: "Specialized",
    category: "Electric Bikes",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=700",
  },
  {
    id: 3,
    name: "Road Bike Elite",
    brand: "Giant",
    category: "Road Bikes",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700",
  },
  {
    id: 4,
    name: "Bike Helmet",
    brand: "Abus",
    category: "Accessories",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1557803171-5c7b4e2f6b6a?w=700",
  },
];

function App() {
  const [activeCategory, setActiveCategory] =
    useState("All Products");

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All Products" ||
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
          <img src={shopLogo} alt="Bike shop logo"/>
        </a>

        <nav>
          <a href="#">Home</a>
          <a href="#catalogue">Catalogue</a>
          <a href="#categories">Categories</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#catalogue" className="nav-button">
          Explore bikes
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR RIDE. YOUR ADVENTURE.
            </span>

            <h1>
              Find your next
              <br />
              <span>great ride.</span>
            </h1>

            <p>
              Explore our collection of quality bikes,
              components and accessories. Everything
              you need for your next adventure.
            </p>

            <a href="#catalogue" className="primary-button">
              Explore catalogue →
            </a>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200"
              alt="Bicycle"
            />
            <div className="image-label">
              <span>BUILT FOR EVERY RIDE</span>
              <strong>Discover your next bike.</strong>
            </div>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE OUR RANGE</span>
              <h2>Shop by category</h2>
            </div>
            <p>
              Find the right equipment for every journey.
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
                {category}
                <span>↗</span>
              </button>
            ))}
          </div>
        </section>

        <section className="catalogue-section" id="catalogue">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR COLLECTION</span>
              <h2>Featured products</h2>
            </div>
            <p>
              Quality products for every type of cyclist.
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
                  {category}
                </button>
              ))}
            </div>

            <input
              type="search"
              placeholder="Search products..."
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
                    <span className="product-category">
                      {product.category}
                    </span>
                  </div>

                  <div className="product-info">
                    <span className="product-brand">
                      {product.brand}
                    </span>
                    <h3>{product.name}</h3>
                    <div className="product-bottom">
                      <strong>€{product.price.toLocaleString("en-US")}</strong>
                      <button
                        aria-label={`Enquire about ${product.name}`}
                        onClick={() =>
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Enquire ↗
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-message">
                No products found. Try another search.
              </p>
            )}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <span className="eyebrow">NEED SOME HELP?</span>
            <h2>Let's find the right bike for you.</h2>
            <p>
              Have questions about a product? Get in touch
              with our team.
            </p>
          </div>

          <a href="mailto:info@example.com" className="primary-button">
            Contact us →
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="#" className="logo-link">
          <img src={shopLogo} alt="Bike shop logo"/>
        </a>
        <p>© 2026 Bike Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
