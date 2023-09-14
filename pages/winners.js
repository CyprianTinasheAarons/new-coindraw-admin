import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import WinnerService from "../api/winner.service";
import UserService from "../api/user.service";
import { toast } from "react-toastify";
import drawService from "../api/draw.service";
import WinnersTable from "../components/tables/winners";
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
        toast(`${err.response.data.message}`, {
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
      const user = users.find((user) => user.username === selectedUser);
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
                <div className="flex flex-col form-group">
                  <label htmlFor="search">Search User</label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Enter username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                  />
                  <label className="py-1" htmlFor="search">
                    Select User
                  </label>
                  <select
                    id="user"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="block w-full p-2 mb-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                  >
                    {filteredUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
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
                    id="prize"
                    name="prize"
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
                    id="draw"
                    value={draw}
                    onChange={(e) => setDraw(e)}
                    className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                  >
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
