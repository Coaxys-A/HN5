import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import SectionHeading from '../../components/SectionHeading';
import posts, { findPostBySlug } from '../../data/posts';

function BlogPostPage({ post }) {
  return (
    <Layout title={post.title}>
      <section>
        <div className="container">
          <SectionHeading title={post.title} subtitle={`${post.category} • ${new Date(post.createdAt).toLocaleDateString('fa-IR')}`} />
          <div className="blog-body">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={920}
              height={520}
              style={{ borderRadius: '24px', marginBottom: '1.5rem' }}
            />
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href="/blog" className="btn btn-secondary">
              بازگشت به بلاگ
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = findPostBySlug(params.slug);
  return {
    props: { post },
  };
}

export default BlogPostPage;
