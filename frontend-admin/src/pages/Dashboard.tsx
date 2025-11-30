import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    publishedNews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, eventsRes] = await Promise.all([
          api.get('/news'),
          api.get('/events'),
        ]);
        const allNews = newsRes.data.news || [];
        const publishedNews = allNews.filter((n: any) => n.status === 'published');
        setStats({
          news: allNews.length,
          events: eventsRes.data.events?.length || 0,
          publishedNews: publishedNews.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total News</h3>
            <p className="text-3xl font-bold text-admin-blue">{stats.news}</p>
            <Link to="/news" className="text-admin-blue hover:underline mt-2 inline-block">
              View All →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Published News</h3>
            <p className="text-3xl font-bold text-green-600">{stats.publishedNews}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-admin-blue">{stats.events}</p>
            <Link to="/events" className="text-admin-blue hover:underline mt-2 inline-block">
              View All →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

