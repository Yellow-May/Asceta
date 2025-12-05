import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import eventsData from '../../data/events.json';

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

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundEvent = (eventsData.events as Event[]).find(
        (e) => e.id === id
      );
      setEvent(foundEvent || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Event not found
          </h1>
          <Link to="/events" className="text-asceta-blue hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/events"
        className="text-asceta-blue hover:underline mb-6 inline-block"
      >
        ← Back to Events
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Green Banner */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg mb-0">
          <div className="text-sm uppercase tracking-wide mb-2">
            ABIA STATE COLLEGE OF EDUCATION (TECHNICAL), AROCHUKWU
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          {event.content?.summary && (
            <div className="text-lg opacity-90">
              {event.content.summary.split('!')[0]}!
            </div>
          )}
        </div>

        {/* Event Image */}
        {event.imageUrl && (
          <div className="w-full overflow-hidden rounded-b-lg mb-6">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-semibold text-gray-800">
                  {formatDate(event.eventDate)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="text-sm text-gray-600">Time</div>
                <div className="font-semibold text-gray-800">
                  {formatTime(event.eventDate)}
                </div>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-sm text-gray-600">Venue</div>
                  <div className="font-semibold text-gray-800">
                    {event.location}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Sections */}
        {event.content?.sections && event.content.sections.length > 0 && (
          <div className="space-y-6">
            {event.content.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                {section.title && (
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {section.title}
                  </h2>
                )}

                {section.type === 'text' && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {typeof section.content === 'string'
                      ? section.content
                      : section.content.join('\n')}
                  </p>
                )}

                {section.type === 'list' && Array.isArray(section.content) && (
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <span className="text-green-600 font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.type === 'quote' && (
                  <blockquote className="border-l-4 border-green-600 pl-4 italic text-gray-700 text-lg">
                    {typeof section.content === 'string'
                      ? section.content
                      : section.content.join('\n')}
                  </blockquote>
                )}

                {section.type === 'image' && section.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={section.imageUrl}
                      alt={section.title || 'Event image'}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Metadata */}
        {event.content?.metadata && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            {event.content.metadata.category && (
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Category:{' '}
                </span>
                <span className="text-sm text-gray-800">
                  {event.content.metadata.category}
                </span>
              </div>
            )}
            {event.content.metadata.tags &&
              event.content.metadata.tags.length > 0 && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">
                    Tags:{' '}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {event.content.metadata.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </article>
    </div>
  );
};

export default EventDetail;

