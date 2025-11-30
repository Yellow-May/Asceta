import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import NewsCard from '../../components/NewsCard';

interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate?: string;
  category?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location?: string;
}

const Home = () => {
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes] = await Promise.all([
          api.get('/news?limit=4'),
          api.get('/events?limit=3'),
        ]);
        setNews(newsRes.data.news || []);
        setEvents(eventsRes.data.events || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-asceta-green to-asceta-dark-green text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ASCETA
          </h1>
          <p className="text-xl mb-8">
            Abia State College of Education (Technical) Arochukwu
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/admission"
              className="bg-white text-asceta-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Apply Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-asceta-green"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link
              to="/admission"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-bold text-asceta-green">Admission</h3>
              <p className="text-sm text-gray-600 mt-2">Apply for admission</p>
            </Link>
            <Link
              to="/academics"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-asceta-green">Academics</h3>
              <p className="text-sm text-gray-600 mt-2">Academic programs</p>
            </Link>
            <Link
              to="/student/login"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-bold text-asceta-green">Student Portal</h3>
              <p className="text-sm text-gray-600 mt-2">Access your portal</p>
            </Link>
            <Link
              to="/events"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-asceta-green">Events</h3>
              <p className="text-sm text-gray-600 mt-2">View upcoming events</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Latest News</h2>
            <Link to="/news" className="text-asceta-green hover:underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-asceta-green hover:underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                    {event.location && <p>📍 {event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

