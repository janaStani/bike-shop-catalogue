import { useState } from "react";
import { supabase } from "../lib/supabase";

const categories = [
  "Планински велосипеди",
  "Електрични велосипеди",
  "Велосипеди за друмско возење",
  "Делови за велосипеди",
  "Додатоци",
];

function AdminProductForm({ onProductAdded, onCancel, product = null }) {
  const [name, setName] = useState(product?.name || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(product?.category || categories[0]);
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [description, setDescription] = useState(product?.description || "");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(product?.image_url || "");
    const [available, setAvailable] = useState(product?.available ?? true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    let finalImageUrl = imageUrl.trim() || null;

    // If a file was selected, upload it to Supabase
    if (image) {
    const fileExtension = image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, image);

    if (uploadError) {
        console.error(uploadError);
        setError("Сликата не можеше да се прикачи.");
        setLoading(false);
        return;
    }

    const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

    finalImageUrl = data.publicUrl;
    }

    // Save product details in the database
    // Product information to save
    const productData = {
        name,
        brand: brand || null,
        category,
        price: Number(price),
        description,
        image_url: finalImageUrl,
        available,
    };

    let saveError;

    // Update an existing product or insert a new one
    if (product) {
    const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);

    saveError = error;
    } else {
    const { error } = await supabase
        .from("products")
        .insert([productData]);

    saveError = error;
    }

    if (saveError) {
    console.error(saveError);
    setError("Производот не можеше да се зачува.");
    setLoading(false);
    return;
    }

    setLoading(false);
    onProductAdded();
}

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <div className="admin-form-heading">
        <div>
          <span className="admin-eyebrow">
            {product ? "УРЕДУВАЊЕ" : "НОВ ПРОИЗВОД"}
            </span>
            <h2>{product ? "Уреди производ" : "Додај производ"}</h2>
        </div>

        <button
          type="button"
          className="admin-cancel-button"
          onClick={onCancel}
        >
          ✕
        </button>
      </div>

      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Име на производ *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Пр. Trek Marlin 7"
            required
          />
        </div>

        <div className="admin-field">
          <label>Бренд</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Пр. Trek"
          />
        </div>

        <div className="admin-field">
          <label>Категорија *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label>Цена (€) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="899"
            required
          />
        </div>

        <div className="admin-field admin-field-full">
          <label>Опис</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Внеси опис на производот..."
            rows="4"
          />
        </div>

        <div className="admin-field admin-field-full">
            <label>Слика на производот</label>

            <label>Линк до слика</label>
            <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value) setImage(null);
                }}
                placeholder="https://example.com/bicycle.jpg"
                disabled={!!image}
            />

            <span className="admin-file-name">
                Или прикачи слика:
            </span>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                setImage(e.target.files[0] || null);
                if (e.target.files[0]) setImageUrl("");
                }}
                disabled={!!imageUrl.trim()}
            />

  {image && <span className="admin-file-name">{image.name}</span>}
</div>

        <div className="admin-field admin-field-full">
          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Производот е достапен
          </label>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-cancel-button"
          onClick={onCancel}
        >
          Откажи
        </button>

        <button
          type="submit"
          className="admin-save-button"
          disabled={loading}
        >
          {loading? "Се зачувува...": product? "Зачувај промени →": "Зачувај производ →"}
        </button>
      </div>
    </form>
  );
}

export default AdminProductForm;