import Layout from "../components/Layout";
import GiveawayTable from "../components/tables/giveawayTable";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import contractAbi from "../abi/giveaway.json";
import classicAbi from "../abi/classic.json";
import { airdropAddress } from "../common/addresses";
import { useDispatch } from "react-redux";
import { createGiveaway, getGiveawayHistory } from "../slices/giveaway";
import Nfts from "../components/nfts";
import abiNFT from "../abi/abiNFT.json";

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useAddress } from "@thirdweb-dev/react";
import { create as ipfsHttpClient } from "ipfs-http-client";

// Get project credentials from environment variables
const projectId = "2Nuucuc5henX77NlnX9r3uQc9qG";
const projectSecret = "cd4ac696158aac5d6323a6559beb3ab8";

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  "base64"
)}`;

// Initialize the IPFS client
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.NEXT_PUBLIC_PRIVATE_KEY,
  "polygon"
);

const IPFS_SUBDOMAIN = "https://coindraw.infura-ipfs.io";

const Giveaway = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const address = useAddress();
  const contractAddress = airdropAddress;
  const [approvalAddress, setApprovalAddress] = useState(
    "0xa3c697137d1b56c8e39bd5d3fa6713121fbfcb8a"
  );
  const [giveawayHistory, setGiveawayHistory] = useState([]);
  const [amount, setAmount] = useState(0);
  const [giveawayAddress, setGiveawayAddress] = useState("");
  const [drawType, setDrawType] = useState("Classic");

  const drawTypes = [
    { value: "Classic", label: "Classic" },
    { value: "Exclusive", label: "Exclusive" },
  ];

  const getData = async () => {
    await dispatch(getGiveawayHistory())
      .unwrap()
      .then((res) => {
        setGiveawayHistory(res);
      });
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  const [airdrop, setAirdrop] = useState({
    winners: [],
    tokenIds: [],
    giveawayAddress: "",
    note: "",
  });

  const [airdropMultiple, setAirdropMultiple] = useState({
    winner: "",
    tokenIds: [],
    giveawayAddress: "",
    note: "",
  });

  const [changeOwner, setChangeOwner] = useState({
    newOwner: "",
  });

  const {
    isOpen: isGiveawayOpen,
    onOpen: onGiveawayOpen,
    onClose: onGiveawayClose,
  } = useDisclosure();

  const {
    isOpen: isAirdropOpen,
    onOpen: onAirdropOpen,
    onClose: onAirdropClose,
  } = useDisclosure();

  const {
    isOpen: isAirdropMultipleOpen,
    onOpen: onAirdropMultipleOpen,
    onClose: onAirdropMultipleClose,
  } = useDisclosure();

  const {
    isOpen: isApprovalOpen,
    onOpen: onApprovalOpen,
    onClose: onApprovalClose,
  } = useDisclosure();

  const {
    isOpen: isChangeOwnerOpen,
    onOpen: onChangeOwnerOpen,
    onClose: onChangeOwnerClose,
  } = useDisclosure();

  const [minting, setMinting] = useState(false);

  const mintGiveaway = async () => {
    setMinting(true);

    toast({
      title: "Minting",
      description: "Your NFTs are being minted.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

    const nftCollection = await sdk.getContract(giveawayAddress, abiNFT);
    const supply = await nftCollection.call("totalSupply");
    let URLs = [];

    let tokenId = parseInt(supply) + 1;

    const metadataPromises = Array.from({ length: amount }, async (_, i) => {
      let metadata;
      console.log(drawType);

      if (drawType === "Classic") {
        metadata = {
          description: "The Luck of the Draw",
          animation_url: `ipfs://QmPLjjB1dWmADzCYMDcbR4V56EzDWNEHehwyyaJsxF4ZRH/Classic_${
            tokenId + i
          }.png`,
          image: `ipfs://QmPLjjB1dWmADzCYMDcbR4V56EzDWNEHehwyyaJsxF4ZRH/Classic_${
            tokenId + i
          }.png`,
          name: "Will it be you?",
          attributes: [
            {
              trait_type: "Giveaway",
              value: "Classic Giveaway",
            },
          ],
          compiler: "Coindraw Draw Engine",
        };
      } else if (drawType === "Exclusive") {
        metadata = {
          description: "The Luck of the Draw",
          animation_url: `ipfs://QmP6rxHqyQR8yjUFEbHchkXQZH6nV6rGjwUHBt2invzudY/Exclusive_${
            tokenId + i
          }.png`,
          image: `ipfs://QmP6rxHqyQR8yjUFEbHchkXQZH6nV6rGjwUHBt2invzudY/Exclusive_${
            tokenId + i
          }.png`,
          name: "Will it be you?",
          attributes: [
            {
              trait_type: "Giveaway",
              value: "Exclusive Giveaway",
            },
          ],
          compiler: "Coindraw Draw Engine",
        };
      }

      const metadataString = JSON.stringify(metadata, null, 2);
      const metadataBuffer = new Buffer.from(metadataString);
      try {
        const added = await client.add({ content: metadataBuffer });
        return `${IPFS_SUBDOMAIN}/ipfs/${added.path}`;
      } catch (error) {
        console.error("Error uploading to IPFS:", error);
        return null;
      }
    });

    URLs = (await Promise.all(metadataPromises)).filter((url) => url !== null);

    const handleToast = (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 9000,
        isClosable: true,
      });
    };

    try {
      const response = await nftCollection.call(
        "mintForAddressDynamic",
        [amount, tokenId, address, URLs],
        { gasPrice: 500000000000 }
      );

      console.log(response);

      toast({
        title: "Minting successful",
        description: "Your NFTs have been minted",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      setMinting(false);
      onGiveawayClose();
    } catch (error) {
      console.error(error);
      setMinting(false);
      handleToast("Minting failed", "Your NFTs could not be minted", "error");
    }
  };

  const onSubmitAirdrop = () =>
    toast({
      title: "Airdrop submitted.",
      description: "We've submitted your airdrop request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessAirDrop = async () => {
    toast({
      title: "Airdrop successful.",
      description: "We've successfully airdropped the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    await getData();
    onAirdropClose();
  };

  const onErrorAirDrop = () =>
    toast({
      title: "Airdrop failed.",
      description: "We've failed to airdrop the tokens.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmitAirdropMultiple = () =>
    toast({
      title: "Airdrop multiple submitted.",
      description: "We've submitted your airdrop multiple request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessAirDropMultiple = async () => {
    toast({
      title: "Airdrop multiple successful.",
      description: "We've successfully airdropped the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    await getData();
    onAirdropMultipleClose();
  };

  const onErrorAirDropMultiple = () =>
    toast({
      title: "Airdrop multiple failed.",
      description: "We've failed to airdrop the tokens.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmitApproval = () =>
    toast({
      title: "Approval submitted.",
      description: "We've submitted your approval request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessApproval = () => {
    toast({
      title: "Approval successful.",
      description: "We've successfully approved the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onApprovalClose();
  };

  const onErrorApproval = () =>
    toast({
      title: "Approval failed.",
      description: "We've failed to approve the tokens.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmitChangeOwner = () =>
    toast({
      title: "Change owner submitted.",
      description: "We've submitted your change owner request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessChangeOwner = () => {
    toast({
      title: "Change owner successful.",
      description: "We've successfully changed the owner.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onChangeOwnerClose();
  };

  const onErrorChangeOwner = () =>
    toast({
      title: "Change owner failed.",
      description: "We've failed to change the owner.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  return (
    <Layout title="Giveaway">
      <div className="py-8 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Giveaway Address:{" "}
          <a href="#" className="font-semibold underline text-green">
            {contractAddress}
          </a>
        </h3>
        <div className="flex mt-3 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => onGiveawayOpen()}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Mint Giveaway
          </button>
          <button
            type="button"
            onClick={() => onAirdropMultipleOpen()}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Airdrop
          </button>
          <button
            type="button"
            onClick={() => onAirdropOpen()}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Airdrop (Multiple)
          </button>

          <button
            type="button"
            onClick={() => onApprovalOpen()}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Airdrop Approval
          </button>
          <button
            type="button"
            onClick={() => onChangeOwnerOpen()}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Change Owner
          </button>
        </div>
      </div>
      <GiveawayTable data={giveawayHistory} />
      <Modal isOpen={isGiveawayOpen} onClose={onGiveawayClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint Giveaway</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                id="amount"
                required={true}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Draw Type
              </label>
              <select
                name="drawType"
                id="drawType"
                value={drawType}
                onChange={(e) => setDrawType(e.target.value)}
                className="block w-full px-2 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {drawTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Classic/Exclusive Address
              </label>
              <input
                type="text"
                name="giveawayAddress"
                id="giveawayAddress"
                required={true}
                placeholder="0x123"
                value={giveawayAddress}
                onChange={(e) => setGiveawayAddress(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="flex justify-center w-full py-3 font-bold bg-gray-100 border rounded-md"
              onClick={mintGiveaway}
            >
              {minting ? "Minting..." : "Mint"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isAirdropOpen} onClose={onAirdropClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Airdrop (Multiple)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Winner Addresses
              </label>
              <textarea
                type="text"
                name="winners"
                id="winners"
                required={true}
                placeholder="0x123,0x456,0x789"
                value={airdrop.winners}
                onChange={(e) =>
                  setAirdrop({
                    ...airdrop,
                    winners: e.target.value
                      .split(",")
                      .map((address) => address.trim()),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col my-2">
              <label className="block text-sm font-medium text-gray-700">
                Respective Token IDs
              </label>
              <textarea
                type="text"
                name="tokenIds"
                id="tokenIds"
                required={true}
                placeholder="1,2,3"
                value={airdrop.tokenIds}
                onChange={(e) =>
                  setAirdrop({
                    ...airdrop,
                    tokenIds: e.target.value.split(","),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Competition Address
              </label>
              <input
                type="text"
                name="giveawayAddress"
                id="giveawayAddress"
                required={true}
                placeholder="0x123"
                value={airdrop.giveawayAddress}
                onChange={(e) =>
                  setAirdrop({ ...airdrop, giveawayAddress: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div>
                {airdrop.giveawayAddress && (
                  <Nfts contractAddress={airdrop.giveawayAddress} />
                )}
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="block text-sm font-medium text-gray-700">
                Note
              </label>
              <textarea
                type="text"
                name="note"
                id="note"
                required={true}
                placeholder="Note"
                value={airdrop.note}
                onChange={(e) =>
                  setAirdrop({ ...airdrop, note: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                console.log(airdrop);
                await contract
                  .call("airdrop", [
                    airdrop.winners,
                    airdrop.tokenIds,
                    airdrop.giveawayAddress,
                  ])
                  .then((result) => {
                    const data = {
                      txHash: result?.receipt.transactionHash,
                      to: result?.receipt.to,
                      from: result?.receipt.from,
                      amount: result?.receipt.value,
                      note: airdrop?.note,
                    };

                    dispatch(createGiveaway(data));
                  });
              }}
              onSuccess={onSuccessAirDrop}
              onError={onErrorAirDrop}
              onSubmit={onSubmitAirdrop}
            >
              Airdrop
            </Web3Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isAirdropMultipleOpen} onClose={onAirdropMultipleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Airdrop</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Winner Address
              </label>
              <input
                type="text"
                name="winner"
                id="winner"
                required={true}
                placeholder="0x123"
                value={airdropMultiple.winner}
                onChange={(e) =>
                  setAirdropMultiple({
                    ...airdropMultiple,
                    winner: e.target.value,
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col my-2">
              <label className="block text-sm font-medium text-gray-700">
                Respective Token IDs
              </label>
              <input
                type="text"
                name="tokenId"
                id="tokenId"
                required={true}
                placeholder="1,3,4"
                value={airdropMultiple.tokenIds}
                onChange={(e) =>
                  setAirdropMultiple({
                    ...airdropMultiple,
                    tokenIds: e.target.value.split(","),
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Competition Address
              </label>
              <input
                type="text"
                name="giveawayAddress"
                id="giveawayAddress"
                required={true}
                placeholder="0x123"
                value={airdropMultiple.giveawayAddress}
                onChange={(e) =>
                  setAirdropMultiple({
                    ...airdropMultiple,
                    giveawayAddress: e.target.value,
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              <div>
                {airdropMultiple.giveawayAddress && (
                  <Nfts contractAddress={airdropMultiple.giveawayAddress} />
                )}
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="block text-sm font-medium text-gray-700">
                Note
              </label>
              <textarea
                type="text"
                name="note"
                id="note"
                required={true}
                placeholder="Note"
                value={airdropMultiple.note}
                onChange={(e) =>
                  setAirdropMultiple({
                    ...airdropMultiple,
                    note: e.target.value,
                  })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                await contract
                  .call("airdropMultiple", [
                    airdropMultiple.winner,
                    airdropMultiple.tokenIds,
                    airdropMultiple.giveawayAddress,
                  ])
                  .then((result) => {
                    const data = {
                      txHash: result?.receipt.transactionHash,
                      to: result?.receipt.to,
                      from: result?.receipt.from,
                      amount: result?.receipt.value,
                      note: airdropMultiple?.note,
                    };

                    dispatch(createGiveaway(data));
                  });
              }}
              onSuccess={onSuccessAirDropMultiple}
              onError={onErrorAirDropMultiple}
              onSubmit={onSubmitAirdropMultiple}
            >
              Airdrop
            </Web3Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isApprovalOpen} onClose={onApprovalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Classic/Exclusive Address
              </label>
              <input
                type="text"
                name="giveawayAddress"
                id="giveawayAddress"
                required={true}
                placeholder="0x123"
                value={approvalAddress}
                onChange={(e) => setApprovalAddress(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={approvalAddress}
              contractAbi={classicAbi}
              action={async (contract) => {
                await contract.call("setApprovalForAll", [
                  contractAddress,
                  true,
                ]);
              }}
              onSuccess={onSuccessApproval}
              onError={onErrorApproval}
              onSubmit={onSubmitApproval}
            >
              Approve Contract
            </Web3Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isChangeOwnerOpen} onClose={onChangeOwnerClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Owner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                New Owner Address
              </label>
              <input
                type="text"
                name="changeOwner"
                id="changeOwner"
                placeholder="0x123"
                required={true}
                value={changeOwner.newOwner}
                onChange={(e) =>
                  setChangeOwner({ ...changeOwner, newOwner: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                await contract.call("transferOwnership", [
                  changeOwner.newOwner,
                ]);
              }}
              onSuccess={onSuccessChangeOwner}
              onError={onErrorChangeOwner}
              onSubmit={onSubmitChangeOwner}
            >
              Change Owner
            </Web3Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default Giveaway;
