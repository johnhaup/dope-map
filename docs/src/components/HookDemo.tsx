import { useDopeMap } from "@johnhaup/dope-map/react";
import { useState } from "react";

const SNIPPET = `import { useDopeMap } from "@johnhaup/dope-map/react";

function Products() {
  // one DopeMap per component, cleared on unmount
  const cache = useDopeMap<Product[]>();
  const [filters, setFilters] = useState({ category: "shoes", sort: "price" });

  let products = cache.get(filters);
  if (!products) {
    products = search(filters); // the expensive part
    cache.set(filters, products);
  }
  // ...
}`;

const CATEGORIES = ["shoes", "hats", "socks"];
const SORTS = ["price", "rating"];

function Products() {
  const cache = useDopeMap<string>();
  const [filters, setFilters] = useState<{ category: string; sort: string }>({
    category: "shoes",
    sort: "price",
  });
  const [stats, setStats] = useState({ hits: 0, misses: 0 });

  // Every click builds a brand new filters object, fields in either order.
  const choose = (category: string, sort: string) => {
    const next = Math.random() < 0.5 ? { category, sort } : { sort, category };
    const cached = cache.has(next);
    if (!cached) cache.set(next, `${category} by ${sort}`);
    setStats((s) => (cached ? { ...s, hits: s.hits + 1 } : { ...s, misses: s.misses + 1 }));
    setFilters(next);
  };

  return (
    <div className="hook-live">
      <div className="hook-options" role="group" aria-label="Category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${filters.category === c ? "active" : ""}`}
            onClick={() => choose(c, filters.sort)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="hook-options" role="group" aria-label="Sort">
        {SORTS.map((s) => (
          <button
            key={s}
            className={`chip ${filters.sort === s ? "active" : ""}`}
            onClick={() => choose(filters.category, s)}
          >
            by {s}
          </button>
        ))}
      </div>
      <code className="hook-key">cache key: {JSON.stringify(filters)}</code>
      <dl className="hook-stats">
        <div>
          <dt>searches run</dt>
          <dd>{stats.misses}</dd>
        </div>
        <div>
          <dt>served from cache</dt>
          <dd className="hit">{stats.hits}</dd>
        </div>
        <div>
          <dt>cache size</dt>
          <dd>{cache.size}</dd>
        </div>
      </dl>
    </div>
  );
}

export function HookDemo() {
  const [mounted, setMounted] = useState(true);
  const [mounts, setMounts] = useState(0);

  return (
    <section className="section" aria-labelledby="hook-title">
      <div className="section-head">
        <h2 id="hook-title">useDopeMap</h2>
        <p>
          A React hook from <code>@johnhaup/dope-map/react</code>. It keeps one
          DopeMap for the life of a component and clears it on unmount, so a
          cache never outlives the screen that uses it.
        </p>
      </div>
      <div className="hook">
        <pre className="code-block">
          <code>{SNIPPET}</code>
        </pre>
        <div className="hook-demo">
          {mounted ? <Products key={mounts} /> : <p className="hint">Unmounted. The cache was cleared.</p>}
          <button
            className="button"
            onClick={() => {
              if (!mounted) setMounts((m) => m + 1);
              setMounted(!mounted);
            }}
          >
            {mounted ? "unmount" : "mount again"}
          </button>
        </div>
      </div>
    </section>
  );
}
