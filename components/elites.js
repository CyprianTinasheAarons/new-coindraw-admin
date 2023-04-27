import { Network, Alchemy } from "alchemy-sdk";
import { useState, useEffect } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useContract } from "@thirdweb-dev/react";
import eliteAbi from "../abi/elite.json";

const Elites = ({ eliteAddress }) => {
  const [loading, isLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [balances, setBalances] = useState([]); // [address, balance]
  const [addresses, setAddresses] = useState([]);
  const [eliteData, setEliteData] = useState({});
  const toast = useToast();

  const settings = {
    apiKey: "n7m6r-iPJHAUCQUuKsV8zdr4jzW9ASnG", // Replace with your Alchemy API Key.
    network: Network.MATIC_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);
  const { contract } = useContract(eliteAddress, eliteAbi);

  const getElites = async () => {
    isLoading(true);

    await alchemy.nft.getOwnersForContract(eliteAddress).then((elites) => {
      setAddresses(elites?.owners.map((owner) => `${owner}`));

      let balancesArray = [];

      const getBalances = async () => {
        for (let i = 0; i < elites?.owners.length; i++) {
          await contract
            .call("balanceOf", [elites?.owners[i]])
            .then((balance) => {
              let balanceOf = parseInt(balance);
              balancesArray.push(balanceOf);
            });
        }

        setBalances(balancesArray);
        console.log("balancesArray", balancesArray);
        let totalData = 0;

        for (let i = 0; i < balancesArray.length; i++) {
          totalData += balancesArray[i];
        }

        setTotal(totalData);
      };

      getBalances();

      isLoading(false);
    });
  };

  useEffect(() => {
    if (eliteAddress) {
      getElites();
    }
  }, []);

  useEffect(() => {
    setEliteData({
      addresses: addresses,
      balances: balances,
      total: total,
    });
  }, [addresses, balances, total]);

  return (
    <div className="py-2">
      <div className="flex justify-center pb-4">
        <button
          onClick={() => getElites()}
          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {loading ? (
            <Spinner size={"sm"} />
          ) : (
            <p className="text-xs font-semibold ">Get Elite Addresses</p>
          )}
        </button>
        <button className="inline-flex items-center px-3 py-2 ml-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <CopyToClipboard
            text={JSON.stringify(eliteData, null, 2)}
            onCopy={() => {
              toast({
                title: "Copied!",
                description: "Elite addresses copied to clipboard.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            <p className="text-xs font-semibold ">Copy Elite Addresses</p>
          </CopyToClipboard>
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Spinner size={"sm"} />
        </div>
      ) : (
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Ownership % (Total: {total})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {addresses?.map((address, index) => (
                <tr key={address}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {((balances[index] / total) * 100).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Elites;
