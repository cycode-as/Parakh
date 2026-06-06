export default function Card({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-card
        ${hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${padding ? 'p-6' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
