import React, { useState } from "react";
import backgroundImage from "/src/assets/ISAMMBackground.jpg";
import { Link } from "react-router-dom";
export default function Home() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [expandedFeature, setExpandedFeature] = useState(null);

  const toggleFeature = (feature) => {
    setExpandedFeature(expandedFeature === feature ? null : feature);
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      </div>

      <div className="relative z-10">
       
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-6">
              Manage Your Engineering Journey
            </h1>
            <p className="text-xl text-black mb-8">
              A comprehensive platform for managing internships, projects, and
              skills acquisition throughout your engineering education.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white-50/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-left text-gray-800 mb-12">
              About ISAMM
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  ISAMM is a public higher education institution established in
                  2000.
                </p>
                <p className="text-lg mb-4">
                  ISAMM offers programs in computer science, multimedia arts,
                  and audiovisual technology.
                </p>
                <p className="text-lg mb-4">
                  Since its inception, ISAMM has distinguished itself through
                  the multidisciplinary nature of its programs, the diversity of
                  its teaching staff specialties, and the versatility of its
                  graduates' profiles. ISAMM is part of the International
                  University Network for Digital Creation (RUN).
                </p>
                <Link to="/signin">
                  <button className="text-gray-600 hover:text-indigo-600 p-2 rounded-full bg-gray-100 transition-all">
                    Sign In
                  </button>
                </Link>
              </div>
              <div className="aspect-video w-full h-full">
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/kvJVTZpKBhQ"
                  title="ISAMM Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4">
            <br></br>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
              Platform Features
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Enhanced Internship Management Feature */}
              <div
                className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
                  expandedFeature === "internship" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => toggleFeature("internship")}
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Internship Management
                  </h3>
                </div>

                {expandedFeature === "internship" ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Submit Documents
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Upload internship reports
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Submit company attestations
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Track submission status
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Evaluation Process
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          View evaluation criteria
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Check supervisor assignments
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Access final evaluation results
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Defense Planning
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          View defense schedule
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Download defense guidelines
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Submit defense materials
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Submit documents, check assignments, and access evaluation
                    results for your summer internships.
                  </p>
                )}
              </div>

              {/* Project Tracking Feature */}
              <div
                className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
                  expandedFeature === "project" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => toggleFeature("project")}
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Project Tracking
                  </h3>
                </div>

                {expandedFeature === "project" ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Project Selection
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Browse available projects
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Submit project preferences
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          View assignment results
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Project Management
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Submit progress reports
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Schedule meetings with advisors
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Upload final deliverables
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">Evaluation</h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          View evaluation criteria
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Access jury feedback
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Download final grades
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Select and submit projects, view schedules, and manage both
                    annual and final year projects in one place.
                  </p>
                )}
              </div>

              {/* Skills Assessment Feature */}
              <div
                className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 ${
                  expandedFeature === "skills" ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => toggleFeature("skills")}
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Skills Assessment
                  </h3>
                </div>

                {expandedFeature === "skills" ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Competency Tracking
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          View skill requirements
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Track your progress
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Identify skill gaps
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Course Evaluation
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Submit course feedback
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          View course competencies
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Access learning resources
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">
                        Progress Reports
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Generate competency reports
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Compare with program requirements
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          Download official transcripts
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Track your progress, evaluate courses, and monitor skill
                    development throughout your engineering program.
                  </p>
                )}
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
              Who Uses This Platform?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Student */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  Students
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Submit internship documentation
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Select and manage projects
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Evaluate courses and track progress
                  </li>
                </ul>
              </div>

              {/* Professor */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  Professors
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Submit project topics
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Evaluate student work
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Manage course curriculum
                  </li>
                </ul>
              </div>

              {/* Administrator */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  Administrators
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Manage user accounts
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Schedule presentations
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    Oversee the entire program
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="mb-2">© 2025 Engineering Journey Platform</p>
              <p className="text-blue-200">
                A comprehensive solution for managing engineering education
                programs
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
