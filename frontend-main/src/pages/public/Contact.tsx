const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-asceta-green">Address</h3>
              <p className="text-gray-700">
                Abia State College of Education (Technical)<br />
                Arochukwu, Abia State, Nigeria
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-asceta-green">Phone</h3>
              <p className="text-gray-700">+234 (0) 8021234567</p>
            </div>
            <div>
              <h3 className="font-semibold text-asceta-green">Email</h3>
              <p className="text-gray-700">provost@asceta.edu.ng</p>
              <p className="text-gray-700">info@asceta.edu.ng</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asceta-green"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asceta-green"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-asceta-green"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-asceta-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-asceta-dark-green"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

