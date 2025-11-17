import Layout from '../../components/Layout';
import SectionHeading from '../../components/SectionHeading';
import BlogList from '../../components/BlogList';
import posts from '../../data/posts';

function BlogIndexPage() {
  return (
    <Layout title="بلاگ">
      <section>
        <div className="container">
          <SectionHeading title="بلاگ HN5" subtitle="یادداشت‌ها، رصد رویدادها و اخبار شبکه Teknav" />
          <BlogList posts={posts} />
        </div>
      </section>
    </Layout>
  );
}

export default BlogIndexPage;
