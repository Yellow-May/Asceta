import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

const Dashboard = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news?limit=6');
        setNews(response.data.news || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">
          {user?.studentId && `Student ID: ${user.studentId}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-asceta-blue mb-2">Academic Information</h3>
          <p className="text-gray-600">View your courses, grades, and academic records</p>
          <Link
            to="/student/academics"
            className="text-asceta-blue hover:underline mt-2 inline-block"
          >
            View Details →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-asceta-blue mb-2">Announcements</h3>
          <p className="text-gray-600">Stay updated with latest announcements</p>
          <Link
            to="/news"
            className="text-asceta-blue hover:underline mt-2 inline-block"
          >
            View All →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-asceta-blue mb-2">Profile</h3>
          <p className="text-gray-600">Manage your profile and settings</p>
          <Link
            to="/student/profile"
            className="text-asceta-blue hover:underline mt-2 inline-block"
          >
            Edit Profile →
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Announcements</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

