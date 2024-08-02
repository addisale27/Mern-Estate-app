import { useSelector } from "react-redux";
function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className=" flex flex-col gap-4">
        <img
          src={currentUser.photo}
          alt=""
          className="w-24 h-24 rounded-full self-center mt-2 cursor-pointer"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="p-3 rounded-lg border"
        />{" "}
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 rounded-lg border"
        />{" "}
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg border"
        />
        <button className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95">
          update
        </button>
      </form>
      <div className="flex justify-between my-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
