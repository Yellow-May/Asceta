import { AppDataSource } from './config/data-source';
import { User, UserRole } from './entities/User';
import { News, NewsStatus } from './entities/News';
import { Event } from './entities/Event';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    const userRepository = AppDataSource.getRepository(User);
    const newsRepository = AppDataSource.getRepository(News);
    const eventRepository = AppDataSource.getRepository(Event);

    // Check if admin already exists
    let admin = await userRepository.findOne({ where: { email: 'admin@asceta.edu.ng' } });
    let lecturer = await userRepository.findOne({ where: { email: 'lecturer@asceta.edu.ng' } });

    // Create Admin User
    if (!admin) {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      admin = userRepository.create({
        email: 'admin@asceta.edu.ng',
        passwordHash: adminPasswordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        staffId: 'ADM001',
        department: 'Administration',
        phone: '+2349012345678',
        isActive: true,
      });
      admin = await userRepository.save(admin);
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create Lecturer User
    if (!lecturer) {
      const lecturerPasswordHash = await bcrypt.hash('lecturer123', 10);
      lecturer = userRepository.create({
        email: 'lecturer@asceta.edu.ng',
        passwordHash: lecturerPasswordHash,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.LECTURER,
        staffId: 'LEC001',
        department: 'Science Education',
        phone: '+2349012345679',
        isActive: true,
      });
      lecturer = await userRepository.save(lecturer);
      console.log('✅ Lecturer user created:', lecturer.email);
    } else {
      console.log('ℹ️  Lecturer user already exists');
    }

    // Create Sample News Articles
    const existingNews = await newsRepository.count();
    if (existingNews === 0) {
      const newsArticles = [
        {
          title: 'COMMENCEMENT OF 2025/2026 ACADEMIC SESSION',
          content: `ABIA STATE COLLEGE OF EDUCATION (TECHNICAL) AROCHUKWU 2025/2026 ACADEMIC CALENDAR

**FIRST SEMESTER**

- **Sunday 5th October, 2025** - Fresh Students return for 2025/2026 Academic Session
- **Monday 6th October, 2025** - Registration of fresh students
- **Sunday 12th October, 2025** - Old Students return for 2025/2026 Academic Session
- **Monday 13th October, 2025** - Lectures begin for both fresh and old students

All students are expected to complete their registration within the stipulated time frame.`,
          category: 'Academic',
          status: NewsStatus.PUBLISHED,
          publishDate: new Date(),
          authorId: admin.id,
        },
        {
          title: 'NCE Program Admissions Now Open',
          content: `Applications are now being accepted for admission into full-time and part-time NCE (Nigeria Certificate in Education) programs at Abia State College of Education (Technical), Arochukwu.

**Available Programs:**
- Technical Education
- Science Education
- Arts and Social Sciences
- General Studies Education

Join 5,000+ students in a community dedicated to academic excellence, innovation, and personal growth.`,
          category: 'Admission',
          status: NewsStatus.PUBLISHED,
          publishDate: new Date(),
          authorId: admin.id,
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        },
        {
          title: 'SUG 2025 ELECTION - Voting Now Open',
          content: `The Students Union Government (SUG) 2025 Election is now open for voting. All registered students are encouraged to participate in this democratic process.

**Election Guidelines:**
- Only registered students are eligible to vote
- Voting closes on December 15, 2025
- Results will be announced within 48 hours after voting closes

Please ensure you refresh your browser before proceeding to vote.`,
          category: 'Student Affairs',
          status: NewsStatus.PUBLISHED,
          publishDate: new Date(),
          authorId: lecturer.id,
        },
        {
          title: 'Teacher Training Workshop Series',
          content: `Applications are now open for the Teacher Training Workshop Series. This initiative aims to enhance the teaching skills of educators and improve learning outcomes.

**Workshop Topics:**
- Innovative Teaching-Learning Strategies
- Educational Measurement and Evaluation
- Curriculum Development
- Classroom Management

**Benefits:**
- Professional development certificate
- Networking opportunities
- Access to teaching resources
- Continuing education credits

Check out the flier for more details.`,
          category: 'Opportunities',
          status: NewsStatus.PUBLISHED,
          publishDate: new Date(),
          authorId: lecturer.id,
        },
        {
          title: 'New Library Resources Available',
          content: `The college is pleased to announce the addition of new library resources including digital databases, e-books, and research materials.

These resources will serve as a hub for academic research and student learning.`,
          category: 'Resources',
          status: NewsStatus.DRAFT,
          authorId: lecturer.id,
        },
      ];

      for (const newsData of newsArticles) {
        const news = newsRepository.create(newsData);
        await newsRepository.save(news);
      }
      console.log('✅ Sample news articles created');
    } else {
      console.log('ℹ️  News articles already exist');
    }

    // Create Sample Events
    const existingEvents = await eventRepository.count();
    if (existingEvents === 0) {
      const events = [
        {
          title: '2025/2026 Academic Session Opening Ceremony',
          description: 'Official opening ceremony for the 2025/2026 academic session. All students, staff, and stakeholders are invited to attend.',
          eventDate: new Date('2025-10-13T09:00:00'),
          location: 'Main Auditorium',
          createdById: admin.id,
        },
        {
          title: 'NCE Graduation Ceremony',
          description: 'Join us for the graduation ceremony celebrating the achievements of our NCE graduates. This event honors students who have completed their teacher education programs.',
          eventDate: new Date('2025-11-15T10:00:00'),
          location: 'College Auditorium',
          createdById: admin.id,
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        },
        {
          title: 'SUG Election Results Announcement',
          description: 'The results of the Students Union Government election will be announced. All candidates and students are invited to attend.',
          eventDate: new Date('2025-12-17T14:00:00'),
          location: 'Student Union Building',
          createdById: lecturer.id,
        },
        {
          title: 'Education Technology Workshop',
          description: 'Workshop on innovative teaching-learning strategies and educational technology integration. Featuring keynote speakers and hands-on sessions.',
          eventDate: new Date('2025-12-20T09:00:00'),
          location: 'Conference Hall',
          createdById: lecturer.id,
        },
        {
          title: 'Career Fair 2025',
          description: 'Connect with top employers in education, technical fields, and related sectors. Bring your CV and be ready for on-the-spot interviews.',
          eventDate: new Date('2026-01-15T10:00:00'),
          location: 'Sports Complex',
          createdById: admin.id,
        },
        {
          title: 'Cultural Day Celebration',
          description: 'Celebrate the rich cultural diversity of our college community. Food, music, dance, and cultural displays from various regions.',
          eventDate: new Date('2026-02-14T12:00:00'),
          location: 'College Grounds',
          createdById: lecturer.id,
        },
      ];

      for (const eventData of events) {
        const event = eventRepository.create(eventData);
        await eventRepository.save(event);
      }
      console.log('✅ Sample events created');
    } else {
      console.log('ℹ️  Events already exist');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@asceta.edu.ng');
    console.log('  Password: admin123');
    console.log('\nLecturer:');
    console.log('  Email: lecturer@asceta.edu.ng');
    console.log('  Password: lecturer123');
    console.log('\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seed();

