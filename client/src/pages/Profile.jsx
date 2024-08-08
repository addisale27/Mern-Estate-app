import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../Firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";
import { Error } from "mongoose";
import { Link } from "react-router-dom";
function Profile() {
  //fire base storag
  // allow read;
  // allow write:if
  // request.resource.size<2*1024*1024 &&
  // request.resource.contentType.matches('images/.*')
  const [userListings, setUserListing] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [uploadPer, setUploadPer] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [updateDone, setUpdateDone] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);
  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPer(Math.round(progress));
      },
      (error) => {
        //console.log(error);
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, photo: downloadURL });
        });
      }
    );
  }
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) throw new Error(data.message);
      dispatch(updateSuccess(data));
      setUpdateDone(true);
      console.log(data);
    } catch (error) {
      console.log(error);
      dispatch(updateFailure(error.message));
    }
  }
  async function handleDelete() {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);

      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }
  async function handleSignOut() {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) throw new Error(data.message);
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }
  async function handleShowListings() {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      if (data.success === false) throw new Error("something went wrong!");
      setUserListing(data);
    } catch (error) {
      console.log(error);
      setShowListingError(true);
    }
  }
  // console.log(userListings);
  async function handleDeleteListing(id) {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) throw new Error(data.message);
      setUserListing((listings) => listings.filter((list) => list._id !== id));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="max-w-xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className=" flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.photo || currentUser.photo}
          alt=""
          className="w-24 h-24 rounded-full self-center mt-2 cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm text-center">
          {fileError ? (
            <span className="text-red-700">
              Unable to upload image(Image must be less than 2mb)
            </span>
          ) : uploadPer > 0 && uploadPer < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadPer}%`}</span>
          ) : uploadPer === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg border"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />{" "}
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg border"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />{" "}
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg border"
          onChange={handleChange}
        />
        <button
          className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? `loading` : `update`}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 rounded-lg p-3 uppercase text-center text-white hover:opacity-95"
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between my-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>

      <p className="text-red-700 mt-2">{error ? error : ""}</p>
      {updateDone && (
        <p className="text-green-700 font-bold">
          Your profile updated successfully!
        </p>
      )}

      <>
        <button className="text-green-700 w-full" onClick={handleShowListings}>
          Show listing
        </button>
        <p className="text-red-700">
          {showListingError ? `Something went Wrong to show the Listings!` : ""}
        </p>
      </>

      {userListings.length > 0 && (
        <div className=" flex flex-col gap-4">
          <h1 className="font-semibold text-center mt-7 text-2xl capitalize">
            Your listings
          </h1>
          <div>
            {userListings.map((listings) => (
              <div
                key={listings._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4  "
              >
                <Link to={`/listing/${listings._id}`}>
                  <img
                    src={listings.imgUrls[0]}
                    alt="Listing cover"
                    className="w-16 h-16 object-contain "
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold flex-1 hover:underline truncate "
                  to={`/listing/${listings._id}`}
                >
                  <p>{listings.name}</p>
                </Link>
                <div className="flex flex-col gap-2 items-center">
                  <button
                    className="text-red-700 uppercase"
                    onClick={() => handleDeleteListing(listings._id)}
                  >
                    Delete
                  </button>
                  <button className="text-green-700 uppercase">
                    <Link to={`/update-listing/${listings._id}`}>Edit</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
