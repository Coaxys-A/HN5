import Layout from '../components/Layout';
import SectionHeading from '../components/SectionHeading';
import TeacherGrid from '../components/TeacherGrid';
import StaffGrid from '../components/StaffGrid';
import teachers from '../data/teachers';
import staff from '../data/staff';

function TeachersPage() {
  return (
    <Layout title="کادر آموزشی">
      <section>
        <div className="container">
          <SectionHeading title="مربیان و معلمان" subtitle="ترکیبی از تجربه آموزشی و صنعت" />
          <TeacherGrid teachers={teachers} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="تیم راهبری" subtitle="افرادی که مسیر مدرسه را طراحی می‌کنند" />
          <StaffGrid staff={staff} />
        </div>
      </section>
    </Layout>
  );
}

export default TeachersPage;
