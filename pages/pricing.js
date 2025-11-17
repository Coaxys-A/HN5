import Layout from '../components/Layout';
import SectionHeading from '../components/SectionHeading';
import PricingPlans from '../components/PricingPlans';
import pricingPlans from '../data/pricing';

function PricingPage() {
  return (
    <Layout title="شهریه و ثبت‌نام">
      <section>
        <div className="container">
          <SectionHeading title="طرح‌های شهریه" subtitle="تمامی مسیرها شامل پشتیبانی خانواده و گزارش رشد هستند" />
          <PricingPlans plans={pricingPlans} />
        </div>
      </section>

      <section>
        <div className="container magazine" style={{ marginTop: '2rem' }}>
          <div>
            <p className="badge">پیوستن به HN5</p>
            <h3>جلسه معارفه و بازدید حضوری</h3>
            <p>برای تکمیل ثبت‌نام ابتدا جلسه آشنایی برگزار می‌شود تا نیازها و علایق دانش‌آموز بررسی گردد.</p>
          </div>
          <a href="tel:+982188000101" className="btn btn-secondary">
            هماهنگی فوری
          </a>
        </div>
      </section>
    </Layout>
  );
}

export default PricingPage;
