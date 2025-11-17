function ContactCards({ phones, messaging }) {
  return (
    <div className="contact-grid">
      {phones.map((phone) => (
        <article key={phone.number} className="card contact-card">
          <h3>{phone.label}</h3>
          <p>برای تماس مستقیم روی شماره کلیک کنید.</p>
          <a href={`tel:${phone.number}`}>{phone.number}</a>
        </article>
      ))}
      {messaging.map((item) => (
        <article key={item.href} className="card contact-card">
          <h3>{item.label}</h3>
          <p>گفتگوی فوری با تیم مدرسه</p>
          <a href={item.href} target="_blank" rel="noreferrer">
            شروع گفتگو
          </a>
        </article>
      ))}
    </div>
  );
}

export default ContactCards;
