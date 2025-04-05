import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import InternshipCard from "../../components/internshipComponents/InternshipCard";
import internshipService from "../../services/internshipServices/internshipStudentListService";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  // Fetching
  const fetchInternships = async () => {
    const data = await internshipService.getInternships();
    setInternships(data);
    setFilteredInternships(data); // initialize with all internships
  };

  //filtre
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value); //what the user gonna search

    const filtered = internships.filter((internship) =>
      internship.student.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInternships(filtered);
  };

  return (
    <div className="min-h-screen bg-white py-10 rounded-lg">
      <div className="max-w-7xl mx-auto p-8 ">
        <h2 className="text-2xl font-bold text-black-700 mb-6 text-start">
          Internship List
        </h2>

        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FaSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by Student Name"
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInternships.map((internship, index) => (
            <InternshipCard key={index} internship={internship} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternshipList;
