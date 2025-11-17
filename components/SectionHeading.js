function SectionHeading({ title, subtitle, alignment = 'right' }) {
  return (
    <div className="section-heading" style={{ textAlign: alignment }}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default SectionHeading;
