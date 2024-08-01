import { useEffect, useState } from "react";
import contractAbi from "../../abi/distribution.json";
import { distributeAddress } from "../../common/addresses";
import DeleteUser from "../modal/deleteUser";
import userService from "../../api/user.service";
import drawService from "../../api/draw.service";
import winnerService from "../../api/winner.service";
import CsvDownloader from "react-csv-downloader";
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
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const drawTypes = [
  { name: "Classic", value: "Classic" },
  { name: "Monthly", value: "Monthly" },
  { name: "Elite", value: "Elite" },
  { name: "Quarterly", value: "Quarterly" },
  { name: "Yearly", value: "Yearly" },
  { name: "Custom", value: "Custom" },
];

export default function UsersTable(data) {
  const [users, setUsers] = useState([]);
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [draw, setDraw] = useState(drawTypes[0].value); // [1]
  const [draws, setDraws] = useState([]);
  const [price, setPrice] = useState("");
  const [winners, setWinners] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // [1]
  const contractAddress = distributeAddress;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drawType, setDrawType] = useState(drawTypes[0].value);
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();
  const address = useAddress();
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const fetchUsers = () => {
    userService.getAll().then((res) => {
      setUsers(res?.data);
    });
  };
  useEffect(() => {
    fetchUsers();
    drawService.getAll().then((res) => {
      setDraws(res.data);
    });
  }, []);

  useEffect(() => {
    setFilteredData(
      users.filter(
        (u) =>
          u?.username?.toLowerCase().includes(search.toLowerCase()) ||
          u?.address?.toLowerCase().includes(search.toLowerCase()) ||
          u?.email?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const sendMail = () => {
    winnerService
      .sendEmail({
        drawType: draw,
        prizeWon: price,
        winnerName: selectedUser?.username,
        winnerEmail: selectedUser?.email,
        addToWinners: winners,
        winnerAddress: selectedUser?.walletAddress,
      })
      .then(() => {
        toast({
          title: "Email sent.",
          description: "We've sent an email to the winner.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        setDraw(drawTypes[0].value);
        setPrice("");
        setWinners(false);
        setSelectedUser(null);

        onClose();
      })
      .catch(() => {
        toast({
          title: "Email not sent.",
          description: "We've sent an email to the winner.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

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
  };

  const onErrorDistribute = () =>
    toast({
      title: "Distribute failed.",
      description: "We've failed to distribute the tokens.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const sendPayment = async () => {
    if (!window.ethereum) {
      toast({
        title: "No wallet found.",
        description: "Please connect a wallet to send payment.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    setIsLoading(true);
    onSubmitDistribute();
    try {
      const tx = await signer.sendTransaction({
        to: selectedUser?.walletAddress,
        value: ethers.utils.parseUnits(amount, "ether"),
      });
      await tx.wait();

      winnerService.sendEmailMatic({
        amount,
        winnerName: selectedUser?.username,
        winnerEmail: selectedUser?.email,
        winnerAddress: selectedUser?.walletAddress,
        txHash: tx.hash,
        drawType: drawType,
      });

      onPaymentClose();
      onSuccessDistribute();
    } catch (error) {
      console.log(error);
      if (error.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT) {
        toast({
          title: "Transaction Error",
          description:
            "Cannot estimate gas; transaction may fail or may require manual gas limit.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        onErrorDistribute();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="my-2 ">
        <CsvDownloader
          datas={users}
          filename="users"
          extension=".csv"
          separator=";"
          wrapColumnChar="'"
        >
          <button className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Download Report{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 px-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
        </CsvDownloader>
      </div>

      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Quick search
        </label>
        <div className="relative flex items-center mt-1">
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search"
            className="block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center px-2 font-sans text-sm font-medium text-gray-400 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <div className="my-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            This is a comprehensive list of all registered users in the system.
          </p>
        </div>
      </div>
      <div className="px-6 lg:px-8">
        <div className="sm:flex sm:items-center"></div>
        <div className="flow-root mt-8">
          <div className="-mx-6 -my-2 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle ">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Address
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Referred
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Promos
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Created On
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {person?.username}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.walletAddress && (
                          <span className="flex items-center ">
                            {person?.walletAddress?.slice(0, 8)}...
                            {person?.walletAddress?.slice(-3)}
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  person.walletAddress
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                />
                              </svg>
                            </button>
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.referred ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.promotionalEmails ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(person.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="flex py-4 text-sm font-medium text-right align-middle ">
                        <button
                          className="flex items-center px-2 mr-1 text-white bg-blue-500 rounded"
                          onClick={() => {
                            setSelectedUser(person);
                            onOpen();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                            />
                          </svg>
                        </button>
                        <button
                          className="flex items-center px-2 mr-1 text-white rounded bg-green"
                          onClick={() => {
                            setSelectedUser(person);
                            onPaymentOpen();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.121 7.629A3 3 0 0 0 9.017 9.43c-.023.212-.002.425.028.636l.506 3.541a4.5 4.5 0 0 1-.43 2.65L9 16.5l1.539-.513a2.25 2.25 0 0 1 1.422 0l.655.218a2.25 2.25 0 0 0 1.718-.122L15 15.75M8.25 12H12m9 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                        <DeleteUser user={person.id} fetchUsers={fetchUsers} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Email Winner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col">
              <label>Winner Name</label>
              <input
                placeholder="Enter winner name"
                className="px-1 py-2 border rounded-md"
                value={selectedUser?.username}
              />
            </div>
            <div className="flex flex-col">
              <label>Winner Email</label>
              <input
                placeholder="Enter winner name"
                className="px-1 py-2 border rounded-md"
                value={selectedUser?.email}
              />
            </div>
            <div>
              <label>Select Draw</label>
              <select
                onChange={(e) => {
                  setDraw(e.target.value);
                }}
                defaultValue="Select a draw"
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
              >
                {draws.map((draw) => (
                  <option key={draw._id} value={draw.title}>
                    {draw.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label>Prize Won</label>
              <input
                placeholder="Enter prize won"
                className="px-1 py-2 border rounded-md"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mt-2">
              Add to Winners{" "}
              <input
                type="checkbox"
                className="mx-1 rounded-md"
                value={winners}
                onChange={(e) => setWinners(e.target.checked)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose} py={4}>
              Close
            </Button>
            <Button colorScheme="green" onClick={() => sendMail()}>
              Send Email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pay Winner</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Winner Name
                </label>
                <input
                  type="text"
                  value={selectedUser?.username || ""}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Winner Email
                </label>
                <input
                  type="text"
                  value={selectedUser?.email || ""}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Winner Wallet
                </label>
                <input
                  type="text"
                  value={selectedUser?.walletAddress || ""}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Winning Amount (MATIC)
                </label>
                <input
                  type="text"
                  placeholder="Enter amount"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Draw Type
                </label>
                <select
                  onChange={(e) => {
                    setDrawType(e.target.value);
                  }}
                  defaultValue="Select a draw"
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                >
                  {drawTypes.map((draw) => (
                    <option key={draw.value} value={draw.value}>
                      {draw.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onPaymentClose}>
              Close
            </Button>
            {address ? (
              <Button
                colorScheme="green"
                onClick={sendPayment}
                isLoading={isLoading}
              >
                {isLoading ? <Spinner size="sm" /> : "Send Payment"}
              </Button>
            ) : (
              <ConnectWallet />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
