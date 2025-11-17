import Image from 'next/image';

function StaffGrid({ staff }) {
  return (
    <div className="card-grid">
      {staff.map((member) => (
        <article key={member.id} className="card staff-card">
          <Image src={member.image} alt={member.name} width={520} height={360} style={{ borderRadius: 'var(--radius-md)' }} />
          <h3>{member.name}</h3>
          <span>{member.role}</span>
          <p>{member.bio}</p>
        </article>
      ))}
    </div>
  );
}

export default StaffGrid;
