import React from 'react';

export const ChapterReader = () => {
  // Transitional bridge: use the approved demo reader UI as the live reader shell
  // until native parity is fully completed.
  return (
    <div className="h-screen w-full bg-black">
      <iframe
        title="UnaVida Reader"
        src="/press-demo/bookshelf_offline_redesign_chapter_1_6_reader.html"
        className="h-full w-full border-0"
      />
    </div>
  );
};

export default ChapterReader;
