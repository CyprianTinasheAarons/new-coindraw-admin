import "../styles/globals.css";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Provider } from "react-redux";
import store from "../store";

function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <ThirdwebProvider activeChain="polygon">
      <ChakraProvider>
        <Provider store={store}>
          <Component {...pageProps} />{" "}
        </Provider>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
