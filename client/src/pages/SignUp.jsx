import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center"> Sign Up</h1>
      <form
        action="
      "
        className="flex flex-col   gap-4"
      >
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Have an account?{" "}
          <Link to="/sign-in">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
