import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../config/supabase";
import FAQAccordion from "../../../components/FAQAccordion";

const faqs = [
  {
    question: "Who can apply for the program?",
    answer:
      "Anyone with an SSCE or equivalent, basic computer literacy, and interest in animation or digital storytelling.",
  },
  {
    question: "Do I need to know how to draw?",
    answer:
      "No. Some tracks require drawing, but others like sound, music, writing, or production management do not.",
  },
  {
    question: "Is the program full-time?",
    answer: "Yes. The diploma is a 12-month, intensive studio-based program.",
  },
  {
    question: "Is this program recognized?",
    answer:
      "Yes. ACCADD operates under ASCETA and is part of Nigeria's first government-backed animation diploma initiative.",
  },
  {
    question: "What equipment will students learn with?",
    answer:
      "Students are trained with industry-standard software, drawing tablets, audio equipment, and full production pipelines.",
  },
  {
    question: "Are there job opportunities after graduation?",
    answer:
      "Yes. Students graduate with a portfolio and film credits, plus internship opportunities with Animation Nigeria member studios.",
  },
  {
    question: "Can I specialize in more than one track?",
    answer:
      "No. Students choose one specialization to ensure depth and professional readiness.",
  },
  {
    question: "Will students work on real productions?",
    answer:
      "Yes. Every specialization contributes to multiple short films and one final capstone animation.",
  },
  {
    question: "Is accommodation available?",
    answer: "To be confirmed - information will be updated once finalized.",
  },
  {
    question: "How much is the tuition?",
    answer:
      "Final tuition is currently being decided. A range will be communicated soon.",
  },
];

const specializationTracks = [
  {
    title: "Writing for Animation",
    description:
      "Story development, scriptwriting, character arcs, pitch bibles.",
    image: "/accadd/Writer.png",
  },
  {
    title: "Audio Post-Production",
    description: "Foley, ADR, dialogue editing, mixing, sound design.",
    image: "/accadd/Audio prod.png",
  },
  {
    title: "Music & Score Composition",
    description: "Scoring to picture, digital orchestration, theme creation.",
    image: "/accadd/Music comp.png",
  },
  {
    title: "Classic 2D Animation",
    description: "Character acting, timing, cleanup, layout, shot production.",
    image: "/accadd/2d Animation.png",
  },
  {
    title: "Concept Art & Visual Development",
    description: "Character, prop, and environment design, color scripting.",
    image: "/accadd/Visual Dev.png",
  },
  {
    title: "Storyboarding & Animatics",
    description: "Camera language, sequential clarity, pre-visualization.",
    image: "/accadd/Storyboard.png",
  },
  {
    title: "Production Management",
    description: "Pipeline planning, scheduling, budgeting, team coordination.",
    image: "/accadd/Prod Manager.png",
  },
  {
    title: "Editing & Post-Production",
    description: "Cutting animatics, assembling scenes, color and finishing.",
    image: "/accadd/Editing.png",
  },
];

const careerPaths = [
  "2D Animation",
  "Storyboarding",
  "Character & Environment Design",
  "Scriptwriting for Film & TV",
  "Sound Design and Foley",
  "Music & Score Composition",
  "Video Editing & Post-Production",
  "Production Management",
  "Digital Creative Entrepreneurship",
  "Content Development for Agencies, Studios, Media Houses, and EdTech companies",
];

const credibilityBoosters = [
  {
    label: "Developed with",
    logo: "/accadd/Toda Studios Logo.png",
    alt: "Toda Studios Logo",
  },
  {
    label: "Endorsed by",
    logo: "/accadd/Animation Nigeria Logo.png",
    alt: "Animation Nigeria Logo",
  },
  {
    label: "Backed by",
    logo: "/accadd/ASCETA Logo.png",
    alt: "ASCETA Logo",
  },
  {
    label: "Approved by",
    logo: "/accadd/Abia State Logo.png",
    alt: "Abia State Logo",
  },
];

const handleDownloadBrochure = () => {
  const link = document.createElement("a");
  link.href = "/files/Program Brochure.pdf";
  link.download = "Program Brochure.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Landing = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [_, setFullName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          // Get full name from user metadata
          const name = session.user.user_metadata?.full_name || "";
          setFullName(name);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const name = session.user.user_metadata?.full_name || "";
        setFullName(name);
      } else {
        setIsAuthenticated(false);
        setFullName("");
      }
    });

    // Handle hash navigation to FAQ section
    if (window.location.hash === "#faq") {
      setTimeout(() => {
        const faqSection = document.getElementById("faq");
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* Welcome Notification Banner */}
      {/* {isAuthenticated && fullName && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Welcome back - {fullName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Hero Section */}
      <section
        className="relative text-white py-24 xl:py-36 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/accadd/Hero Background.png')",
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <img
              src="/accadd/Logo - ACCADD.png"
              alt="ACCADD Logo"
              className="h-24 md:h-40 lg:h-48 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Become a World-Class Animator,
            <br />
            Right Here in Abia State
          </h1>
          <p className="text-sm md:text-xl mb-10 lg:mb-20 max-w-4xl mx-auto">
            ASCETA's Center for Creative Animation and Digital Development
            (ACCADD) trains young creators to become globally competitive
            digital storytellers and studio-ready professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={isAuthenticated ? "/accadd/payment" : "/accadd/auth"}
              className="bg-white text-black px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm transition-all hover:bg-white/80 transition-colors rounded-full font-semibold"
            >
              {isAuthenticated ? "Continue Application" : "Apply Now"} &gt;
            </Link>
            <button
              onClick={handleDownloadBrochure}
              className="text-white font-semibold hover:underline transition-colors text-xs lg:text-sm"
            >
              Download Brochure &gt;
            </button>
          </div>
        </div>
      </section>

      {/* What ACCADD Is */}
      <section className="py-16 bg-white">
        {/* Our Center Separator */}
        <div className="flex justify-center mb-8 lg:mb-10">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors text-xs lg:text-sm">
            Our Center
          </button>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  What is ACCADD?
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  ACCADD is ASCETA's dedicated training and production center
                  for animation, digital storytelling, and creative technology.
                  The center combines hands-on studio practice,
                  industry-standard tools, and expert-led instruction to equip
                  learners with real employable skills. Students learn by
                  doing—working on animated films, series concepts, sound design
                  projects, and production tasks just like in professional
                  studios.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our mission is to raise world-class animators and digital
                  creators who can compete, innovate, and produce at global
                  standards.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/accadd/happy-young-designer-drawing-on-a-graphics-tablet-with-a-stylus-pen-female-graphic-designer-smiling-while-working-on-a-new-design-at-her-desk-creative-young-freelancer-w.jpg"
                  alt="Designer working on graphics tablet"
                  className="rounded-lg shadow-lg w-full max-w-md"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-red-500">
                <p className="text-gray-800 text-center font-semibold">
                  First government-backed animation diploma program in Nigeria.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-red-500">
                <p className="text-gray-800 text-center font-semibold">
                   ⁠Designed in partnership with Toda Studios, one of Africa’s leading animation producers
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-red-500">
                <p className="text-gray-800 text-center font-semibold">
                  Industry-standard equipment, labs, and studio-based training.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-red-500">
                <p className="text-gray-800 text-center font-semibold">
                  ⁠Hands-on learning: students work on real animated productions throughout the program.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-red-500">
                <p className="text-gray-800 text-center font-semibold">
                  Multiple specialization tracks - writing, 2D animation, editing, sound, music, and more.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-red-500">
                <p className="text-gray-800 text-center font-semibold">
                  Built to make students employable, entrepreneurial, and ready for global opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility & Partnerships */}
      <section className="py-16 bg-white">
        {/* Heading with Background */}
        <div
          className="relative py-12 mb-8"
          style={{
            backgroundImage: "url('/accadd/C&P Background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-500/90 to-orange-500/90"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
              Credibility & Partnerships
            </h2>
          </div>
        </div>
        {/* Logos Section with White Background */}
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {credibilityBoosters.map((partner, index) => (
                <div key={index} className="text-center">
                  <p className="text-gray-700 font-semibold mb-4 text-sm">
                    {partner.label}
                  </p>
                  <div className="flex justify-center items-center h-24">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Offered */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Programs Offered
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-asceta-blue text-white p-8 rounded-lg mb-10">
              <h3 className="text-2xl font-bold mb-4">
                National Diploma in Animation Production
              </h3>
              <p className="text-lg mb-2">
                <strong>Duration:</strong> 12 Months
              </p>
              <p className="text-lg leading-relaxed">
                A one-year, studio-driven program that trains students in
                animation, storytelling, sound, music, editing, and production
                management. Students begin with a 3-month foundation phase, then
                specialize in one of eight professional tracks, producing short
                pieces and a final animated film.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Specialization Tracks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {specializationTracks.map((track, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-asceta-blue mb-3">
                      {track.title}
                    </h4>
                    <p className="text-gray-700">{track.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="bg-asceta-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Download Curriculum
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Admissions Information
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Entry Requirements
              </h3>
              <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>SSCE or equivalent</li>
                <li>Basic computer literacy</li>
                <li>Interest in art, storytelling, or digital media</li>
                <li>Commitment to full-time training for 12 months</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Application Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-asceta-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <p className="text-gray-700">Create an account.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-asceta-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <p className="text-gray-700">Payment for application form.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-asceta-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <p className="text-gray-700">
                    Fill out the application form.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-asceta-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <p className="text-gray-700">
                    Wait for admission confirmation and onboarding information.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-asceta-blue text-white p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-2">Key Dates</h3>
              <p className="text-lg">To be updated once finalized.</p>
            </div>

            <div className="text-center">
              <Link
                to={isAuthenticated ? "/accadd/payment" : "/accadd/auth"}
                className="inline-block bg-asceta-blue text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                {isAuthenticated ? "Continue Application" : "Apply Now"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Career Pathways & Opportunities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Career Pathways & Opportunities
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Graduates from ACCADD gain practical studio experience that
              prepares them for careers in:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {careerPaths.map((career, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg shadow flex items-center"
                >
                  <div className="text-asceta-blue mr-3">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{career}</span>
                </div>
              ))}
            </div>
            <div className="bg-asceta-blue bg-opacity-10 p-6 rounded-lg border-l-4 border-asceta-blue">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Internships
              </h3>
              <p className="text-gray-700">
                Students may also access internship opportunities with studios
                under Animation Nigeria and partner studios connected to Toda
                Studios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16 text-white bg-cover bg-center"
        style={{
          backgroundImage: "url('/accadd/Hero Background.png')",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Animation Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Nigeria's first government-backed animation diploma program and
            become a world-class digital creator.
          </p>
          <Link
            to={isAuthenticated ? "/accadd/payment" : "/accadd/auth"}
            className="inline-block bg-white text-asceta-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            {isAuthenticated ? "Continue Application" : "Apply Now"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
