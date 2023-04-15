import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import WinnerService from "../api/winner.service";
import ModalComponent from "../components/Modal";
import { toast } from "react-toastify";
import drawService from "../api/draw.service";
import WinnersTable from "../components/tables/winners";

function Winners() {
  const [winners, setWinners] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [draw, setDraw] = useState("");
  const [draws, setDraws] = useState([]);

  const fetchWinners = async () => {
    WinnerService.getAll().then((res) => {
      setWinners(res.data);
    });
  };

  useEffect(() => {
    drawService.getAll().then((res) => {
      setDraws(res.data);
    });
    WinnerService.getAll().then((res) => {
      setWinners(res.data);
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Coindraw Admin | Winners</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="Winners">
        <ModalComponent
          btnTitle="Add Winner"
          modalTitle="Add Winner"
          okText={"Submit"}
          handleOk={(e) => {
            e.preventDefault();

            const winner = {
              name: name,
              email: email,
              price: price,
              date: date,
              address: address,
              draw: draw,
            };
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
          }}
        >
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                id="email"
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="prize">Prize</label>
              <input
                type="text"
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                id="prize"
                name="prize"
                placeholder="Enter prize"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                id="date"
                name="date"
                placeholder="Enter date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Wallet Address</label>
              <input
                type="text"
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
                id="address"
                name="address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="draw">Draw</label>
              {/* select with opitons from draws */}
              <select
                defaultValue={"Classic Weekly"}
                value={draw}
                onChange={(e) => setDraw(e.target.value)}
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:-xs sm:text-sm"
              >
                {draws
                  .filter((d) => d.live !== false)
                  .map((draw) => (
                    <option key={draw._id} value={draw.title}>
                      {draw.title}
                    </option>
                  ))}
              </select>
            </div>
          </form>
        </ModalComponent>
        <WinnersTable data={winners} fetchWinners={fetchWinners} />
      </Layout>
    </div>
  );
}

export default Winners;
