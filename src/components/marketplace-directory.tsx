"use client";
import { useState } from "react";
import { Icon } from "./icon";
import { projectCategories } from "@/lib/community-schema";
import type { Product } from "@/server/community";
export function MarketplaceDirectory({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All"),
    [query, setQuery] = useState("");
  const matches = products.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.name} ${item.description} ${item.builder}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="filter-bar">
        <div className="form-field">
          <label htmlFor="product-category">Explore a category</label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {["All", ...projectCategories].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <label className="filter-search">
          <Icon name="search" />
          <span className="sr-only">Search products</span>
          <input
            placeholder="Find something useful…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p className="page-note" role="status">
        {matches.length} {matches.length === 1 ? "product" : "products"}
      </p>
      <div className="product-grid">
        {matches.map((product) => (
          <article key={product.id} className="product-card">
            <span className="badge">{product.category}</span>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="product-byline">By {product.builder}</div>
            <a
              className="text-link"
              href={product.url}
              target="_blank"
              rel="noreferrer"
            >
              Explore the project <Icon name="diagonal" />
            </a>
          </article>
        ))}
      </div>
      {!matches.length && (
        <div className="archive-empty">
          <h2>No projects match that search.</h2>
          <button
            className="button"
            style={{ marginTop: 22 }}
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
