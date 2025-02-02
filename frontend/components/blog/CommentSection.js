import { useState, useRef } from "react";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function CommentSection() {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "This guide was incredibly helpful! I can't wait to use these tips on my next trip. Thank you!",
      author: "Emily Johnson",
      likes: 5,
    },
    {
      id: 2,
      text: "This guide was incredibly helpful! I can't wait to use these tips on my next trip. Thank you!",
      author: "Emily Johnson",
      likes: 5,
    },
    {
      id: 3,
      text: "This guide was incredibly helpful! I can't wait to use these tips on my next trip. Thank you!",
      author: "Emily Johnson",
      likes: 5,
    },
    {
      id: 4,
      text: "This guide was incredibly helpful! I can't wait to use these tips on my next trip. Thank you!",
      author: "Emily Johnson",
      likes: 5,
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef(null);

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          text: newComment,
          author: "Anonymous",
          likes: 0,
        },
      ]);
      setNewComment("");
      setIsFocused(false);
    }
  };

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

  const handleMouseDown = (e) => {
    e.preventDefault();
    let startX = e.pageX;
    let scrollLeft = scrollRef.current.scrollLeft;

    const handleMouseMove = (moveEvent) => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollLeft - (moveEvent.pageX - startX);
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
    <div className="mt-10">
      <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Comments</h2>

      {/* Yorum Ekleme Alanı */}
      <div className="mt-4">
        <textarea
          className={`w-full p-2 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-400 ${
    isFocused ? "h-28 border-purple-400" : "h-12"
  } text-black placeholder-gray-500`}
          placeholder="Leave a comment.."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {isFocused && (
          <div className="mt-2 flex justify-end gap-2">
            <button
              className="text-white bg-secondary hover:text-black"
              onClick={() => {
                setNewComment("");
                setIsFocused(false);
              }}
            >
              Cancel
            </button>
            <button
              className="bg-secondary border border-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100"
              onClick={handleAddComment}
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Yorum Kartları */}
      <div className="relative mt-6">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden w-full cursor-grab"
          onMouseDown={handleMouseDown}
        >
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="min-w-[300px] border p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg"
            >
              <p className="text-gray-700 text-md">{comment.text}</p>
              <div className="flex justify-between items-center mt-4 text-md text-gray-600">
                <div className="flex items-center gap-2">
                  <FaRegUser className="text-gray-500" />
                  <span>{comment.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaRegHeart className="text-lg cursor-pointer hover:text-red-500 transition" />
                  <span>{comment.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama Butonları (Aşağıda) */}
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
      </div>
    </div>
  );
}
