import { useReviews } from "../../context/useReview";

const Header = () => {
  const { setCurrentView } = useReviews();

  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setCurrentView("listings")}
            className="text-lg font-semibold hover:text-teal-600 transition-colors"
          >
            The Flex
          </button>
          <div className="hidden md:flex space-x-6 text-sm">
            <button
              onClick={() => setCurrentView("listings")}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Properties
            </button>
            <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
              About Us
            </span>
            <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
              Careers
            </span>
            <span className="text-gray-600 hover:text-gray-900 cursor-pointer">
              Contact
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-sm text-teal-600 hover:text-teal-700 border border-teal-600 px-3 py-1 rounded transition-colors"
          >
            Manager Dashboard
          </button>
          <div className="text-sm text-gray-600">English</div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
