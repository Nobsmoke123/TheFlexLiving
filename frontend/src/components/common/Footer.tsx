const Footer = () => {
  return (
    <footer className="bg-teal-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Join The Flex</h3>
            <p className="text-sm text-teal-200 mb-4">
              Sign up now to stay up to date on our latest news and updates.
              It's your first day!
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">The Flex</h3>
            <div className="text-sm space-y-2 text-teal-200">
              <div className="hover:text-white cursor-pointer">
                Professional property management
              </div>
              <div className="hover:text-white cursor-pointer">Blog</div>
              <div className="hover:text-white cursor-pointer">Careers</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="text-sm space-y-2 text-teal-200">
              <div className="hover:text-white cursor-pointer">
                Terms & Conditions
              </div>
              <div className="hover:text-white cursor-pointer">
                Privacy Policy
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Locations</h3>
            <div className="text-sm space-y-2 text-teal-200">
              <div className="hover:text-white cursor-pointer">LONDON</div>
              <div className="hover:text-white cursor-pointer">PARIS</div>
              <div className="hover:text-white cursor-pointer">ALGERIA</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="text-sm space-y-2 text-teal-200">
              <div>Support Numbers</div>
              <div>United Kingdom: +44 7774 1008</div>
              <div>Algeria: +213 561 64 79</div>
              <div>France: +33 6 60 67 79</div>
              <div className="hover:text-white cursor-pointer">
                info@theflex.global
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-teal-600 mt-8 pt-8 text-center text-sm text-teal-200">
          © {new Date().getFullYear()} The Flex. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
