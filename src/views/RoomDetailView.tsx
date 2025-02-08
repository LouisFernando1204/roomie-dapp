import image1 from "/images/pic_1_upscale.jpeg";
import image2 from "/images/pic_2_upscale.jpeg";
import image3 from "/images/pic_3_upscale.jpeg";

// Reviews Data
const reviews = [
  {
    id: 1,
    user: "Andrew Mulyadi",
    date: "26 Jan 2025",
    rating: 5.0,
    review:
      "Lokasi sangat strategis, kamar dan fasilitas lainnya lengkap untuk liburan keluarga...",
    tripType: "Trip Keluarga",
    photos: 3,
  },
  {
    id: 2,
    user: "Mellisa Mellisa",
    date: "12 Jan 2025",
    rating: 5.0,
    review: "Good location, big room and good breakfast",
    tripType: "Trip Keluarga",
  },
];

const facilities = [
  { icon: "🏊", name: "Kolam Renang" },
  { icon: "📶", name: "WiFi" },
  { icon: "🅿️", name: "Parkir" },
  { icon: "🏋️", name: "Pusat Kebugaran" },
  { icon: "❄️", name: "AC" },
  { icon: "🚌", name: "Antar Jemput Bandara" },
  { icon: "🛎️", name: "Resepsionis 24 Jam" },
  { icon: "🛗", name: "Lift" },
  { icon: "🍽️", name: "Restoran" },
  { icon: "👶", name: "Fasilitas Anak" },
  { icon: "🛋️", name: "Ruang Tamu" },
  { icon: "🏢", name: "Fasilitas Rapat" },
];

const RoomDetail = () => {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("en-CA");

  return (
    <div className="w-full mt-24 space-y-6 px-12">
      {/* Image Gallery */}
      <div className="flex">
        <div className="w-2/3">
          <img src={image1} alt="Main Room" className="w-full h-auto" />
        </div>
        <div className="w-1/3 flex flex-col space-y-2 ps-2">
          <img src={image2} alt="Room View 1" className="w-full h-auto" />
          <img src={image3} alt="Room View 2" className="w-full h-auto" />
        </div>
      </div>

      {/* About */}
      <div className="px-4 md:px-12">
        <h1 className="text-2xl font-bold">About this place</h1>
        <p className="text-lg font-light">
          Castle Oodeypore is a palatial homestay, offering a unique experience.
          It is a home that hosts beautiful people and connects families,
          friends, and travelers alike, a castle that reminds you of the bygone
          era, a place for our guests to revel in the timeless beauty of nature.
          <br />
          <br />
          Built-in the year 2021, Castle Oodeypore is an architectural marvel
          amidst the foothills of the Aravallis, made from the red sandstone of
          Bikaner, making it the only red sandstone property in Udaipur.
        </p>
      </div>

      {/* Fasilitas Populer Section */}
      <div className="p-6 border-t-2">
        <h2 className="text-2xl font-bold mb-4">Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {facilities.map((facility, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-lg">{facility.icon}</span>
              <span className="text-gray-700">{facility.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="p-6 border-t-2">
        <h2 className="text-2xl font-bold mb-2">Review</h2>
        <div className="flex items-center space-x-2">
          <span className="text-4xl font-bold text-gray-800">4.7</span>
          <span className="text-xl text-gray-600">/5 Fantastis</span>
          <span className="text-gray-500">Dari 56 review</span>
        </div>

        {/* Reviews List */}
        <div className="flex items-center space-x-4 mt-4 overflow-x-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-4 rounded-lg shadow-md min-w-[300px] flex-shrink-0 border"
            >
              <div className="flex items-center justify-between text-gray-600">
                <span className="font-semibold">{review.rating}/5</span>
                <span className="text-sm">{review.date}</span>
              </div>
              <h3 className="font-bold">{review.user}</h3>
              <p className="text-sm text-gray-500">{review.tripType}</p>
              <p className="text-gray-700 mt-2">{review.review}</p>
              {review.photos && (
                <div className="mt-2 text-sm text-blue-500">
                  {review.photos} Foto
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Bar */}
      <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 bg-secondary p-5 rounded-lg shadow-lg z-10 max-w-6xl w-full hidden md:flex items-center justify-between">
        {/* Room Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Nama Penginapan, Location</h1>
          <h2 className="text-lg text-gray-700">
            2 Bedrooms, 4 Beds, 2 Dedicated Bathrooms
          </h2>
        </div>

        {/* Date Selection */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-darkOrange mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={today}
              className="p-3 border rounded-lg bg-transparent w-full focus:ring-2 focus:ring-darkOrange focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-darkOrange mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={tomorrow}
              className="p-3 border rounded-lg bg-transparent w-full focus:ring-2 focus:ring-darkOrange focus:outline-none"
            />
          </div>
        </div>

        {/* Price & Booking */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <h1 className="text-xl font-bold">0.04 Eth</h1>
            <h2 className="text-md text-gray-700">/night</h2>
          </div>
          <button className="bg-darkOrange px-6 py-3 rounded-md hover:scale-105 duration-200 flex items-center gap-2 shadow-md text-white font-semibold">
            Book Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
