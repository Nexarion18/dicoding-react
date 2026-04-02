function ThreadFilter ({ categories = [], value, onChange }) {
  return (
    <div className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <label htmlFor="category-filter" style={{ fontWeight: 600 }}>
        Filter Kategori
      </label>
      <select
        id="category-filter"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      >
        <option value="all">Semua</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ThreadFilter
