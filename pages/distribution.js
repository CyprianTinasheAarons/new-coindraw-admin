import Layout from "../components/Layout";
import DistributionTable from "../components/tables/distributionTable";
import Elites from "../components/elites";
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
import contractAbi from "../abi/distribution.json";
import { distributeAddress } from "../common/addresses";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import {
  createDistribution,
  getDistributionHistory,
} from "../slices/distribution";

const Distribution = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const contractAddress = distributeAddress;
  const [recipients, setRecipients] = useState([]);
  const [note, setNote] = useState("");
  const [elite, setElite] = useState("");
  const [total, setTotal] = useState("");
  const [percentage, setPercentage] = useState("");
  const [address, setAddress] = useState("");

  const {
    isOpen: isDistributeOpen,
    onOpen: onDistributeOpen,
    onClose: onDistributeClose,
  } = useDisclosure();

  const {
    isOpen: isEliteOpen,
    onOpen: onEliteOpen,
    onClose: onEliteClose,
  } = useDisclosure();

  const {
    isOpen: isSetTotalOpen,
    onOpen: onSetTotalOpen,
    onClose: onSetTotalClose,
  } = useDisclosure();

  const {
    isOpen: isSetPercentageOpen,
    onOpen: onSetPercentageOpen,
    onClose: onSetPercentageClose,
  } = useDisclosure();

  const {
    isOpen: isChangeOwnerOpen,
    onOpen: onChangeOwnerOpen,
    onClose: onChangeOwnerClose,
  } = useDisclosure();

  const onSubmitDistribute = () =>
    toast({
      title: "Distribute submitted.",
      description: "We've submitted your distribute request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessDistribute = () => {
    toast({
      title: "Distribute successful.",
      description: "We've successfully distributed the tokens.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onDistributeClose();
    dispatch(getDistributionHistory());
  };

  const onErrorDistribute = () =>
    toast({
      title: "Distribute failed.",
      description: "We've failed to distribute the tokens.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmitSetTotal = () =>
    toast({
      title: "Set total submitted.",
      description: "We've submitted your set total request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessSetTotal = () => {
    toast({
      title: "Set total successful.",
      description: "We've successfully set the total.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onSetTotalClose();
    dispatch(getDistributionHistory());
  };

  const onErrorSetTotal = () =>
    toast({
      title: "Set total failed.",
      description: "We've failed to set the total.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmitSetPercentage = () =>
    toast({
      title: "Set percentage submitted.",
      description: "We've submitted your set percentage request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessSetPercentage = () => {
    toast({
      title: "Set percentage successful.",
      description: "We've successfully set the percentage.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onSetPercentageClose();
  };

  const onErrorSetPercentage = () =>
    toast({
      title: "Set percentage failed.",
      description: "We've failed to set the percentage.",
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
    <Layout title="Distribution">
      <div className="py-8 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Distribution Address:{" "}
          <a href="#" className="font-semibold underline text-green">
            {contractAddress}
          </a>
        </h3>
        <div className="flex mt-3 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => onDistributeOpen()}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Distribute
          </button>
          <button
            type="button"
            onClick={() => onEliteOpen()}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Get Elite
          </button>

          <button
            type="button"
            onClick={() => onSetTotalOpen()}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Set Total
          </button>
          <button
            type="button"
            onClick={() => onSetPercentageOpen()}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Set Percentage
          </button>
          <button
            type="button"
            onClick={() => onChangeOwnerOpen()}
            className="inline-flex items-center px-3 py-2 ml-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Change Owner
          </button>
        </div>
      </div>
      <DistributionTable />
      <Modal isOpen={isDistributeOpen} onClose={onDistributeClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Distribute</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Recipients
                <span className="text-xs italic text-red-500">
                  {" "}
                  (comma separated addresses)
                </span>
              </label>
              <textarea
                cols={100}
                type="text"
                name="recipients"
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value.split(","))}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Note
              </label>
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
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                await contract
                  .call("distributeRewards", [recipients])
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
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEliteOpen} onClose={onEliteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Get Elite Addresses</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Elite Address
              </label>
              <input
                type="text"
                name="elite"
                id="elite"
                value={elite}
                onChange={(e) => setElite(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
              />
              <Elites eliteAddress={elite} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSetTotalOpen} onClose={onSetTotalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set Total</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Total{" "}
                <span className="text-xs italic text-red-500"> (uint256)</span>
              </label>
              <input
                type="text"
                name="total"
                id="total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                await contract
                  .call("setTotalAmountToDistribute", [
                    ethers.utils.parseEther(total),
                  ])
                  .then((result) => {
                    console.log(result);
                  });
              }}
              onSuccess={onSuccessSetTotal}
              onError={onErrorSetTotal}
              onSubmit={onSubmitSetTotal}
            >
              Set Total
            </Web3Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSetPercentageOpen} onClose={onSetPercentageClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set Percentage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">
                Percentage{" "}
                <span className="text-xs italic text-red-500"> (uint256)</span>
              </label>
              <input
                type="text"
                name="percentage"
                id="percentage"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                await contract.call("setDistributionPercentage", [percentage]);
              }}
              onSuccess={onSuccessSetPercentage}
              onError={onErrorSetPercentage}
              onSubmit={onSubmitSetPercentage}
            >
              Set Percentage
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
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Web3Button
              contractAddress={contractAddress}
              contractAbi={contractAbi}
              action={async (contract) => {
                await contract.call("changeOwner", [address]);
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

export default Distribution;
