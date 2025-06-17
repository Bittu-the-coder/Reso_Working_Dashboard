import React from "react";
import { FiFileText, FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row mb-12">
          {/* Left side - Image */}
          <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden rounded-2xl mb-6 md:mb-0 md:mr-8">
            <div className="absolute inset-0 bg-black/30 z-10 rounded-2xl"></div>
            <img
              src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Team working together"
              className="w-full h-full object-cover object-center rounded-2xl"
            />
            <div className="absolute bottom-8 left-8 z-20 text-white">
              <h1 className="text-4xl font-bold mb-2">MMMUT RESO</h1>
              <p className="text-lg opacity-90">
                Research, Education, Services, Outreach
              </p>
            </div>
          </div>

          {/* Right side - Welcome Message */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-lg">
              <div className="text-4xl mb-6">✨</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Welcome to RESO Dashboard
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Access all our resources, events, and project information in one
                place. Collaborate effectively with team members and track
                progress.
              </p>{" "}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold text-lg shadow-md text-center"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/learn-more"
                  className="bg-white/5 hover:bg-white/10 border border-white/20 text-white transition-colors py-3 px-6 rounded-lg font-medium text-lg shadow-sm text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Resources Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            Featured Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource Card 1 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                    <FiFileText size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Research Papers
                  </h4>
                </div>
                <p className="text-white/70 mb-6">
                  Access our collection of research papers and publications from
                  team members.
                </p>{" "}
                <Link
                  to="/dashboard?tab=docs"
                  className="flex items-center text-white hover:text-white/80"
                >
                  View Papers <FiExternalLink className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Resource Card 2 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                    <FiFileText size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Project Repository
                  </h4>
                </div>
                <p className="text-white/70 mb-6">
                  Explore our GitHub repositories and contribute to ongoing
                  projects.
                </p>{" "}
                <Link
                  to="/dashboard?tab=projects"
                  className="flex items-center text-white hover:text-white/80"
                >
                  View Projects <FiExternalLink className="ml-2" />
                </Link>
              </div>
            </div>

            {/* Resource Card 3 */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-white/20 text-white mr-3">
                    <FiFileText size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Educational Materials
                  </h4>
                </div>
                <p className="text-white/70 mb-6">
                  Access tutorials, guides, and educational content created by
                  our team.
                </p>{" "}
                <Link
                  to="/dashboard?tab=docs"
                  className="flex items-center text-white hover:text-white/80"
                >
                  View Materials <FiExternalLink className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
