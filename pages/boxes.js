import Head from "next/head";
import Layout from "../components/Layout";
import BoxesTable from "../components/tables/boxes";
import { useEffect, useState } from "react";
import abiMatic from "../abi/abiMatic.json";
import abiNFT from "../abi/abiNFT.json";
import { useContract, useContractRead, Web3Button } from "@thirdweb-dev/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

function Draws() {
  const contractMaticAddress = "0xB35ac3B0470f967853a7E74F7F16199DAFbb95eC";
  const contractNFTAddress = "0x3a8c339ee490fdCDD41F26aD5716424722d5979E";
  const {
    contract: contractMatic,
    isLoading: isLoadingMatic,
    error: errorMatic,
  } = useContract(contractMaticAddress, abiMatic.abi);
  const {
    contract: contractNFT,
    isLoading: isLoadingNFT,
    error: errorNFT,
  } = useContract(contractNFTAddress, abiNFT.abi);
  const { data, isLoading, error } = useContractRead(contractMatic, "getName");

  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const {
    isOpen: isOpenMatic,
    onOpen: onOpenMatic,
    onClose: onCloseMatic,
  } = useDisclosure();
  const {
    isOpen: isOpenNFT,
    onOpen: onOpenNFT,
    onClose: onCloseNFT,
  } = useDisclosure();

  return (
    <div>
      <Head>
        <title>Coindraw Admin | Draws </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full bg-white">
        <Layout title="Coinbox">
          <div className="flex justify-between mt-4">
            <div>
              <a
                href="/configure/classic"
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Configure Classic Box
              </a>
              <a
                href="/configure/exclusive"
                className="inline-flex items-center px-3 py-2 ml-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Configure Exclusive Box
              </a>
            </div>
            <div>
              {" "}
              <button
                onClick={onOpenMatic}
                className="inline-flex items-center px-3 py-2 ml-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Fund Coinbox Matic Price
              </button>
              <button
                onClick={onOpenNFT}
                className="inline-flex items-center px-3 py-2 ml-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Approve Contract to Distribute NFTs
              </button>
            </div>
          </div>
          <BoxesTable />
          <Modal isOpen={isOpenMatic} onClose={onCloseMatic}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Fund Coinbox Matic Price</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Matic amount"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                />
              </ModalBody>
              <ModalFooter>
                <Web3Button
                  contractAddress={contractMaticAddress} // Your smart contract address
                  contractAbi={abiMatic.abi}
                  action={async (contract) => {
                    contract.methods.receive().send({from: accounts[0], value: web3.utils.toWei(amount, 'ether')});
                  }}
                >
                  Send Funds
                </Web3Button>

                <button onClick={onCloseMatic} className="mx-1">
                  Close
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={isOpenNFT} onClose={onCloseNFT}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Approve Contract to Distribute NFTs</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <input
                  type="text"
                  placeholder="Enter contract address"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  name="address"
                />
              </ModalBody>
              <ModalFooter>
                <Web3Button
                  contractAddress={contractNFTAddress} // Your smart contract address
                  contractAbi={abiNFT.abi}
                  action={async (contract) => {
                    await someAction(contract);
                  }}
                >
                  Execute Action
                </Web3Button>
                <button onClick={onCloseNFT} className="mx-1">
                  Close
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Layout>
      </main>
    </div>
  );
}

export default Draws;
