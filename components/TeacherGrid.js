import Image from 'next/image';

function TeacherGrid({ teachers }) {
  return (
    <div className="card-grid">
      {teachers.map((teacher) => (
        <article key={teacher.id} className="card teacher-card">
          <Image src={teacher.image} alt={teacher.name} width={520} height={360} style={{ borderRadius: 'var(--radius-md)' }} />
          <h3>{teacher.name}</h3>
          <span>{teacher.role}</span>
          <p>{teacher.bio}</p>
        </article>
      ))}
    </div>
  );
}

export default TeacherGrid;
