import { Network, Alchemy } from "alchemy-sdk";
import { useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Elites = ({ eliteAddress }) => {
  const [loading, isLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [copied, setCopied] = useState(false);

  const settings = {
    apiKey: "n7m6r-iPJHAUCQUuKsV8zdr4jzW9ASnG", // Replace with your Alchemy API Key.
    network: Network.MATIC_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  const getElites = async () => {
    isLoading(true);

    await alchemy.nft
      .getOwnersForContract(eliteAddress)
      .then((elites) => {
        console.log(elites);
        setTotal(elites?.owners?.length);
        setAddresses(elites?.owners.map((owner) => `${owner}`));

        isLoading(false);
      })
      .catch((error) => {
        console.log(error);
        isLoading(false);
      });
  };

  useEffect(() => {
    if (eliteAddress) {
      getElites();
    }
  }, []);

  return (
    <div className="py-2">
      <div>
        <button
          onClick={() => getElites()}
          className="flex flex-col items-center justify-center w-full p-2 space-y-2 text-center text-white ounded-md bg-green"
        >
          {loading ? (
            <Spinner size={"sm"} />
          ) : (
            <p className="text-xs font-semibold ">Get Elite Addresses</p>
          )}
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Spinner size={"sm"} />
        </div>
      ) : (
        <div>
          {copied ? (
            <p className="py-2 text-xs text-center text-black">Copied!</p>
          ) : (
            <p className="text-xs text-center text-green ">Click to copy</p>
          )}
          <CopyToClipboard text={addresses} onCopy={() => setCopied(true)}>
            <div className="flex flex-col items-center justify-center p-2 space-y-2 text-center border rounded-md bg-gray-50 border-green">
              <p className="text-xs font-semibold text-green">
                {total} Elite Addresses
              </p>
              <div className="flex flex-col justify-start">
                {addresses?.map((address, index) => (
                  <p
                    key={address}
                    className="text-xs font-semibold text-left text-gray-500"
                  >
                    {index} . {address}
                  </p>
                ))}
              </div>
            </div>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

export default Elites;

0x04a9c727b7decbba3802142fd2c4042174caa83f,
  0x423a46dbc1965f2a86c6e424356b5a18ef742955,
  0x5fc5ae53dc9201c67d1d7bdf12dd10e1ea422e24,
  0xa2df8e2292edc4360440786d656c99d15c3f1807,
  0xbb83c814579a82a985a32707019f8e65e004a8ce,
  0xca30e7716a5eca7572e64ba6aece61a6d0aaf073,
  0xf21ebb2bdd0fc5b57d48fcf194ad4f940d150555;
