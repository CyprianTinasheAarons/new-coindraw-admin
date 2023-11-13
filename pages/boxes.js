import Head from "next/head";
import Layout from "../components/Layout";
import BoxesTable from "../components/tables/boxes";
import { useEffect, useState } from "react";
import abiMatic from "../abi/abiMatic.json";
import abiNFT from "../abi/abiNFT.json";
import { Web3Button  ,useAddress} from "@thirdweb-dev/react";
import { ethers } from "ethers";
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
  Spinner
} from "@chakra-ui/react";

function Draws() {
  const toast = useToast();
  const contractMaticAddress = "0xaf2df1bA6Fb1FC3Eda12b01e9d70F33332bAe672";
  const contractNFTAddress = "0x9809f89Fa4740602F23e99D653554Ce3583FfD83";
  const [ loading, setLoading ] = useState(false);

  const [amount, setAmount] = useState(0);
  const [contract, setContract] = useState("");


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

  const onSubmitMatic = () =>
    toast({
      title: "Matic submission.",
      description: "We've submitted your Matic request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessMatic = () => {
    toast({
      title: "Matic successful.",
      description: "We've successfully processed the Matic.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onCloseMatic();
  };

  const onErrorMatic = () =>
    toast({
      title: "Matic failed.",
      description: "We've failed to process the Matic.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmitNFT = () =>
    toast({
      title: "NFT submission.",
      description: "We've submitted your NFT request.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

  const onSuccessNFT = () => {
    toast({
      title: "NFT successful.",
      description: "We've successfully processed the NFT.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onCloseNFT();
  };

  const onErrorNFT = () =>
    toast({
      title: "NFT failed.",
      description: "We've failed to process the NFT.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

    const sendFundsToContract = async () => {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractMaticAddress, abiMatic, signer);
      try {
        const transaction = await contract.deposit({value: ethers.utils.parseEther(amount)});
        
        await transaction.wait();
        onSuccessMatic();
        setLoading(false);
      } catch (error) {
        console.error("An error occurred", error);
        onErrorMatic();
        setLoading(false);
      }
    };

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
                <button
                  onClick={() => sendFundsToContract()}
                  className="px-3 py-3 mx-1 text-black bg-gray-100 rounded-md"
                >
                  {loading ? (
                    <div>
                      <Spinner />
                    </div>
                  ) : (
                    "Fund Contract"
                  )}
                </button>

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
                  value={contract}
                  onChange={(e) => setContract(e.target.value)}
                  name="address"
                />
              </ModalBody>
              <ModalFooter>
                <Web3Button
                  contractAddress={contract} // Your smart contract address
                  contractAbi={abiNFT}
                  action={async (contract) => {
                    await contract.call("setApprovalForAll", [
                      contractNFTAddress,
                      true,
                    ]);
                  }}
                  onSuccess={onSuccessNFT}
                  onError={onErrorNFT}
                  onSubmit={onSubmitNFT}
                >
                  Set Approval
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
