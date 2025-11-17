import Image from 'next/image';

function Hero({ title, description, imageSrc, badge, actions = [] }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div>
          {badge && <span className="badge">{badge}</span>}
          <h1>{title}</h1>
          <p>{description}</p>
          {actions.length > 0 && (
            <div className="hero-actions">
              {actions.map((action) => (
                <a key={action.href} href={action.href} className={`btn ${action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}`}>
                  {action.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {imageSrc && (
          <figure>
            <Image src={imageSrc} alt="HN5" width={720} height={540} style={{ borderRadius: 'var(--radius-lg)' }} />
          </figure>
        )}
      </div>
    </section>
  );
}

export default Hero;
