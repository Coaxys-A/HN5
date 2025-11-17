import BlogCard from './BlogCard';

function BlogList({ posts }) {
  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default BlogList;
