const Admission = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admission</h1>
      <div className="mb-8">
        <img
          src="/images/admission_poster.jpg"
          alt="Admission Information"
          className="w-full rounded-lg shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/abia_state_admission.jpg';
          }}
        />
      </div>
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">NCE Admission</h2>
        <p className="text-lg text-gray-700 mb-4">
          Applications are invited from suitably qualified candidates for admission into various
          NCE (Nigeria Certificate in Education) programs at Abia State College of Education
          (Technical) Arochukwu.
        </p>
        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Admission Requirements</h3>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-4">
          <li>Five (5) O'Level credits including English Language and Mathematics</li>
          <li>UTME score meeting the cut-off mark for the chosen program</li>
          <li>Post-UTME screening result</li>
          <li>Completed application form</li>
        </ul>
        <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">How to Apply</h3>
        <ol className="list-decimal list-inside text-lg text-gray-700 space-y-2 mb-4">
          <li>Visit the university portal</li>
          <li>Create an account</li>
          <li>Fill out the application form</li>
          <li>Upload required documents</li>
          <li>Pay the application fee</li>
          <li>Submit your application</li>
        </ol>
        <div className="mt-8 p-4 bg-asceta-blue text-white rounded-lg">
          <p className="font-semibold">For more information, contact:</p>
          <p>Admissions Office</p>
          <p>Email: admissions@asceta.edu.ng</p>
          <p>Phone: +234 (0) 8021234567</p>
        </div>
      </div>
    </div>
  );
};

export default Admission;

