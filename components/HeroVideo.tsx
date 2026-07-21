export default function HeroVideo() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* 1. Arka Plan Videosu */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>

      {/* 2. Koyu Karartma Katmanı (Overlay) */}
      {/* Yazıların video üzerinde rahat okunabilmesi için şarttır */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* 3. Video Üzerindeki Yazı ve İçerik */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 uppercase drop-shadow-md">
          Stone Tech Creators
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-light text-gray-200 max-w-2xl mx-auto drop-shadow">
          Experience and innovation at your service.
          <br />
          Customer satisfaction is our main goal.
        </p>
      </div>
    </div>
  );
}