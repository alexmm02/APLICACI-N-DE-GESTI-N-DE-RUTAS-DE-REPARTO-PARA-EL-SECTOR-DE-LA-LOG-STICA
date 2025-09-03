export function Card({ children, className }) {
  return (
    <div className={`bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
}

export default Card;
