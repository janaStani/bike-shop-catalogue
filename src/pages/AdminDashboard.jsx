
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AdminProductForm from "./AdminProductForm.jsx";

function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Load products from Supabase
  async function loadProducts() {
    setProductsLoading(true);
    setError("");

    const { data, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (productsError) {
      console.error(productsError);
      setError("Производите не можеа да се вчитаат.");
    } else {
      setProducts(data || []);
    }

    setProductsLoading(false);
  }

  // Check admin permissions
  useEffect(() => {
    async function checkAdminAndLoadProducts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
        return;
      }

      setLoading(false);
      await loadProducts();
    }

    checkAdminAndLoadProducts();
  }, [navigate]);

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  // Delete product
  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Дали си сигурен/сигурна дека сакаш да го избришеш производот "${product.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);
      alert("Производот не можеше да се избрише.");
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== product.id)
    );
  }

  if (loading) {
    return <p>Се проверуваат дозволите...</p>;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">АДМИНИСТРАЦИЈА</span>
          <h1>Контролна табла</h1>
          <p>Управувај со производите во каталогот.</p>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
          Одјави се ↗
        </button>
      </header>

      <main className="admin-content">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>ВКУПНО ПРОИЗВОДИ</span>
            <strong>{products.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>ДОСТАПНИ ПРОИЗВОДИ</span>
            <strong>
              {products.filter((product) => product.available).length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>НЕДОСТАПНИ ПРОИЗВОДИ</span>
            <strong>
              {products.filter((product) => !product.available).length}
            </strong>
          </div>
        </div>

        <section className="admin-products-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">КАТАЛОГ</span>
              <h2>Сите производи</h2>
            </div>

            <button
              className="admin-add-button"
              onClick={() => setShowForm(true)}
            >
              + Додај производ
            </button>
          </div>

          {showForm && (
            <AdminProductForm
                product={editingProduct}
                onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
                }}
                onProductAdded={async () => {
                setShowForm(false);
                setEditingProduct(null);
                await loadProducts();
                }}
            />
            )}

          {productsLoading ? (
            <p className="admin-message">Се вчитуваат производите...</p>
          ) : error ? (
            <p className="admin-message admin-error">{error}</p>
          ) : products.length === 0 ? (
            <p className="admin-message">
              Сè уште нема додадено производи.
            </p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ПРОИЗВОД</th>
                    <th>КАТЕГОРИЈА</th>
                    <th>ЦЕНА</th>
                    <th>СТАТУС</th>
                    <th>АКЦИИ</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                            />
                          ) : (
                            <div className="admin-no-image">Нема слика</div>
                          )}

                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.brand || "Без бренд"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{product.category}</td>

                      <td>
                        {Number(product.price).toLocaleString("mk-MK")} €
                      </td>

                      <td>
                        <span
                          className={
                            product.available
                              ? "admin-status available"
                              : "admin-status unavailable"
                          }
                        >
                          {product.available ? "Достапен" : "Недостапен"}
                        </span>
                      </td>

                      <td>
                        <button
                            className="admin-edit-button"
                            onClick={() => {
                                setEditingProduct(product);
                                setShowForm(true);
                            }}
                            >
                            Уреди
                            </button>
                        <button
                          className="admin-delete-button"
                          onClick={() => handleDelete(product)}
                        >
                          Избриши
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
