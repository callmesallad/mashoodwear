import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetDashboard } from "../../api/adminClient";

/**
 * Admin dashboard with stock widgets and recent products.
 */
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminGetDashboard()
      .then((response) => setStats(response.stats))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="admin-error">Could not load dashboard</p>;
  }

  if (!stats) {
    return <p>Loading dashboard…</p>;
  }

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Products</span>
          <strong>{stats.totalProducts}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Categories</span>
          <strong>{stats.totalCategories}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Active collections</span>
          <strong>{stats.activeCollections}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Out of stock</span>
          <strong>{stats.outOfStockCount}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Low stock</span>
          <strong>{stats.lowStockCount}</strong>
        </div>
      </div>

      <h2 className="admin-section-title">Recent updates</h2>
      <ul className="admin-recent-list">
        {stats.recentProducts.map((product) => (
          <li key={product.id}>
            <Link to={`/admin/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
