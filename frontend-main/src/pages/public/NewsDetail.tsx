import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';

interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate?: string;
  category?: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">News not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/news" className="text-asceta-green hover:underline mb-4 inline-block">
        ← Back to News
      </Link>
      <article className="max-w-4xl mx-auto">
        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}
        {news.category && (
          <span className="text-sm text-asceta-green font-semibold uppercase">
            {news.category}
          </span>
        )}
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-4">
          {news.title}
        </h1>
        <div className="text-gray-600 mb-6">
          {news.publishDate && (
            <p>Published: {new Date(news.publishDate).toLocaleDateString()}</p>
          )}
          {news.author && (
            <p>
              By: {news.author.firstName} {news.author.lastName}
            </p>
          )}
        </div>
        <div className="prose max-w-none">
          <ReactMarkdown>{news.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

