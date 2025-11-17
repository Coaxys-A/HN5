import Link from 'next/link';
import Image from 'next/image';

function BlogCard({ post }) {
  return (
    <article className="card blog-card">
      <Image src={post.coverImage} alt={post.title} width={640} height={380} style={{ borderRadius: 'var(--radius-md)' }} />
      <p className="badge" style={{ marginTop: '1rem' }}>
        {post.category} • {new Date(post.createdAt).toLocaleDateString('fa-IR')}
      </p>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="btn btn-secondary">
        ادامه مطلب
      </Link>
    </article>
  );
}

export default BlogCard;
