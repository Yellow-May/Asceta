const Academics = () => {
  const colleges = [
    'College of Agricultural Economics, Rural Sociology and Extension',
    'College of Applied Food Sciences and Tourism',
    'College of Animal Science and Animal Production',
    'College of Crop and Soil Sciences',
    'College of Engineering and Engineering Technology',
    'College of Natural Resources And Environmental Management',
    'College of Education',
    'College of Natural Science',
    'College of Physical and Applied Sciences',
    'College of Management Science',
    'School of General Studies',
    'College of Veterinary Medicine',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Academics</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-8">
          ASCETA offers NCE (Nigeria Certificate in Education) programs across various schools and
          departments. Our programs are designed to provide students with practical knowledge and
          skills in technical education and teacher training.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Schools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-asceta-green">School of Technical Education</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-asceta-green">School of Education</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-asceta-green">School of Arts and Social Sciences</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-asceta-green">School of General Studies</h3>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Programs</h2>
        <p className="text-lg text-gray-700 mb-4">
          We offer NCE programs in various fields including:
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-4">
          <li>Technical Education</li>
          <li>Science Education</li>
          <li>Arts and Social Sciences</li>
          <li>General Studies Education</li>
          <li>Mathematics Education</li>
          <li>English Education</li>
        </ul>
      </div>
    </div>
  );
};

export default Academics;

