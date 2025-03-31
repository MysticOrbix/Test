import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-youtube-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <svg className="w-8 h-8 text-youtube-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
              <span className="ml-2 text-lg font-semibold">Channel Analyzer</span>
            </Link>
            <p className="text-gray-400 mt-2">Generate insights and content ideas for your YouTube channel</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184A4.92 4.92 0 0011.85 8.09a13.94 13.94 0 01-10.12-5.12A4.92 4.92 0 002.8 12.58a4.869 4.869 0 01-2.23-.616v.06a4.917 4.917 0 003.95 4.83 4.86 4.86 0 01-2.23.085 4.924 4.924 0 004.6 3.42 9.863 9.863 0 01-7.29 2.04A13.906 13.906 0 007.5 24c9.05 0 14-7.5 14-14 0-.21 0-.42-.01-.63A10.012 10.012 0 0024 4.59z"></path>
              </svg>
            </a>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2V9h2v8z"></path>
              </svg>
            </button>
            <a href="mailto:info@channelanalyzer.com" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} YouTube Channel Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
