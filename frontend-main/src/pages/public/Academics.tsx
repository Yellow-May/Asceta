const Academics = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <img
              src="/images/technical-department.png"
              alt="School of Technical Education"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-asceta-blue">School of Technical Education</h3>
              <p className="text-sm text-gray-600 mt-2">Building Technology, Automobile Technology, Electrical/Electronics, Metalwork, Woodwork, and more</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <img
              src="/images/education-department.png"
              alt="School of Education"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-asceta-blue">School of Education</h3>
              <p className="text-sm text-gray-600 mt-2">Curriculum Studies, Educational Foundations, Science Education, and more</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <img
              src="/images/general-department.png"
              alt="School of Arts and Social Sciences"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-asceta-blue">School of Arts and Social Sciences</h3>
              <p className="text-sm text-gray-600 mt-2">English, Social Studies, Political Science, Economics, and more</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <img
              src="/images/general-department.png"
              alt="School of General Studies"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-asceta-blue">School of General Studies</h3>
              <p className="text-sm text-gray-600 mt-2">General education courses and foundational studies</p>
            </div>
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

