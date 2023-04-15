import { Network, Alchemy } from "alchemy-sdk";
import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";

const Nfts = ({ contractAddress }) => {
  const address = useAddress();
  const [tokens, setTokens] = useState([]);
  const settings = {
    apiKey: "n7m6r-iPJHAUCQUuKsV8zdr4jzW9ASnG", // Replace with your Alchemy API Key.
    network: Network.MATIC_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);
  const getNfts = async () => {
    const nfts = await alchemy.nft.getNftsForOwner(address);

    let tokenIds = [];
    nfts?.ownedNfts?.forEach((nft) => {
      if (
        nft?.contract?.address.toLowerCase() === contractAddress.toLowerCase()
      ) {
        tokenIds.push(nft.tokenId);
      }
    });
    setTokens(tokenIds);
    console.log(tokenIds);
  };

  useEffect(() => {
    getNfts();
  }, []);

  return (
    <div className="p-1 my-1 border rounded-md bg-gray-50 border-green">
      <h1 className="text-xs text-green">Available NFTs</h1>

      <div className="flex">
        {tokens.map((token) => (
          <p key={token} className="text-xs font-semibold text-gray-500">
            {token}/
          </p>
        ))}
      </div>
    </div>
  );
};

export default Nfts;
