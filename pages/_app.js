import "../styles/globals.css";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Provider } from "react-redux";
import store from "../store";
import authService from "../api/auth.service";

const clientKey = process.env.THIRDWEB_CLIENT_KEY;

function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const tokenExpiration = tokenPayload.exp;
      const dateNow = new Date().getTime() / 1000;
      if (tokenExpiration - dateNow > 0) {
        return null;
      } else {
        authService.logout();
      }
    }
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <ThirdwebProvider
      activeChain="polygon"
      clientId="e017ab18ebd4c93486630472c508bd3a"
    >
      <ChakraProvider>
        <Provider store={store}>
          <Component {...pageProps} />{" "}
        </Provider>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
