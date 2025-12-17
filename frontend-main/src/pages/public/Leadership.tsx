const Leadership = () => {
  const leadership = [
    {
      name: "Dr. (Mrs.) Idowu Obukohwo Eluwa",
      position: "Provost",
      image: "/images/provost_idowu.png",
      bio: `Dr. (Mrs.) Idowu Obukohwo Eluwa, Provost of ASCETA, hails from Abia State and holds degrees in Mathematics Education and Educational Measurement and Evaluation (B.Sc., M.Ed., PhD) from the University of Calabar. She began her career teaching Mathematics and Further Mathematics before moving fully into higher education. Currently an Associate Professor at Michael Okpara University of Agriculture, Umudike, she has also served as Acting Head of the Department of Science Education. Her research focuses on innovative teaching-learning strategies, sustainable education practices, and advancing socio-economic development through education. She has authored and co-authored over 40 publications, and is an active member of national and international associations such as ASSEREN, OWSD, STAN, and ISDS (Japan). Beyond academia, Dr. Eluwa is a mentor and advocate for women in leadership, leading initiatives that encourage women's participation in governance and education. Known for critical thinking, innovation, and discipline, she exemplifies ASCETA's commitment to producing highly skilled, ethical, and forward-thinking educators.`,
      email: "provost@asceta.edu.ng",
      alternateEmail: "idowueluwa@gmail.com",
    },
    {
      name: "Dr. Abdulkaarim Jibril",
      position: "Deputy Provost",
      image: "/images/dean-1.jpeg",
      bio: `Dr. Abdulkaarim Jibril is the current Deputy Provost and a Chief Lecturer at the Abia State College of Education (Technical), Arochukwu (ASCETA). He holds a first degree in Physics from Ahmadu Bello University, a Master's degree, and a Ph. D. in Technical Education from the University of Nigeria Nsukka. Joining ASCETA in 2000, he has served in multiple executive roles, including Dean, School of Technical Education, Director, Academic Planning, and previously as the Acting Provost. A respected academic, he is a prolific author, having authored or co-authored nine textbooks and contributed to 15 book chapters and 30 journals in his field.`,
      email: "deputyprovost@asceta.edu.ng",
    },
    {
      name: "Bldr. Dr. Kingsley O. Igboko MNIB",
      position: "Dean, School of Technical Education",
      image: "/images/king_dean.png",
      bio: `Bldr. Dr. Kingsley O. Igboko is the Dean of Technical Education at ASCETA. He holds NCE, B.Sc, M.Ed, and Ph.D degrees. He is a Corporate Member of the Nigerian Institute of Building (NIOB), a Registered Builder with the Council of Registered Builders of Nigeria (CORBON), a Member of the Association of Vocational and Technical Educators of Nigeria (AVTEN), and a Member of the Teachers Registration Council of Nigeria (TRCN).`,
      email: "dean.technical@asceta.edu.ng",
    },
    {
      name: "Dr. Jane A. E. Onyeachu",
      position: "Dean, School of Education",
      image: "/images/jane_dean.png",
      bio: `Dr. Jane A. E. Onyeachu is a distinguished Chief Lecturer and the current Dean, School of Education, at Abia State College of Education (Technical), Arochukwu. With over 30 years of experience, she has taught across primary, secondary, and tertiary levels. Her leadership roles at the institution have included Head of Department, Curriculum and Instruction, and Director of both Degree Programmes and General Studies Education. Dr. Onyeachu holds an NCE (English/Social Studies), a B.A. (Ed) (Education/English), an M. Ed, and a Ph. D, both in Curriculum Studies. She is a Fellow of the Curriculum Organization of Nigeria and a member of the World Council for Curriculum and Instruction. She is the author of several publications, including Teaching Profession: Principles and Methods.`,
      email: "dean.education@asceta.edu.ng",
    },
    {
      name: "Dr. Usuka, Enweremadu, Isaac, CLN, FCAI, Ph.D",
      position: "College Librarian",
      image: "/images/college-librarian.jpeg",
      bio: `Usuka, E, Isaac is a Certified Librarian in Nigeria (CLN) by the Librarians' Registration Council of Nigeria, Member, Nigerian Library Association, and Fellow, Institute of Corporate Administration (FCAI). He has a Doctorate and a Master's degree in Library and Information Science from the University of Nigeria, Nsukka. A Bachelor's degree in Library and Information Science from Abia State University, Uturu. He has a special interest in library organisation, library aesthetics, digital library services, user satisfaction, and job performance. He has been published in national and international journals and is widely cited. He has contributed chapters to books. 

Dr Isaac is an Editorial Board Member of the American Journal of Information Science and Technology. He is listed on the Web of Science for his scholarly reviews. He has been a classroom teacher, public librarian, school librarian, and special librarian in various Institutions. Dr Isaac is the College Librarian of Abia State College of Education (Technica), Arochukwu. He has participated in several webinars, workshops, seminars, and conferences domestically and abroad.`,
      email: "librarian@asceta.edu.ng",
    },
    {
      name: "DR. Paul Anyaogu",
      position: "Dean, School of Arts and Social Sciences",
      image: "/images/dr_paul.png",
      bio: `DR. Paul Anyaogu serves as the Dean of the School of Arts and Social Sciences at ASCETA. He brings extensive experience in academic administration and educational leadership to his role.`,
      email: "dean.arts@asceta.edu.ng",
    },
    {
      name: "",
      position: "Registrar",
      image: "/images/registra.jpeg",
      bio: "",
      email: "",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Leadership</h1>
      <p className="text-lg text-gray-700 mb-12">
        Meet the dedicated leadership team guiding ASCETA towards excellence in
        teacher education and technical training.
      </p>

      <div className="space-y-16">
        {leadership.map((leader, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              index === 0 ? "md:flex-row" : "md:flex-row"
            } gap-8 items-start`}
          >
            <div className="flex-shrink-0">
              <img
                src={leader.image}
                alt={leader.name || leader.position}
                className="w-64 h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400x500?text=" +
                    encodeURIComponent(leader.name);
                }}
              />
            </div>
            <div className="flex-1">
              {leader.name && (
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {leader.name}
                </h2>
              )}
              <p className="text-xl text-asceta-blue font-semibold mb-4">
                {leader.position}
              </p>
              {leader.bio && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {leader.bio}
                  </p>
                </div>
              )}
              {leader.email && (
                <div className="mt-4">
                  <p className="text-gray-600">
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${leader.email}`}
                      className="text-asceta-blue hover:underline"
                    >
                      {leader.email}
                    </a>
                  </p>
                  {leader.alternateEmail && (
                    <p className="text-gray-600">
                      <strong>Alternate Email:</strong>{" "}
                      <a
                        href={`mailto:${leader.alternateEmail}`}
                        className="text-asceta-blue hover:underline"
                      >
                        {leader.alternateEmail}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leadership;
