import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  fetchComments,
  replyToComment,
  updateComment,
  deleteComment,
} from "@/redux/slices/commentSlice";
import { FaRegUser, FaHeart, FaEllipsisH, FaReply } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function CommentSection({ blogId }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const dispatch = useDispatch();
  const { comments = [], loading, error } = useSelector((state) => state.comment);
  const { token } = useSelector((state) => state.auth);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchComments({ blogId, token }));
    }
  }, [blogId, dispatch, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await dispatch(addComment({ blogId, text, token }));
    setText("");
    setIsFocused(false);
    dispatch(fetchComments({ blogId, token }));
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    await dispatch(replyToComment({ commentId, text: replyText, token }));
    setReplyText("");
    setReplyingTo(null);
    dispatch(fetchComments({ blogId, token }));
  };

  const startEditing = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedText(currentText);
    setOpenMenuId(null);
  };

  const handleUpdate = async (commentId) => {
    if (
      editedText.trim() &&
      editedText !== comments.find((c) => c._id === commentId)?.text
    ) {
      await dispatch(updateComment({ commentId, text: editedText, token }));
      dispatch(fetchComments({ blogId, token }));
    }
    setEditingCommentId(null);
  };

  const handleDelete = async (commentId) => {
    await dispatch(deleteComment({ commentId, token }));
    dispatch(fetchComments({ blogId, token }));
    setOpenMenuId(null);
  };

  // Yatay scroll fonksiyonları
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // onMouseDown içerisinde, input/textarea/button elemanlarına dokunulursa scroll davranışını atla
  const handleMouseDown = (e) => {
    const tagName = e.target.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "BUTTON") {
      return;
    }
    e.preventDefault();
    let startX = e.pageX;
    let scrollStart = scrollRef.current.scrollLeft;
    const handleMouseMove = (moveEvent) => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollStart - (moveEvent.pageX - startX);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="mt-10 w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Comments</h2>

      {/* Yorum Ekleme Alanı */}
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <textarea
            className={`w-full p-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-400 ${
              isFocused ? "h-28 border-purple-400" : "h-10"
            } text-black placeholder-gray-500`}
            placeholder="Leave a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {isFocused && (
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                className="text-gray-600 bg-white b border-gray-200 hover:text-black"
                onClick={() => {
                  setText("");
                  setIsFocused(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                Send
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Yorum Kartları - Yatay Scroll */}
      <div className="relative mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error.message || "Error loading comments."}
          </p>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-hidden w-full cursor-grab"
              onMouseDown={handleMouseDown}
            >
              {comments.map((comment) => (
                <div
                  key={comment?._id}
                  className="relative min-w-[300px] border p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg"
                >
                  {/* Sağ Üst: Üç Nokta Menüsü */}
                  {editingCommentId !== comment._id && (
                    <div className="absolute top-2 right-2 bg-white">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === comment._id ? null : comment._id)
                        }
                        className="text-gray-600 bg-white hover:text-gray-800 "
                      >
                        <FaEllipsisH />
                      </button>
                      {openMenuId === comment._id && (
                        <div className="absolute right-0 mt-2 w-28 bg-transparent border rounded shadow-md z-20 ">
                          <button
                            onClick={() => startEditing(comment._id, comment.text)}
                            className="w-full text-left px-2 py-1 bg-white text-black hover:bg-gray-100 "
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="w-full text-left px-2 py-1 bg-white text-black hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Yorum İçeriği */}
                  {editingCommentId === comment._id ? (
                    <div className="space-y-2 text-black ">
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(comment._id)}
                          className="px-4 py-2 bg-purple-600  taxt-black rounded hover:bg-purple-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 text-md break-words">{comment?.text}</p>
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-black">
                          <FaRegUser className="text-gray-500" />
                          <span>{comment?.user?.username || "Anonymous"}</span>
                        </div>
                      </div>

                      {/* Sol Alt: Yanıtla ve Beğeni İkonları */}
                      <div className="mt-4 flex items-center gap-4">
                        <button
                          onClick={() => setReplyingTo(comment._id)}
                          className="text-gray-700 bg-white hover:underline"
                        >
                          <FaReply />
                        </button>
                        <div className="flex items-center gap-1">
                          <FaHeart className="text-gray-700" />
                          <span>{comment?.likes || 0}</span>
                        </div>
                      </div>

                      {/* Yorum Yanıtlarını Göster */}
                      {comment?.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 border-l pl-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply?._id}
                              className="w-full border p-3 rounded-lg shadow-sm bg-gray-100 transition hover:shadow-md"
                            >
                              <p className="text-gray-700 text-md">{reply?.text}</p>
                              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <FaRegUser className="text-gray-500" />
                                <span>{reply?.user?.username || "Anonymous"}</span>
                                <div className="flex items-center gap-1 ml-auto">
                                  <FaHeart className="text-gray-700" />
                                  <span>{reply?.likes || 0}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Yanıtlama Alanı */}
                  {replyingTo === comment._id && (
                    <form
                      onSubmit={(e) => handleReplySubmit(e, comment._id)}
                      className="mt-4"
                    >
                      <textarea
                        className="w-full p-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-400 text-black placeholder-gray-500"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows="3"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Submit Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>

            {/* Sayfalama Butonları */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition flex items-center justify-center"
                onClick={scrollLeft}
              >
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <button
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition flex items-center justify-center"
                onClick={scrollRight}
              >
                <FiArrowRight className="text-xl text-gray-700" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
