import Layout from "../components/Layout";
import { useState } from "react";
import drawService from "../api/draw.service";
import { useToast } from "@chakra-ui/react";
import Head from "next/head";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddImage from "../components/modal/addimage";

export default function DrawCreate() {
  const [draw, setDraw] = useState([
    {
      dependentContractAddresses: [],
      dependentAbis: [],
      title: "",
      type: "",
      image: "",
      description: "",
      closeDate: "",
      price: null,
      maxprice: "",
      maxodds: "",
      live: false,
      contractAddress: "",
      abi: "",
      mintPrice: "",
      usdPrice: "",
      eurPrice: "",
      gbpPrice: "",
      question: "",
      answerA: "",
      answerB: "",
      answerC: "",
      correctAnswer: "",
    },
  ]);

  const types = [
    { label: "Classic", value: "Classic" },
    { label: "Exclusive", value: "Exclusive" },
    { label: "Elite", value: "Elite" },
    { label: "Quarterly", value: "Quarterly" },
    { label: "Yearly", value: "Yearly" },
  ];

  const toast = useToast();

  const createDraw = () => {
    draw.type = draw.type || "Classic";
    draw.image = localStorage.getItem("draw_image");
    drawService
      .create(draw)
      .then(() => {
        toast({
          title: "Draw Created",
          description: "The draw has been created successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        location.href = "/draws";
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "There was an error create the draw",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Head>
        <title>Coindraw Admin | Create </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mb-2">
          <div className="mx-auto max-w-7xl ">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Draw Editor
            </h1>
          </div>
        </div>
        <div className="p-4 space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-2xl font-semibold leading-6 text-green">
                  {draw?.title} Draw
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoComplete="title"
                      value={draw?.title}
                      onChange={(e) =>
                        setDraw({ ...draw, title: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Type
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <select
                      id="type"
                      name="type"
                      value={draw?.type || "Classic"}
                      onChange={(e) =>
                        setDraw({ ...draw, type: e.target.value })
                      }
                      className=" p-2 block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      value={draw?.description}
                      onChange={(e) =>
                        setDraw({ ...draw, description: e.target.value })
                      }
                      rows={3}
                      className="block p-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Write a few sentences about draw.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Draw photo
                  </label>
                  <div className="flex justify-center px-6 pt-5 pb-6 mt-2 border-2 border-gray-300 border-dashed rounded-md">
                    {draw?.image ? (
                      <img src={draw?.image} alt="draw" />
                    ) : (
                      <AddImage />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Price and availability
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set the price and availability of your draw.
                </p>
              </div>
              <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="maxprice"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prize
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="maxprice"
                      id="maxprice"
                      value={draw?.maxprice}
                      onChange={(e) =>
                        setDraw({ ...draw, maxprice: e.target.value })
                      }
                      autoComplete="maxprice"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="maxodds"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Max Odds
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="maxodds"
                      id="maxodds"
                      value={draw?.maxodds}
                      onChange={(e) =>
                        setDraw({ ...draw, maxodds: e.target.value })
                      }
                      autoComplete="maxodds"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="closeDate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Close Date
                  </label>
                  <div className="mt-2">
                    <DatePicker
                      dateFormat={"dd/MM/yyyy"}
                      showTimeSelect
                      selected={draw?.closeDate ? new Date(draw?.closeDate) : null}
                      className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(date) =>
                        setDraw({ ...draw, closeDate: date.toISOString() })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <div className="relative flex items-start ">
                    <div className="flex items-center h-6">
                      <input
                        id="live"
                        name="live"
                        value={draw?.live}
                        onChange={(e) =>
                          setDraw({ ...draw, live: !draw?.live })
                        }
                        checked={draw?.live}
                        type="checkbox"
                        className="w-8 h-8 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="live"
                        className="font-medium text-gray-900"
                      >
                        Live
                      </label>
                      <p className="text-gray-500">
                        If you want to make this draw live, check this box.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Smart Contracts
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set contracts and ABI(s)
                </p>
              </div>
              <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="contractAddress"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Main Contract Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="contractAddress"
                      id="contractAddress"
                      value={draw?.contractAddress}
                      onChange={(e) =>
                        setDraw({ ...draw, contractAddress: e.target.value })
                      }
                      autoComplete="contractAddress"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="abi"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Main ABI Json
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="abi"
                      id="abi"
                      value={draw?.abi}
                      onChange={(e) =>
                        setDraw({ ...draw, abi: e.target.value })
                      }
                      autoComplete="abi"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="mintPrice"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Matic Price
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="mintPrice"
                      id="mintPrice"
                      value={draw?.mintPrice}
                      onChange={(e) =>
                        setDraw({ ...draw, mintPrice: e.target.value })
                      }
                      autoComplete="mintPrice"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:col-span-3">
                  <div>
                    <label
                      htmlFor="mintPrice"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      USD Price
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="mintPrice"
                        id="mintPrice"
                        value={draw?.usdPrice}
                        onChange={(e) =>
                          setDraw({ ...draw, usdPrice: e.target.value })
                        }
                        autoComplete="mintPrice"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="mx-1">
                    <label
                      htmlFor="mintPrice"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      EUR Price
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="mintPrice"
                        id="mintPrice"
                        value={draw?.eurPrice}
                        onChange={(e) =>
                          setDraw({ ...draw, eurPrice: e.target.value })
                        }
                        autoComplete="mintPrice"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="mx-1">
                    <label
                      htmlFor="mintPrice"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      GBP Price
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="mintPrice"
                        id="mintPrice"
                        value={draw?.gbpPrice}
                        onChange={(e) =>
                          setDraw({ ...draw, gbpPrice: e.target.value })
                        }
                        autoComplete="mintPrice"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="dependentContractAddresses"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Dependent Contract Addresses
                  </label>
                  <div className="mt-2">
                    <input
                      id="dependentContractAddresses"
                      name="dependentContractAddresses"
                      type="dependentContractAddresses"
                      placeholder="0x0000000,0x0000001,0x0000002"
                      value={draw?.dependentContractAddresses}
                      onChange={(e) =>
                        setDraw({
                          ...draw,
                          dependentContractAddresses: e.target.value,
                        })
                      }
                      autoComplete="dependentContractAddresses"
                      className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Draw Question
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set the question for the draw
                </p>
              </div>
              <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Question
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="question"
                      id="question"
                      autoComplete="question"
                      value={draw?.question}
                      onChange={(e) =>
                        setDraw({ ...draw, question: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Answer A
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="answerA"
                      id="answerA"
                      autoComplete="answerA"
                      value={draw?.answerA}
                      onChange={(e) =>
                        setDraw({ ...draw, answerA: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Answer B
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="answerB"
                      id="answerB"
                      autoComplete="answerB"
                      value={draw?.answerB}
                      onChange={(e) =>
                        setDraw({ ...draw, answerB: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Answer C
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="answerC"
                      id="answerC"
                      autoComplete="answerC"
                      value={draw?.answerC}
                      onChange={(e) =>
                        setDraw({ ...draw, answerC: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Answer D
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="answerD"
                      id="answerD"
                      autoComplete="answerD"
                      value={draw?.answerD}
                      onChange={(e) =>
                        setDraw({ ...draw, answerD: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="correctAnswer"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Correct Answer
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="correctAnswer"
                      id="correctAnswer"
                      autoComplete="correctAnswer"
                      placeholder="1, 2, or 3"
                      value={draw?.correctAnswer}
                      onChange={(e) =>
                        setDraw({ ...draw, correctAnswer: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                onClick={() => createDraw()}
                className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Draw
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
