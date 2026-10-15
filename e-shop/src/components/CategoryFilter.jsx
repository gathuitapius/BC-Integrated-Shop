export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <nav className="filters">
      {categories.map((c) => (
        <button key={c} className={c === selected ? 'chip active' : 'chip'} onClick={() => onSelect(c)}>
          {c}
        </button>
      ))}
    </nav>
  )
}
