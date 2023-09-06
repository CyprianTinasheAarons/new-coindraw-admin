import ViewWinner from "../modal/viewWinners";
import { useState, useEffect } from "react";
import CsvDownloader from "react-csv-downloader";
import { useToast } from "@chakra-ui/react";
import WinnerService from "../../api/winner.service";
import drawService from "../../api/draw.service";
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

export default function WinnersTable({ data }) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [draws, setDraws] = useState([]);
  const [winner, setWinner] = useState({
    id: "",
    name: "",
    email: "",
    address: "",
    price: "",
    date: "",
    draw: "",
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteWinner = async (id) => {
    try {
      await WinnerService.delete(id)
        .then(() => {
          toast({
            title: "Winner deleted successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          location.reload();
        })
        .catch((err) => {
          toast({
            title: "Error deleting winner",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateWinner = async (id) => {
    try {
      await WinnerService.update(id, winner)
        .then(() => {
          toast({
            title: "Winner updated successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          location.reload();
        })
        .catch((err) => {
          toast({
            title: "Error updating winner",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFilteredData(
      data.filter((w) => {
        return (
          w?.name?.toLowerCase().includes(search.toLowerCase()) ||
          w?.address?.toLowerCase().includes(search.toLowerCase()) ||
          w?.email?.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }, [search, data]);

  useEffect(() => {
    drawService.getAll().then((res) => {
      setDraws(res.data);
    });
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Winner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={winner.name}
                  onChange={(e) =>
                    setWinner({ ...winner, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  value={winner.email}
                  onChange={(e) =>
                    setWinner({ ...winner, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={winner.address}
                  onChange={(e) =>
                    setWinner({ ...winner, address: e.target.value })
                  }
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Draw
                </label>

                {/* select with opitons from draws */}
                <select
                  value={winner.draw}
                  onChange={(e) => {
                    setWinner({ ...winner, draw: e.target.value });
                  }}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                >
                  {draws.map((draw) => (
                    <option key={draw._id} value={draw.title}>
                      {draw.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose} className="mr-3 text-indigo-500">
              Cancel
            </button>
            <button
              onClick={() => updateWinner(winner.id)}
              className="px-5 py-2 text-white bg-indigo-500 rounded"
            >
              Update
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="my-2 ">
        <CsvDownloader
          datas={filteredData}
          filename="history"
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
      <div>
        <div className="flow-root mt-8">
          <div className="-mx-6 -my-2 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                      Wallet Address
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
                      Draw
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-6 sm:pr-0"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((winner) => (
                    <tr key={winner.email}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {winner.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {winner.address}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {winner.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {winner.draw}
                      </td>

                      <td className="relative flex items-center py-4 pl-3 pr-6 text-sm font-medium text-right align-middle whitespace-nowrap sm:pr-0">
                        <ViewWinner id={winner.id} />
                        <button
                          className="p-2 px-4 mx-2 mr-2 text-white rounded-md bg-green"
                          onClick={() => {
                            setWinner({
                              id: winner.id,
                              name: winner.name,
                              email: winner.email,
                              address: winner.address,
                              price: winner.price,
                              date: winner.date,
                              draw: winner.draw,
                            });
                            onOpen();
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="p-2 px-4 mx-2 mr-2 text-white bg-red-500 rounded-md"
                          onClick={() => deleteWinner(winner.id)}
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
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
    </>
  );
}
