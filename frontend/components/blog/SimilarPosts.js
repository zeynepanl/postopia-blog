import BlogCard from "@/components/home/BlogCard";

export default function SimilarPosts({ currentBlog, blogs }) {
  // Mevcut blogun tag'lerine sahip diğer blogları filtrele
  const similarPosts = blogs.filter(
    (blog) =>
      blog.id !== currentBlog.id && blog.tags.some((tag) => currentBlog.tags.includes(tag))
  );

  if (similarPosts.length === 0) return null; // Eğer benzer blog yoksa, gösterme

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Similar Posts</h2>

      {/* Benzer Postları Alt Alta Listeleme */}
      <div className="mt-6 flex flex-col gap-6">
        {similarPosts.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
