import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LearnMorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">
            About MMMUT RESO
          </h1>
          <div className="text-white/80 space-y-6">
            <p>
              MMMUT RESO (Research, Education, Services, and Outreach) is a
              student-led organization at Madan Mohan Malaviya University of
              Technology focused on advancing research and educational
              initiatives.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Our Mission
            </h2>
            <p>
              Our mission is to create a collaborative environment for students
              and faculty to engage in cutting-edge research, provide
              educational resources, and contribute to the technological
              advancement of society through innovative projects and outreach
              programs.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Key Pillars
            </h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong className="text-white">Research:</strong> Conducting
                innovative research projects in emerging technologies
              </li>
              <li>
                <strong className="text-white">Education:</strong> Creating
                learning resources and organizing workshops
              </li>
              <li>
                <strong className="text-white">Services:</strong> Providing
                technical assistance to university departments and external
                organizations
              </li>
              <li>
                <strong className="text-white">Outreach:</strong> Engaging with
                the community through tech events and knowledge-sharing
                initiatives
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Join Us</h2>
            <p>
              We're always looking for passionate individuals to join our team.
              Whether you're interested in research, education, or community
              outreach, there's a place for you at RESO.
            </p>
            <div className="mt-8 flex space-x-4">
              <a
                href="mailto:reso@mmmut.ac.in"
                className="bg-white text-indigo-900 hover:bg-white/90 transition-colors py-3 px-6 rounded-lg font-semibold text-lg shadow-md inline-block"
              >
                Contact Us
              </a>
              <Link
                to="/dashboard"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors py-3 px-6 rounded-lg font-medium text-lg shadow-sm inline-block"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnMorePage;
