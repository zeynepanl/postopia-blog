import { useSelector } from "react-redux";
import BlogCard from "@/components/home/BlogCard";

export default function SimilarPosts({ currentBlog }) {
  // Redux store'dan tüm blogları alıyoruz (fetchBlogs thunk'ını daha önce çağırmış olmanız gerekir)
  const { blogs } = useSelector((state) => state.blog);

  // Mevcut blogun kategori ve etiket ID'lerini çıkarıyoruz
  const currentCategoryIds = currentBlog.categories?.map((cat) => cat._id) || [];
  const currentTagIds = currentBlog.tags?.map((tag) => tag._id) || [];

  // Diğer bloglarda, mevcut blog ile aynı kategori veya etikete sahip olanları filtreliyoruz.
  const similarPosts = blogs.filter((blog) => {
    if (blog._id === currentBlog._id) return false;

    const blogCategoryIds = blog.categories?.map((cat) => cat._id) || [];
    const blogTagIds = blog.tags?.map((tag) => tag._id) || [];

    // Kategori veya etiket kesişimi var mı kontrol ediyoruz.
    const hasSameCategory = blogCategoryIds.some((id) => currentCategoryIds.includes(id));
    const hasSameTag = blogTagIds.some((id) => currentTagIds.includes(id));

    return hasSameCategory || hasSameTag;
  });

  if (similarPosts.length === 0) return null; // Benzer post bulunamazsa bileşen render edilmez

  return (
    <div className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Similar Posts</h2>
      <div className="mt-6 flex flex-col gap-6">
        {similarPosts.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
