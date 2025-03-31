import { Link } from "wouter";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
          </svg>
          <h1 className="ml-2 text-xl font-semibold">Channel Analyzer</h1>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-youtube-gray hover:text-youtube-text">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-youtube-gray hover:text-youtube-text">
                About
              </Link>
            </li>
            <li>
              <Link href="/help" className="text-youtube-gray hover:text-youtube-text">
                Help
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
