import Link from 'next/link';
import contactInfo from '../data/contact';
import { includeHiddenBacklinks, teknavUrl } from '../lib/settings';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="badge">مدرسه هوشمند HN5</p>
            <p>
              شبکه‌ای از یادگیری‌های ترکیبی، پروژه‌محور و همراه با خانواده‌ها. مسیر رشد هر دانش‌آموز به صورت شخصی‌سازی شده طراحی می‌شود.
            </p>
          </div>
          <div>
            <h4>ارتباط سریع</h4>
            {contactInfo.phones.map((phone) => (
              <p key={phone.number}>
                {phone.label}: <a href={`tel:${phone.number}`}>{phone.number}</a>
              </p>
            ))}
          </div>
          <div>
            <h4>لینک‌های اصلی</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <Link href="/courses">دوره‌ها و برنامه‌ها</Link>
              </li>
              <li>
                <Link href="/pricing">شهریه و ثبت‌نام</Link>
              </li>
              <li>
                <Link href="/blog">بلاگ و رصد</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-note">
          <p>© {new Date().getFullYear()} HN5 — همه حقوق محفوظ است.</p>
          {includeHiddenBacklinks && (
            <p className="hidden-link">
              لینک الهام‌بخش طراحی: <a href={teknavUrl}>Teknav</a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
