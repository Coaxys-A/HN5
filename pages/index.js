import Layout from '../components/Layout';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import StatsBar from '../components/StatsBar';
import CourseGrid from '../components/CourseGrid';
import TeacherGrid from '../components/TeacherGrid';
import MagazineSection from '../components/MagazineSection';
import BlogList from '../components/BlogList';
import ContactCards from '../components/ContactCards';
import stats from '../data/stats';
import courses from '../data/courses';
import teachers from '../data/teachers';
import posts from '../data/posts';
import activities from '../data/activities';
import contactInfo from '../data/contact';
import { teknavUrl } from '../lib/settings';

function HomePage() {
  return (
    <Layout>
      <Hero
        badge="نسل تازه مدرسه‌های هوشمند"
        title="آموزش متوازن با تکیه بر پروژه‌های واقعی"
        description="HN5 با ترکیب علوم، فناوری و هنر، مسیر رشد اختصاصی برای هر دانش‌آموز می‌سازد. خانواده‌ها در تمام مراحل در کنار مدرسه هستند."
        imageSrc="/images/HN5-img-6.jpg"
        actions={[
          { label: 'برنامه Teknav', href: teknavUrl },
          { label: 'درخواست بازدید', href: '/contact', variant: 'secondary' },
        ]}
      />

      <section>
        <div className="container">
          <SectionHeading title="نبض مدرسه" subtitle="آمار زنده از فعالیت‌های پژوهشی و آموزشی" />
          <StatsBar stats={stats} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="دوره‌ها و مسیرهای یادگیری" subtitle="مناسب برای دانش‌آموزان متوسطه اول و دوم" />
          <CourseGrid courses={courses} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="کادر آموزشی و منتورها" subtitle="معلمان با تجربه بین‌رشته‌ای" />
          <TeacherGrid teachers={teachers.slice(0, 4)} />
        </div>
      </section>

      <MagazineSection items={activities} />

      <section>
        <div className="container">
          <SectionHeading title="بلاگ و روایت رصد" subtitle="گزیده‌ای از تازه‌ترین یادداشت‌ها" />
          <BlogList posts={posts.slice(0, 3)} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="راه‌های ارتباط فوری" subtitle={contactInfo.address} />
          <ContactCards phones={contactInfo.phones} messaging={contactInfo.messaging} />
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
