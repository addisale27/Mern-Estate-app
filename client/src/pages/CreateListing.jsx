import { useState } from "react";
import { app } from "../Firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ imageUrls: [] });
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);

  console.log(files);
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
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
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
            imageUrls: formData.imageUrls.concat(urls),
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
  console.log(formData);
  console.log(imageUploadError);
  function handleDeleteImage(id) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((image, index) => index !== id),
    });
  }
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="rounded-lg border p-3"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="rounded-lg border p-3"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="rounded-lg border p-3"
            id="address"
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="pariking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                min={1}
                max={10000}
              />
              <div className="flex flex-col  items-center">
                <p>Regular price</p>
                <span className="text-gray-400 text-xs">($ /Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                min={1}
                max={10000}
              />
              <div className="flex flex-col  items-center">
                <p>Discounted price</p>
                <span className="text-gray-400 text-xs">($ /Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              the image will be the cover (max-6)
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
          <button className="p-3 bg-slate-700 rounded-lg uppercase hover:opacity-95 text-white disabled:opacity-80">
            create listing
          </button>
          {imageUploadError && (
            <p className="text-red-700">{imageUploadError}</p>
          )}
          {formData.imageUrls.map((image, index) => (
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
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
