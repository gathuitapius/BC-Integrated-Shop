export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search products…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
