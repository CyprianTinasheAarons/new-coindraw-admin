import { useState } from "react";
import AuthService from "../api/auth.service";
import { useToast } from "@chakra-ui/react";

function TwoFactor() {
  const [Data, setData] = useState({
    token: "",
  });
  const toast = useToast();

  const handleChange = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const signIn = async () => {
    try {
      await AuthService.login2fa({
        token: Data.token,
        email: localStorage.getItem("admin-email"),
      })
        .then((res) => {
          toast({
            title: "Success",
            description: "Logged in successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          localStorage.setItem("admin-token", res.data.accessToken);
          location.href = "/";
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Error",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      // For the 'Enter' key
      signIn();
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center h-screen py-12 sm:px-6 lg:px-8 bg-[#101422]">
        <div className="w-full m-auto">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <a href="/">
              <img
                className="w-auto h-12 mx-auto"
                src="logo.png"
                alt="Your Company"
              />
            </a>
            <h2 className="mt-6 text-xl font-bold tracking-tight text-center text-white">
              Enter 2-Factor Code
            </h2>
            <p className="text-sm text-center text-white">
              Get your code from your authenticator app.
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
              <div>
                <label
                  htmlFor="code"
                  className="block mt-5 text-sm font-medium text-gray-700"
                >
                  Code
                </label>
                <div className="mt-1">
                  <input
                    id="token"
                    name="token"
                    type="password"
                    autoComplete="current-code"
                    value={Data.token}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={() => signIn()}
                  onKeyUp={handleKeyPress}
                  className="flex justify-center w-full px-4 py-3 my-5 text-sm font-medium text-white bg-[#101422] border border-transparent rounded-md shadow-sm "
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TwoFactor;
