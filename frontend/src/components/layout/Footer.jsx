const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand 
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent italic mb-4">
              FOODFEST
            </h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Experience the best culinary delights from top chefs. Fresh ingredients, unforgettable flavors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary hover:bg-orange-50 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary hover:bg-orange-50 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary hover:bg-orange-50 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links 
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/menu" className="text-slate-500 hover:text-primary transition-colors">Menu</a></li>
              <li><a href="/about" className="text-slate-500 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/chefs" className="text-slate-500 hover:text-primary transition-colors">Our Chefs</a></li>
              <li><a href="/events" className="text-slate-500 hover:text-primary transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Support 
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="/faq" className="text-slate-500 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-slate-500 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="/terms" className="text-slate-500 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-slate-500 hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact 
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500">
                <MapPin className="w-5 h-5 stroke-current text-primary shrink-0 mt-0.5" />
                <span>123 Culinary Avenue,<br />Foodie City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Phone className="w-5 h-5 stroke-current text-primary shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Mail className="w-5 h-5 stroke-current text-primary shrink-0" />
                <span>hello@foodfest.com</span>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="border-t border-slate-100 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} FoodFest. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0">
            Made with <span className="text-red-500">♥</span> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
