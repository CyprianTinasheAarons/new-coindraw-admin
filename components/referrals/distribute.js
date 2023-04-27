import contractAbi from "../../abi/distribution.json";
import { distributeAddress } from "../../common/addresses";
import { useToast } from "@chakra-ui/react";
import { Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";
import { createDistribution } from "../../slices/distribution";
import { useDispatch } from "react-redux";

const Distribute = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const contractAddress = distributeAddress;
  const [recipients, setRecipients] = useState("");
  const [note, setNote] = useState("");

  const onSubmitDistribute = () =>
    toast({
      title: "Distribute submitted.",
      description: "We've submitted your distribute request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessDistribute = async () => {
    toast({
      title: "Distribute successful.",
      description: "We've successfully distributed the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    setRecipients("");
    setNote("");
    setTimeout(() => {
      location.reload();
    }, 1000);
  };

  const onErrorDistribute = () =>
    toast({
      title: "Distribute failed.",
      description: "We've failed to distribute the tokens.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  return (
    <>
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          Recipient
        </label>
        <textarea
          cols={100}
          type="text"
          name="recipients"
          id="recipients"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
        />
      </div>
      <div className="flex flex-col mt-4">
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          cols={100}
          type="text"
          name="note"
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
        />
      </div>

      <div className="flex flex-col my-4">
        <Web3Button
          contractAddress={contractAddress}
          contractAbi={contractAbi}
          action={async (contract) => {
            await contract
              .call("distributeSingle", [
                JSON.parse(recipients)?.address,
                JSON.parse(recipients)?.amount,
              ])
              .then((result) => {
                const data = {
                  txHash: result?.receipt.transactionHash,
                  to: result?.receipt.to,
                  from: result?.receipt.from,
                  amount: result?.receipt.value,
                  note: note,
                };
                dispatch(createDistribution(data));
              });
          }}
          onSuccess={onSuccessDistribute}
          onError={onErrorDistribute}
          onSubmit={onSubmitDistribute}
        >
          Distribute
        </Web3Button>
      </div>
    </>
  );
};

export default Distribute;
