import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, fetchComments } from "@/redux/slices/commentSlice";

export default function CommentSection({ blogId }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comment);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchComments({ blogId, token }));
    }
  }, [blogId, dispatch, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(addComment({ blogId, text, token }));
    setText(""); // Yorumu gönderdikten sonra input'u temizle
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Yorumlar</h3>

      {/* 📌 **Yorum Listeleme** */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Henüz yorum yok.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="border p-2 rounded-md">
              <p className="text-gray-700">{comment.text}</p>
              <span className="text-sm text-gray-500">
                {comment.user?.username ? comment.user.username : "Anonim"} -{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 📌 **Yorum Ekleme Formu** */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
        <textarea
          className="border p-2 rounded-md w-full"
          rows="3"
          placeholder="Yorumunuzu yazın..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "Yorum Ekle"}
        </button>
      </form>
    </div>
  );
}
