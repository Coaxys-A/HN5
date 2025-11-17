import Layout from '../components/Layout';
import SectionHeading from '../components/SectionHeading';
import ContactCards from '../components/ContactCards';
import contactInfo from '../data/contact';

function ContactPage() {
  return (
    <Layout title="تماس">
      <section>
        <div className="container">
          <SectionHeading title="ارتباط مستقیم با مدرسه" subtitle={contactInfo.officeHours} />
          <ContactCards phones={contactInfo.phones} messaging={contactInfo.messaging} />
        </div>
      </section>

      <section>
        <div className="container">
          <SectionHeading title="نشانی مدرسه" subtitle="برای بازدید حضوری هماهنگی تلفنی الزامی است" />
          <div className="card" style={{ display: 'grid', gap: '1rem' }}>
            <p>{contactInfo.address}</p>
            <div style={{ borderRadius: '20px', overflow: 'hidden', height: '320px' }}>
              <iframe
                title="HN5 location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.9874740040515!2d51.435!3d35.757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzI1LjAiTiA1McKwMjYnMDYuMCJF!5e0!3m2!1sfa!2sir!4v1717670400000!5m2!1sfa!2sir"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default ContactPage;
