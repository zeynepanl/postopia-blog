import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  fetchComments,
  replyToComment,
  updateComment,
  deleteComment,
} from "@/redux/slices/commentSlice";

export default function CommentSection({ blogId }) {
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const dispatch = useDispatch();
  const { comments = [], loading, error } = useSelector((state) => state.comment);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchComments({ blogId, token }));
    }
  }, [blogId, dispatch, token]);

  // ✅ Yeni yorum ekleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await dispatch(addComment({ blogId, text, token }));
    setText("");
    dispatch(fetchComments({ blogId, token }));
  };

  // ✅ Yoruma yanıt ekleme işlemi
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await dispatch(replyToComment({ commentId, text: replyText, token }));
    setReplyText("");
    setReplyingTo(null);
    dispatch(fetchComments({ blogId, token }));
  };

  // ✅ Güncelleme başlat (Yorumu input alanına çevir)
  const startEditing = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedText(currentText);
  };

  // ✅ Güncelleme işlemi
  const handleUpdate = async (commentId) => {
    if (editedText.trim() && editedText !== comments.find((c) => c._id === commentId)?.text) {
      await dispatch(updateComment({ commentId, text: editedText, token }));
      dispatch(fetchComments({ blogId, token }));
    }
    setEditingCommentId(null);
  };

  // ✅ Yorumu Silme İşlemi
  const handleDelete = async (commentId) => {
    await dispatch(deleteComment({ commentId, token }));
    dispatch(fetchComments({ blogId, token }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Yorumlar</h3>

      {/* 📌 **Yorum Listeleme** */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-500">{error.message || "Yorumlar yüklenirken hata oluştu."}</p>
      ) : !comments || comments.length === 0 ? (
        <p className="text-gray-500">Henüz yorum yok.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment?._id} className="border p-3 rounded-md bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div className="w-full">
                  {editingCommentId === comment._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border rounded-md p-1 w-full text-gray-700"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <button
                        onClick={() => handleUpdate(comment._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-800">{comment?.text || "Yorum içeriği mevcut değil"}</p>
                  )}
                  <span className="text-sm text-gray-500">
                    {comment?.user?.username || "Anonim"} -{" "}
                    {comment?.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Bilinmeyen tarih"}
                  </span>
                </div>
                {!editingCommentId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(comment._id, comment.text)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Güncelle
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Sil
                    </button>
                  </div>
                )}
              </div>

              {/* 📌 **Yanıtları Listeleme** */}
              {comment.replies &&
                Array.isArray(comment.replies) &&
                comment.replies.filter(Boolean).map((reply) => (
                  <li key={reply?._id} className="text-sm text-gray-600 p-2 ml-6 border-l-2 pl-2">
                    <p>{reply?.text || "Yanıt içeriği bulunamadı"}</p>
                    <span className="text-xs text-gray-500">
                      {reply?.user?.username || "Anonim"} -{" "}
                      {reply?.createdAt ? new Date(reply.createdAt).toLocaleDateString() : "Bilinmeyen tarih"}
                    </span>
                  </li>
                ))}

              {/* 📌 **Yanıt Ekleme Butonu** */}
              <button onClick={() => setReplyingTo(comment._id)} className="text-sm text-blue-500 mt-2">
                Yanıtla
              </button>

              {/* 📌 **Yanıt Ekleme Formu** */}
              {replyingTo === comment._id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="mt-2 ml-6">
                  <textarea
                    className="border p-2 rounded-md w-full text-sm"
                    rows="2"
                    placeholder="Yanıtınızı yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm mt-2">
                    Yanıt Gönder
                  </button>
                </form>
              )}
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
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md" disabled={loading}>
          {loading ? "Gönderiliyor..." : "Yorum Ekle"}
        </button>
      </form>
    </div>
  );
}
