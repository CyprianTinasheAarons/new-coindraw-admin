import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import WinnerService from "../api/winner.service";
import UserService from "../api/user.service";
import { toast } from "react-toastify";
import drawService from "../api/draw.service";
import WinnersTable from "../components/tables/winners";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Winners() {
  const [winners, setWinners] = useState([]);
  const [draw, setDraw] = useState("");
  const [draws, setDraws] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [winner, setWinner] = useState({
    name: "",
    email: "",
    price: "",
    date: "",
    address: "",
    draw: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchWinners = async () => {
    WinnerService.getAll().then((res) => {
      setWinners(res.data);
    });
  };

  const createWinner = async () => {
    winner.draw = draw;
    console.log(draw);
    console.log(winner);
    WinnerService.create(winner)
      .then((res) => {
        //  make a toast
        toast("Winner added successfully", {
          type: "success",
        });
        setWinners([...winners, res.data]);
        location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast(`${err}`, {
          type: "error",
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWinner({ ...winner, [name]: value });
  };

  useEffect(() => {
    drawService.getAll().then((res) => {
      setDraws(res.data);
    });
    WinnerService.getAll().then((res) => {
      setWinners(res.data);
    });
    UserService.getAll().then((res) => {
      setUsers(res.data);
    });
  }, []);
  useEffect(() => {
    const filteredUsers = users.filter(
      (user) =>
        user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        user?.walletAddress?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  }, [search, users]);

  useEffect(() => {
    if (selectedUser) {
      console.log(selectedUser);
      const user = users.find(
        (user) => user.username === selectedUser?.username
      );
      setWinner({
        ...winner,
        name: user.username,
        email: user.email,
        address: user.walletAddress,
      });
    }
  }, [selectedUser]);

  return (
    <div>
      <Head>
        <title>Coindraw Admin | Winners</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="Winners">
        <div>
          <button
            onClick={onOpen}
            className="px-4 py-2 font-semibold border rounded-md "
          >
            Add Winner
          </button>
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Winner</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <Combobox
                  as="div"
                  value={selectedUser}
                  onChange={setSelectedUser}
                >
                  <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    Select a user
                  </Combobox.Label>
                  <div className="relative mt-2">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setSearch(event.target.value)}
                      displayValue={(user) => user?.name}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                      <ChevronUpDownIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    {filteredUsers.length > 0 && (
                      <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredUsers.map((user) => (
                          <Combobox.Option
                            key={user._id}
                            value={user}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-indigo-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      "inline-block h-2 w-2 flex-shrink-0 rounded-full",
                                      user.online
                                        ? "bg-green-400"
                                        : "bg-gray-200"
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span
                                    className={classNames(
                                      "ml-3 truncate",
                                      selected && "font-semibold"
                                    )}
                                  >
                                    {user.username}
                                  </span>
                                </div>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-indigo-600"
                                    )}
                                  >
                                    <CheckIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
                <div className="form-group">
                  <label className="py-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                    id="name"
                    name="name"
                    placeholder="Enter name"
                    value={winner.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="py-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    value={winner.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="py-1" htmlFor="prize">
                    Prize
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                    id="price"
                    name="price"
                    placeholder="Enter prize"
                    value={winner.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="py-1" htmlFor="date">
                    Date
                  </label>
                  <input
                    type="date"
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                    id="date"
                    name="date"
                    placeholder="Enter date"
                    value={winner.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="py-1" htmlFor="address">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                    id="address"
                    name="address"
                    placeholder="Enter address"
                    value={winner.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="py-1" htmlFor="draw">
                    Draw
                  </label>
                  {/* select with opitons from draws */}
                  <select
                    onChange={(e) => {
                      setDraw(e.target.value);
                    }}
                    defaultValue="Select a draw"
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                  >
                    <option value="">Select a draw</option>
                    {draws.map((draw) => (
                      <option key={draw._id} value={draw.title}>
                        {draw.title}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <div>
                <button
                  onClick={createWinner}
                  className="px-4 py-2 font-semibold border rounded-md "
                >
                  Save
                </button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <WinnersTable data={winners} fetchWinners={fetchWinners} />
      </Layout>
    </div>
  );
}

export default Winners;
