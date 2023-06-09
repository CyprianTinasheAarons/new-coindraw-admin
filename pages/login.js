import Head from "next/head";
import { useState } from "react";
import AuthService from "../api/auth.service";
import { useToast } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");
  const toast = useToast();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    setLoading(true);
    try {
      await AuthService.login(userData)
        .then((res) => {
          setLoading(false);
          localStorage.setItem("admin-email", userData.email);
          if (res.data.dataUrl == null) {
            location.href = "/twofactor";
          } else {
            setLoggedIn(true);
            setQr(res.data.dataUrl);
          }
        })
        .catch((error) => {
          setLoading(false);

          toast({
            title: "Account Error.",
            description: error.response.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  // 1234567890aA!

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      // For the 'Enter' key
      login();
    }
  };

  return (
    <>
      <Head>
        <title>Coindraw Admin | Login</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center h-screen py-12 sm:px-6 lg:px-8 bg-[#101422] ">
        <div className="w-full m-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <a href="/">
              <img
                className="w-auto h-12 mx-auto"
                src="logo.png"
                alt="Your Company"
              />
            </a>
            <h2 className="mt-6 text-xl tracking-tight text-center text-white">
              Sign in to Coindraw Admin
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
              {!loggedIn ? (
                <>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={userData.email}
                        autoComplete="email"
                        required
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mt-5 text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={handleChange}
                        value={userData.password}
                        autoComplete="current-password"
                        required
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => login()}
                      onKeyUp={handleKeyPress}
                      className="flex justify-center w-full px-4 py-3 my-5 text-sm font-medium text-white bg-[#101422] border border-transparent rounded-md shadow-sm "
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <p className="p-2 text-center text-white">
                    {" "}
                    Scan this QR code to login
                  </p>
                  <div className="flex justify-center p-2m-2">
                    <img src={qr} alt="PNG image"></img>
                  </div>
                  <div>
                    <a
                      href="/twofactor"
                      className="flex justify-center w-full px-4 py-3 my-5 text-sm font-medium text-white bg-[#101422] border border-transparent rounded-md shadow-sm "
                    >
                      Enter 2FA Code
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
