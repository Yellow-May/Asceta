import { Link } from 'react-router-dom';

interface NewsCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate?: string;
  category?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  content,
  imageUrl,
  publishDate,
  category,
}) => {
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + '...' : content;
  const formattedDate = publishDate ? new Date(publishDate).toLocaleDateString() : '';

  return (
    <Link to={`/news/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          {category && (
            <span className="text-xs text-asceta-blue font-semibold uppercase">
              {category}
            </span>
          )}
          <h3 className="text-xl font-bold mt-2 mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{truncatedContent}</p>
          {formattedDate && (
            <p className="text-xs text-gray-500">{formattedDate}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;

