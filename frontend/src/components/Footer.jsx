const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-400 border-t border-zinc-800 py-10 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">About</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Corporate Information</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Help</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:underline">Payments</a></li>
            <li><a href="#" className="hover:underline">Shipping</a></li>
            <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Consumer Policy</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:underline">Return Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Use</a></li>
            <li><a href="#" className="hover:underline">Security</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Social</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>© 2026 Flipkart-Clone. All rights reserved. Created with ♥ by Antigravity.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
