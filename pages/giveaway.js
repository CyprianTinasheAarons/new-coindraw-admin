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
import { useState } from "react";
import contractAbi from "../abi/giveaway.json";
import classicAbi from "../abi/classic.json";
import { airdropAddress } from "../common/addresses";
import { useDispatch } from "react-redux";
import { createGiveaway, getGiveawayHistory } from "../slices/giveaway";
import Nfts from "../components/nfts";

const Giveaway = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const contractAddress = airdropAddress;
  const [approvalAddress, setApprovalAddress] = useState("");

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

  const onSubmitAirdrop = () =>
    toast({
      title: "Airdrop submitted.",
      description: "We've submitted your airdrop request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessAirDrop = () => {
    toast({
      title: "Airdrop successful.",
      description: "We've successfully airdropped the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onAirdropClose();
    dispatch(getGiveawayHistory());
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

  const onSuccessAirDropMultiple = () => {
    toast({
      title: "Airdrop multiple successful.",
      description: "We've successfully airdropped the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    onAirdropMultipleClose();
    dispatch(getGiveawayHistory());
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
    location.reload();
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
            onClick={() => onAirdropOpen()}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Airdrop
          </button>
          <button
            type="button"
            onClick={() => onAirdropMultipleOpen()}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
      <GiveawayTable />
      <Modal isOpen={isAirdropOpen} onClose={onAirdropClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Airdrop</ModalHeader>
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
                  setAirdrop({ ...airdrop, winners: e.target.value.split(",") })
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
                Giveaway Contract Address
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
          <ModalHeader>Airdrop (Multiple)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Winner Address (Single)
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
                Giveaway Contract Address
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
              Airdrop (Multiple)
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
