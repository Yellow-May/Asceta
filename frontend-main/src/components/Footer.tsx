import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p>Abia State College of Education (Technical)</p>
            <p>Arochukwu, Abia State, Nigeria</p>
            <p>Phone: +234 (0) 8021234567</p>
            <p>Email: provost@asceta.edu.ng</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-asceta-blue">About</Link></li>
              <li><Link to="/admission" className="hover:text-asceta-blue">Admission</Link></li>
              <li><Link to="/academics" className="hover:text-asceta-blue">Academics</Link></li>
              <li><Link to="/leadership" className="hover:text-asceta-blue">Leadership</Link></li>
              <li><Link to="/news" className="hover:text-asceta-blue">News</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/student/login" className="hover:text-asceta-blue">Student Portal</Link></li>
              <li><Link to="/events" className="hover:text-asceta-blue">Events</Link></li>
              <li><Link to="/contact" className="hover:text-asceta-blue">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2024 Abia State College of Education (Technical) Arochukwu. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

