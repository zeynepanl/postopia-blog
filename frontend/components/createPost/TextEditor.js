import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// React Quill'i dinamik olarak import ediyoruz (SSR devre dışı)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Quill'in Snow temalı CSS dosyasını import ediyoruz.
import "react-quill/dist/quill.snow.css";

export default function TextEditor({ value, onChange, placeholder }) {
  const [text, setText] = useState("");

  // Dışarıdan gelen value değişince state'i güncelle
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (newValue) => {
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // İsteğe bağlı: Toolbar'ı özelleştirmek için modüller tanımlayabilirsiniz.
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],               // Temel metin stilleri
      [{ list: "bullet" }, { list: "ordered" }],     // Sıralı ve sırasız liste
      [{ color: [] }, { background: [] }],           // Renk ve arka plan seçimi
      ["image"], // 📸 Görsel ekleme butonu eklendi
      ["clean"],                                    // Biçim temizleme
    ],
  };
  

  return (
    <div className="quill-editor-container">
      <ReactQuill
        theme="snow"
        value={text}
        onChange={handleChange}
        modules={modules}
        placeholder={placeholder || "Enter your content here..."}
         className="text-black bg-white"
      />
    </div>
  );
}
