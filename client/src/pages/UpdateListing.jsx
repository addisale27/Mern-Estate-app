import { useEffect, useRef, useState } from "react";
import { app } from "../Firebase";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

function UpdateListing() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imgUrls: [],
    name: "",
    description: "",
    type: "rent",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 1000,
    discountPrice: 1000,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const listingId = params.id;
  useEffect(function () {
    async function fetchId() {
      try {
        // console.log(listingId);
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        //console.log(data);
        if (data.success === false) throw new Error(data.message);
        setFormData(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchId();
  }, []);
  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }
  function handleImageUpload() {
    if (files.length > 0 && files.length + formData.imgUrls.length < 7) {
      setUploading(true);
      setImageUploadError(null);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imgUrls: formData.imgUrls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(null);
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (2 mb max for each image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload less than 6 images at a time!");
      setUploading(false);
    }
  }

  function handleDeleteImage(id) {
    setFormData({
      ...formData,
      imgUrls: formData.imgUrls.filter((_, index) => index !== id),
    });
  }
  function handleChange(e) {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(false);
      setLoading(true);
      if (formData.imgUrls.length < 1)
        throw new Error("You must upload at least one image!");
      if (formData.regularPrice < formData.discountPrice)
        throw new Error("Discount Price must be less than regular price!");
      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();

      if (data.success === false) throw new Error(data.message);
      setLoading(false);
      navigate(`/listing/${listingId}`);
      console.log(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="rounded-lg border p-3"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="rounded-lg border p-3"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="rounded-lg border p-3"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                min={1000}
                max={1000000000}
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col  items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-gray-400 text-xs">($ /Month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  min={1000}
                  max={1000000000}
                  onChange={handleChange}
                  value={formData.discountPrice}
                />

                <div className="flex flex-col  items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-gray-400 text-xs">($ /Month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max-6)
            </span>{" "}
          </p>
          <div className="flex gap-4 ">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="border border-gray-300 p-3 rounded w-full"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageUpload}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? `uploading` : `upload`}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}
          {formData.imgUrls.map((image, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 border"
            >
              <img
                src={image}
                alt="listing image"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(index)}
                type="button"
                className="text-red-700 p-3 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            disabled={loading}
            className="p-3 bg-slate-700 rounded-lg uppercase hover:opacity-95 text-white disabled:opacity-80"
          >
            {loading ? `Updating...` : `Update listing`}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default UpdateListing;
