import Image from 'next/image';

function CourseGrid({ courses }) {
  return (
    <div className="card-grid">
      {courses.map((course) => (
        <article key={course.id} className="card">
          <Image src={course.image} alt={course.title} width={640} height={420} style={{ borderRadius: '18px' }} />
          <p className="badge" style={{ marginTop: '1rem' }}>
            {course.category}
          </p>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            {course.level} • {course.duration}
          </p>
        </article>
      ))}
    </div>
  );
}

export default CourseGrid;
