import { useEffect, useState } from 'react';
// import api from '../../services/api';
import eventsData from '../../data/events.json';
import EventCard from '../../components/EventCard';

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

const EventsList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(eventsData.events.length / itemsPerPage);

  useEffect(() => {
    // Commented out API call - using JSON data instead
    // const fetchEvents = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await api.get(`/events?page=${page}&limit=12`);
    //     setEvents(response.data.events || []);
    //     setTotalPages(response.data.pagination?.pages || 1);
    //   } catch (error) {
    //     console.error('Error fetching events:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchEvents();

    // Using JSON data instead
    setLoading(true);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = (eventsData.events as Event[]).slice(startIndex, endIndex);
    setEvents(paginatedEvents);
    setLoading(false);
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Upcoming Events</h1>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-asceta-blue text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-asceta-blue text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsList;

