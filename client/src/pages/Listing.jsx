import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Correct import path
import "swiper/css/bundle";
import "swiper/css/navigation"; // Import navigation CSS

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Listing() {
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(listing);

  const params = useParams();

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) throw new Error(data.message);

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.id]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">loading...</p>}
      {error && <p className="text-red-700 text-2xl">something went wrong!</p>}
      {listing && !loading && !error && (
        <>
          <Swiper
            modules={[Navigation]} // Add modules prop
            navigation={true} // Enable navigation
          >
            {listing.imgUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: `cover`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
}

export default Listing;
