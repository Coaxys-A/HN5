function ActivityGrid({ items }) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <article key={item.id} className="card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export default ActivityGrid;
