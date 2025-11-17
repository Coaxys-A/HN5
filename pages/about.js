import Layout from '../components/Layout';
import SectionHeading from '../components/SectionHeading';
import ActivityGrid from '../components/ActivityGrid';
import StaffGrid from '../components/StaffGrid';
import activities from '../data/activities';
import staff from '../data/staff';

const highlights = [
  {
    title: 'همراهی خانواده‌ها',
    body: 'برنامه «خانه دوم» هر ماه فرصت گفتگو و طراحی مسیر رشد مشترک را فراهم می‌کند.',
  },
  {
    title: 'آموزش متوازن',
    body: 'در کنار علوم پایه، مهارت‌های اجتماعی و هنر رسانه‌ای بخش ثابت برنامه هستند.',
  },
  {
    title: 'آزمایشگاه باز',
    body: 'لابراتوارهای HN5 برای مدارس همکار نیز در دسترس است تا یادگیری شبکه‌ای گسترش یابد.',
  },
];

const timeline = [
  { year: '۱۳۹۲', detail: 'تأسیس هسته پژوهشی مدرسه و آغاز دوره‌های تلفیقی علوم و هنر.' },
  { year: '۱۳۹۶', detail: 'اتصال به شبکه Teknav و راه‌اندازی استودیوی روایت دیجیتال.' },
  { year: '۱۴۰۰', detail: 'پیاده‌سازی سامانه پرونده رشد فردی و کلینیک گفت‌وگو با خانواده‌ها.' },
  { year: '۱۴۰۳', detail: 'بازطراحی فضاهای یادگیری و مهاجرت سایت عمومی به Next.js.' },
];

function AboutPage() {
  return (
    <Layout title="درباره ما">
      <section>
        <div className="container">
          <SectionHeading title="چرا HN5؟" subtitle="روایتی کوتاه از مأموریت مدرسه" />
          <div className="card-grid">
            {highlights.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="برنامه‌های ویژه" subtitle="هسته‌های فعال در زیست‌بوم مدرسه" />
          <ActivityGrid items={activities} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="تیم راهبری" subtitle="مدیران و مشاوران ارشد" />
          <StaffGrid staff={staff} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="مسیر رشد" subtitle="نگاهی به رویدادهای مهم" />
          <div className="timeline">
            {timeline.map((item) => (
              <div key={item.year} className="timeline-item">
                <h3>{item.year}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AboutPage;
