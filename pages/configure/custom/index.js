import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import boxService from "../../../api/box.service";
import Head from "next/head";

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
  Button,
} from "@chakra-ui/react";

export default function BoxViewer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [boxType, setBoxType] = useState("Custom");
  const [name, setName] = useState("");
  const [image, setImage] = useState("Custom");
  const [paused, setPaused] = useState(false);

  const createBox = async () => {
    try {
      await boxService.createCoinbox({
        boxType,
        name,
        image,
        paused,
      });
      toast({
        title: "Box created.",
        description: "We've created your box.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose(); // Close the modal after box creation
      setName("");
      setImage("");
      location.reload(); // Refresh the page to show the new box
    } catch (error) {
      toast({
        title: "Error creating box.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Coindraw Admin</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mb-2">
          <div className="mx-auto max-w-7xl ">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Custom CoinBoxes
            </h1>
          </div>
        </div>
        <div className="flex mb-8">
          <div className="pr-2">
            <div className="flex justify-end">
              <button
                onClick={onOpen}
                className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Box
              </button>
            </div>
          </div>
        </div>
        <BoxesTable />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Box</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Box Design
                  </label>
                  <select
                    id="type"
                    name="image"
                    defaultValue="Custom"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onChange={(e) => setImage(e.target.value)}
                    value={image}
                  >
                    {" "}
                    <option value="Custom">Custom</option>
                    <option value="Classic">Classic</option>
                    <option value="Exclusive">Exclusive</option>
                  </select>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" onClick={createBox}>
                Create Box
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

const BoxesTable = () => {
  const toast = useToast();
  const [coinBoxes, setCoinBoxes] = useState([]);

  useEffect(() => {
    const fetchCoinBoxes = async () => {
      const response = await boxService.getAllCoinboxes(); // Assuming getAllCoinboxes() is an async function that fetches all coin boxes
      const allCoinBoxes = response.data;
      const customBoxType = allCoinBoxes.filter(
        (box) => box.boxType === "Custom"
      );
      setCoinBoxes(customBoxType);
    };

    fetchCoinBoxes();
  }, []);

  //pause box
  const pauseBox = async (id, paused) => {
    try {
      await boxService.updateCoinbox(id, { paused });
      setCoinBoxes((prev) =>
        prev.map((box) => (box.id === id ? { ...box, paused } : box))
      );
      toast({
        title: paused ? "Box paused" : "Box resumed",
        description: `The box has been ${paused ? "paused" : "resumed"}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error updating the box.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  //delete box
  const deleteBox = async () => {
    const id = selectedBox;
    try {
      await boxService.deleteCoinbox(id);
      setCoinBoxes((prev) => prev.filter((box) => box.id !== id));
      toast({
        title: "Box deleted",
        description: "The box has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error deleting the box.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const { onClose, onOpen, isOpen } = useDisclosure();
  const [selectedBox, setSelectedBox] = useState("");

  const deleteBoxModal = (id) => {
    onOpen();
    setSelectedBox(id);
  };

  return (
    <div>
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      BOX ID
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Box Design
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coinBoxes.map((box, index) => (
                    <tr key={index}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {box.id}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(box.id);
                            toast({
                              title: "Copied",
                              description:
                                "Box ID has been copied to clipboard.",
                              status: "info",
                              duration: 3000,
                              isClosable: true,
                            });
                          }}
                          className="p-1 ml-2 text-gray-500 border rounded-md hover:text-gray-700"
                        >
                          Copy
                        </button>
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {box.name}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {box.image}
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <button
                          className="p-2 border rounded-md text-green hover:text-green"
                          onClick={() => pauseBox(box.id, !box.paused)}
                        >
                          {box.paused ? "Resume" : "Pause"}
                        </button>

                        <button
                          className="p-2 ml-2 text-green-600 border rounded-md hover:text-green-900"
                          onClick={() => {
                            window.location.href = `/configure/custom/${box.id}`;
                          }}
                        >
                          View Prizes (
                          {
                            box.prizes.filter((prize) => prize.type !== "NoWin")
                              .length
                          }
                          )
                        </button>
                        <button
                          className="p-2 ml-2 text-white bg-red-600 border rounded-md hover:bg-red-900 bold"
                          onClick={() => deleteBoxModal(box.id)}
                        >
                          Delete
                        </button>
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
          <ModalHeader>Delete Prize</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this prize?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="red" onClick={deleteBox}>
              Delete Prize
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const EachBox = () => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Box Name
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          Prizes in the box
        </p>
      </div>
    </div>
  );
};

const PrizeTable = ({ prizes, handleDelete, handleEdit }) => {
  return (
    <div>
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Probability
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Discord
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Contract
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Matic Amount
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prizes
                    .sort(
                      (a, b) => new Date(a.created_At) - new Date(b.created_At)
                    )
                    .map((prize, index) => (
                      <tr key={prize.name}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {prize?.order}
                        </td>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {prize.name}
                        </td>
                        <td
                          className={`px-3 py-4 text-sm whitespace-nowrap text-white font-semibold ${
                            prize.type === "Digital"
                              ? "bg-green"
                              : prize.type === "Physical"
                              ? "bg-purple-500"
                              : prize.type === "NoWin"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {prize.type}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.unlimitedQuantity
                            ? "Unlimited"
                            : prize.quantity}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.probability
                            .toFixed(0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          / 100,000
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.discordNotificationType}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.nftContractAddress}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.maticPrice}
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <button
                            onClick={() => handleEdit(prize)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit<span className="sr-only">, {prize.name}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(prize)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            Delete
                            <span className="sr-only">, {prize.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td
                      className={`px-3 py-4 text-sm whitespace-nowrap ${
                        prizes.reduce(
                          (total, prize) => total + prize.probability,
                          0
                        ) > 100000
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    >
                      Total Probability:{" "}
                      {prizes
                        .reduce((total, prize) => total + prize.probability, 0)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      / 100,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
