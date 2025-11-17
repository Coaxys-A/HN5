import { teknavUrl } from '../lib/settings';

function MagazineSection({ items }) {
  return (
    <section>
      <div className="container magazine">
        <div style={{ maxWidth: '520px' }}>
          <p className="badge">رصد — نشریه Teknav</p>
          <h3>روایت‌های تازه از مدرسه و زیست‌بوم فناوری</h3>
          <p>
            هر هفته خلاصه مهم‌ترین پروژه‌ها، گفتگو با پژوهشگران و فرصت‌های شبکه Teknav را در نشریه رصد دنبال کنید. دکمه زیر آرشیو آنلاین را باز می‌کند.
          </p>
          <a href={teknavUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
            ورود به Teknav
          </a>
        </div>
        <ul className="magazine-list">
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default MagazineSection;
