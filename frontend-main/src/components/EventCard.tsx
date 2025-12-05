import { Link } from 'react-router-dom';

interface EventContent {
  summary?: string;
  sections?: Array<{
    type: 'text' | 'image' | 'list' | 'quote';
    title?: string;
    content: string | string[];
    imageUrl?: string;
  }>;
  metadata?: {
    tags?: string[];
    category?: string;
    [key: string]: any;
  };
}

interface Event {
  id: string;
  title: string;
  content: EventContent;
  eventDate: string;
  location?: string;
  imageUrl?: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Extract features from sections if available
  const getFeatures = () => {
    const featuresSection = event.content?.sections?.find(
      (section) => section.type === 'list' && section.title === 'What to Expect'
    );
    if (featuresSection && Array.isArray(featuresSection.content)) {
      return featuresSection.content.slice(0, 5); // Limit to 5 features for card
    }
    return [];
  };

  const features = getFeatures();

  return (
    <Link
      to={`/events/${event.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Green Banner Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="text-xs uppercase tracking-wide mb-1">
          ABIA STATE COLLEGE OF EDUCATION (TECHNICAL), AROCHUKWU
        </div>
        <div className="text-xl font-bold mb-1">{event.title}</div>
        {event.content?.summary && (
          <div className="text-sm opacity-90">
            Celebrating Love, Light and Learning
          </div>
        )}
      </div>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="w-full overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-auto object-contain"
          />
        </div>
      )}

      {/* Event Content */}
      <div className="p-5">
        {/* Summary Text */}
        {event.content?.summary && (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {event.content.summary}
            </p>
          </div>
        )}

        {/* Event Details */}
        <div className="border-t pt-4 space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-lg">📅</span>
            <span className="font-medium">{formatDate(event.eventDate)}</span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-lg">📍</span>
              <span>{event.location}</span>
            </div>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Featuring:
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

