const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <span className="text-2xl font-extrabold text-white">Auspify<span className="text-emerald-400">Store</span></span>
          <p className="text-slate-500 text-sm mt-2">© 2026 Auspify Technologies. All rights reserved.</p>
        </div>
        <div className="flex space-x-6 text-slate-400 text-sm">
          <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;