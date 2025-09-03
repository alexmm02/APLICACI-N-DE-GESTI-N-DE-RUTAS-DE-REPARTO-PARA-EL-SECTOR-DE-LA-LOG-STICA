function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 py-10 text-gray-800 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About FastRoute</h1>

        <p className="text-lg mb-4">
          FastRoute is a web application designed to optimize delivery routes and improve logistics efficiency. Our platform helps companies manage their packages, track delivery progress, and assign routes to employees in a smart and dynamic way.
        </p>

        <p className="text-lg mb-4">
          Whether you're a small business or a larger enterprise, FastRoute gives you the tools to make deliveries faster and smarter — by considering traffic, location, package priority, and other key factors.
        </p>

        <p className="text-lg mb-4">
          This project was developed as part of a final degree project in Computer Engineering. It reflects a strong interest in real-world problem solving using modern web technologies like React, Node.js, and PostgreSQL.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">📬 Contact the Administrator</h2>
        <p className="text-lg mb-2">
          If you have any questions, suggestions, or need support, feel free to reach out to the admin:
        </p>
        <ul className="text-lg list-disc list-inside">
          <li>Email: <a href="mailto:alejandro@example.com" className="text-blue-600 hover:underline">alejandro@example.com</a></li>
          <li>GitHub: <a href="https://github.com/alejandromartin" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/alejandromartin</a></li>
          <li>LinkedIn: <a href="https://linkedin.com/in/alejandromartin" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/in/alejandromartin</a></li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
