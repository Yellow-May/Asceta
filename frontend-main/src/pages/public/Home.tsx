import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import api from "../../services/api";
// import NewsCard from "../../components/NewsCard";
import eventsData from "../../data/events.json";
import EventCard from "../../components/EventCard";

// interface News {
//   id: string;
//   title: string;
//   content: string;
//   imageUrl?: string;
//   publishDate?: string;
//   category?: string;
// }

interface EventContent {
  summary?: string;
  sections?: Array<{
    type: "text" | "image" | "list" | "quote";
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

const Home = () => {
  // const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel images
  const carouselImages = [
    "/images/hero-1.png",
    "/images/academics_image.jpg",
    "/images/art-department.png",
    "/images/campus_project.jpg",
    "/images/citadel-building.png",
    "/images/governor_project.jpg",
    "/images/hero-2.png",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [newsRes] = await Promise.all([
        // api.get("/news?limit=4"),
        // Commented out events API call - using JSON data instead
        // api.get('/events?limit=3'),
        // ]);
        // setNews(newsRes.data.news || []);
        // Using JSON data for events instead of API
        // Sort events by date (most recent/upcoming first) and take first 3
        const sortedEvents = (eventsData.events as Event[]).sort(
          (a, b) =>
            new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
        console.log(sortedEvents);
        setEvents(sortedEvents.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {carouselImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`ASCETA Campus ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
        {/* Dark overlay to reduce contrast and improve text readability */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ASCETA
          </h1>
          <p className="text-xl mb-8">
            Abia State College of Education (Technical) Arochukwu
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/admission"
              className="bg-white text-asceta-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Apply Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-asceta-blue"
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
              <h3 className="text-lg font-bold text-asceta-blue">Admission</h3>
              <p className="text-sm text-gray-600 mt-2">Apply for admission</p>
            </Link>
            <Link
              to="/academics"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-asceta-blue">Academics</h3>
              <p className="text-sm text-gray-600 mt-2">Academic programs</p>
            </Link>
            <Link
              to="/student/login"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-bold text-asceta-blue">
                Student Portal
              </h3>
              <p className="text-sm text-gray-600 mt-2">Access your portal</p>
            </Link>
            <Link
              to="/events"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-asceta-blue">Events</h3>
              <p className="text-sm text-gray-600 mt-2">View upcoming events</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {/* <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Latest News</h2>
            <Link to="/news" className="text-asceta-blue hover:underline">
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
      </section> */}

      {/* Upcoming Events */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Upcoming Events
            </h2>
            <Link to="/events" className="text-asceta-blue hover:underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
