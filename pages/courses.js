import Layout from '../components/Layout';
import SectionHeading from '../components/SectionHeading';
import CourseGrid from '../components/CourseGrid';
import ActivityGrid from '../components/ActivityGrid';
import courses from '../data/courses';
import activities from '../data/activities';

const extraTracks = [
  { id: 'a', title: 'کلینیک کوچینگ تحصیلی', description: 'تحلیل پیشرفت هفتگی با گزارش قابل اشتراک برای خانواده‌ها.' },
  { id: 'b', title: 'برنامه جامعه‌پذیری دیجیتال', description: 'کارگاه‌های امنیت آنلاین و سواد رسانه برای پایه‌های متوسطه.' },
  { id: 'c', title: 'اردوهای یادگیری در شهر', description: 'بازدید از مراکز علمی و استارتاپی با تمرکز بر مشاهده میدانی.' },
];

function CoursesPage() {
  return (
    <Layout title="دوره‌ها">
      <section>
        <div className="container">
          <SectionHeading title="مسیرهای اصلی" subtitle="دوره‌ها با رویکرد پروژه‌محور ارائه می‌شوند" />
          <CourseGrid courses={courses} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="کارگاه‌های توسعه فردی" subtitle="برنامه‌های تکمیلی برای مهارت‌های نرم" />
          <ActivityGrid items={extraTracks} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="ارتباط با Teknav" subtitle="فعالیت‌هایی که با شبکه Teknav انجام می‌شود" />
          <ActivityGrid items={activities} />
        </div>
      </section>
    </Layout>
  );
}

export default CoursesPage;
