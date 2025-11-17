function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-card">
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
