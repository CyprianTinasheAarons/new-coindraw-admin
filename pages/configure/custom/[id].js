import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import boxService from "../../../api/box.service";
import Head from "next/head";
import { useRouter } from "next/router";

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

export default function BoxViewer() {
  const [box, setBox] = useState({
    boxType: "Custom", // Classic or Monthly
    prizes: [
      {
        id: "", // ID of the prize, if it exists
        name: "", // Name of the prize
        image: "", // Image of the prize
        type: "", // Type of prize
        unlimitedQuantity: false, // Unlimited quantity of prize
        quantity: 0, // Quantity of the prize
        probability: 0, // Probability of winning the prize
        discordNotificationType: "", // Type of Discord notification
        nftContractAddress: "", // Address of the contract
        nftTokenId: [0], // Token ID of the NFT
        maticPrice: 0, // Price of the prize in Matic
        coinAddress: "", // Address of the coin
        coinAmount: 0, // Amount of the coin
        coinName: "",
        boxWon: "", // Box won
      },
    ],
  });
  const [prize, setPrize] = useState({
    id:
      Math.random().toString(36).substring(2, 36) +
      Math.random().toString(36).substring(2, 36), // ID of the prize, if it exists
    name: "", // Name of the prize
    image: "", // Image of the prize
    type: "Digital", // Type of prize
    unlimitedQuantity: false, // Unlimited quantity of prize
    quantity: 0, // Quantity of the prize
    probability: 0, // Probability of winning the prize
    discordNotificationType: "ChannelOnly", // Type of Discord notification
    nftContractAddress: "", // Address of the contract
    nftTokenId: [0], // Token ID of the NFT
    maticPrice: 0, // Price of the prize in Matic
    boxWon: "", // Box won
  });

  const toast = useToast();

  const router = useRouter();

  //get id from the url nextjs
  const { id } = router.query;

  const getBox = async () => {
    await boxService
      .getCoinbox(id)
      .then((response) => {
        setBox(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBox();
  }, [id]);

  const editBox = async () => {
    const totalProbability = box?.prizes.reduce(
      (total, prize) => total + prize.probability,
      0
    );
    if (totalProbability > 100000) {
      toast({
        title: "Error",
        description: "Total probability cannot exceed 100,000",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (box?.id) {
      box.prizes.push(prize);
      try {
        await boxService.updateCoinbox(box.id, { prizes: box.prizes });
        toast({
          title: "Box Updated",
          description: "The box has been updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        location.reload();
      } catch (error) {
        box.prizes.pop();
        toast({
          title: "Error",
          description: "There was an error updating the box",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      try {
        await boxService.createCoinbox({
          boxType: "Custom",
        });
        toast({
          title: "Box Created",
          description: "The box has been created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        location.reload();
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "There was an error creating the box",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const deleteBox = async () => {
    const newPrizes = box.prizes.filter((p) => p.name !== prize.name);
    try {
      await boxService.updateCoinbox(box.id, { prizes: newPrizes });
      toast({
        title: "Box Updated",
        description: "The box has been updated",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the box",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const editPrize = async () => {
    console.log("Starting to edit prize");
    const index = box?.prizes.findIndex((p) => p.id === prize.id);
    console.log("Prize index:", index);

    if (index !== -1) {
      box.prizes[index] = prize;
    }
    const totalProbability = box.prizes.reduce(
      (total, prize) => total + prize.probability,
      0
    );
    if (totalProbability > 100000) {
      toast({
        title: "Error",
        description: "Total probability exceeds 100,000",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log("Updating coinbox");
      await boxService.updateCoinbox(box.id, { prizes: box.prizes });
      toast({
        title: "Box Updated",
        description: "The box has been updated",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      location.reload();
    } catch (error) {
      console.log("Error updating the box:", error);
      toast({
        title: "Error",
        description: "There was an error updating the box",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleEdit = (prize) => {
    setPrize(prize);
    onEditOpen();
  };

  const handleDelete = (prize) => {
    setPrize(prize);
    onDeleteOpen();
  };

  const pauseBox = async () => {
    try {
      await boxService.updateCoinbox(box.id, { ...box, paused: true });
      toast({
        title: "Box Updated",
        description: "The box has been paused",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the box",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const unpauseBox = async () => {
    try {
      await boxService.updateCoinbox(box.id, { ...box, paused: false });
      toast({
        title: "Box Updated",
        description: "The box has been unpaused",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the box",
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
        {" "}
        <button
          onClick={() => history.back()}
          className="flex items-center px-4 py-2 my-4 mr-4 text-sm font-medium text-black border rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
          Back
        </button>
        {box?.id ? (
          <div className="space-y-8 divide-y divide-gray-200 ">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h1 className="text-2xl font-semibold leading-6 text-green">
                    {box?.boxType} Box : {box?.id}
                  </h1>{" "}
                  <h3 className="pt-2 text-xl font-semibold leading-6 text-black">
                    Box Name: {box?.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Prizes in the box
                  </p>
                  <button
                    onClick={onOpen}
                    className="px-4 py-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                  >
                    New Prize
                  </button>
                  {box?.paused ? (
                    <button
                      onClick={unpauseBox}
                      className="px-4 py-2 mx-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:text-white"
                    >
                      Unpause Box
                    </button>
                  ) : (
                    <button
                      onClick={pauseBox}
                      className="px-4 py-2 mx-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                    >
                      Pause Box
                    </button>
                  )}
                </div>
                <Table
                  prizes={box?.prizes}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
                <Modal isOpen={isOpen} onClose={onClose} size="lg">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add a new prize</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <div className="grid grid-cols-2 gap-2 p-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">
                            Position
                          </label>
                          <input
                            name="order"
                            value={prize?.order}
                            onChange={(e) =>
                              setPrize({ ...prize, order: e.target.value })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            type="text"
                            placeholder="Position"
                          />
                          <label className="text-sm font-medium text-gray-900">
                            Name
                          </label>
                          <input
                            name="name"
                            required
                            value={prize?.name}
                            onChange={(e) =>
                              setPrize({ ...prize, name: e.target.value })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            type="text"
                            placeholder="Name"
                          />
                          <label className="text-sm font-medium text-gray-900">
                            Image
                          </label>
                          <input
                            name="image"
                            required
                            value={prize?.image}
                            onChange={(e) =>
                              setPrize({ ...prize, image: e.target.value })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            type="text"
                            placeholder="Image"
                          />
                          <div>
                            <label className="text-sm font-medium text-gray-900">
                              Type
                            </label>
                            <select
                              name="type"
                              required
                              value={prize?.type || "Digital"}
                              onChange={(e) =>
                                setPrize({ ...prize, type: e.target.value })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="Digital">Digital</option>
                              <option value="DigitalCoindraw">
                                Digital Coindraw
                              </option>
                              <option value="Physical">Physical</option>
                              <option value="MATIC">MATIC</option>
                              <option value="CustomCoin">Custom Coin</option>
                              <option value="Box">Box</option>
                              <option value="NoWin">No Win</option>
                            </select>
                          </div>
                          <label className="text-sm font-medium text-gray-900">
                            Quantity
                          </label>
                          <div>
                            <label className="pr-1 text-xs font-light text-gray-900">
                              Unlimited Quantity
                            </label>
                            <input
                              type="checkbox"
                              id="unlimitedQuantity"
                              name="unlimitedQuantity"
                              checked={prize?.unlimitedQuantity}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  unlimitedQuantity: e.target.checked,
                                })
                              }
                            />
                          </div>

                          <input
                            name="quantity"
                            value={prize?.quantity}
                            onChange={(e) =>
                              setPrize({
                                ...prize,
                                quantity: parseInt(e.target.value),
                              })
                            }
                            className="block w-full px-3 pb-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            type="number"
                            placeholder="Quantity"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900">
                            Probability (out of 100,000)
                          </label>
                          <input
                            name="probability"
                            required
                            value={prize?.probability}
                            onChange={(e) =>
                              setPrize({
                                ...prize,
                                probability: parseFloat(e.target.value),
                              })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            type="number"
                            placeholder="Probability"
                            max="100,000"
                            min="0"
                          />

                          <label className="text-sm font-medium text-gray-900">
                            Discord Notification Type
                          </label>
                          <select
                            name="discordNotificationType"
                            required
                            value={
                              prize?.discordNotificationType || "ChannelOnly"
                            }
                            onChange={(e) =>
                              setPrize({
                                ...prize,
                                discordNotificationType: e.target.value,
                              })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            {" "}
                            <option value="ChannelOnly">Channel Only</option>
                            <option value="Everyone">Everyone</option>
                          </select>

                          {prize?.type === "Box" && (
                            <>
                              <label className="text-sm font-medium text-gray-900">
                                Box ID
                              </label>
                              <input
                                name="boxWon"
                                value={prize?.boxWon}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    boxWon: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="text"
                                placeholder="Box ID"
                              />
                            </>
                          )}

                          {prize?.type === "DigitalCoindraw" && (
                            <>
                              <label className="text-sm font-medium text-gray-900">
                                NFT Contract Address
                              </label>
                              <input
                                name="nftContractAddress"
                                value={prize?.nftContractAddress}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    nftContractAddress: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="text"
                                placeholder="NFT Contract Address"
                              />
                            </>
                          )}
                          {prize?.type === "MATIC" && (
                            <>
                              <label className="text-sm font-medium text-gray-900">
                                Matic Prize
                              </label>
                              <input
                                name="maticPrice"
                                value={prize?.maticPrice}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    maticPrice: parseFloat(e.target.value),
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="number"
                                placeholder="Matic Prize"
                              />
                            </>
                          )}
                          {prize?.type === "CustomCoin" && (
                            <>
                              <label className="text-sm font-medium text-gray-900">
                                Coin Name
                              </label>
                              <input
                                name="coinName"
                                value={prize?.coinName}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    coinName: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="text"
                                placeholder="Coin Name"
                              />
                              <label className="text-sm font-medium text-gray-900">
                                Coin Address
                              </label>
                              <input
                                name="coinAddress"
                                value={prize?.coinAddress}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    coinAddress: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="text"
                                placeholder="Coin Address"
                              />
                              <label className="text-sm font-medium text-gray-900">
                                Coin Amount
                              </label>
                              <input
                                name="coinAmount"
                                value={prize?.coinAmount}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    coinAmount: parseFloat(e.target.value),
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                type="number"
                                placeholder="Coin Amount"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <button
                        className="px-4 py-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                        onClick={onClose}
                      >
                        Close
                      </button>
                      <button
                        onClick={editBox}
                        className="px-4 py-2 mt-2 ml-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                      >
                        Save
                      </button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Edit Prize</ModalHeader>
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          Position
                        </label>
                        <input
                          name="order"
                          value={prize?.order}
                          onChange={(e) =>
                            setPrize({ ...prize, order: e.target.value })
                          }
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          type="text"
                          placeholder="Position"
                        />
                        <label className="text-sm font-medium text-gray-900">
                          Name
                        </label>
                        <input
                          name="name"
                          value={prize?.name}
                          onChange={(e) =>
                            setPrize({ ...prize, name: e.target.value })
                          }
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          type="text"
                          placeholder="Name"
                        />
                        <label className="text-sm font-medium text-gray-900">
                          Image
                        </label>
                        <input
                          name="image"
                          value={prize?.image}
                          onChange={(e) =>
                            setPrize({ ...prize, image: e.target.value })
                          }
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          type="text"
                          placeholder="Image"
                        />
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            Type
                          </label>
                          <select
                            name="type"
                            value={prize?.type || "Digital"}
                            onChange={(e) =>
                              setPrize({ ...prize, type: e.target.value })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="Digital">Digital</option>
                            <option value="DigitalCoindraw">
                              Digital Coindraw
                            </option>
                            <option value="Physical">Physical</option>
                            <option value="MATIC">MATIC</option>
                            <option value="CustomCoin">Custom Coin</option>
                            <option value="Box">Box</option>
                            <option value="NoWin">No Win</option>
                          </select>
                        </div>
                        <label className="text-sm font-medium text-gray-900">
                          Quantity
                        </label>
                        <div>
                          <label className="pr-1 text-xs font-light text-gray-900">
                            Unlimited Quantity
                          </label>
                          <input
                            type="checkbox"
                            id="unlimitedQuantity"
                            name="unlimitedQuantity"
                            checked={prize?.unlimitedQuantity}
                            onChange={(e) =>
                              setPrize({
                                ...prize,
                                unlimitedQuantity: e.target.checked,
                              })
                            }
                          />
                        </div>

                        <input
                          name="quantity"
                          value={prize?.quantity}
                          onChange={(e) =>
                            setPrize({
                              ...prize,
                              quantity: parseInt(e.target.value),
                            })
                          }
                          className="block w-full px-3 pb-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          type="number"
                          placeholder="Quantity"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                          Probability (out of 100,000)
                        </label>
                        <input
                          name="probability"
                          value={prize?.probability}
                          onChange={(e) =>
                            setPrize({
                              ...prize,
                              probability: parseFloat(e.target.value),
                            })
                          }
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          type="number"
                          placeholder="Probability"
                          max="100,000"
                          min="0"
                        />

                        <label className="text-sm font-medium text-gray-900">
                          Discord Notification Type
                        </label>
                        <select
                          name="discordNotificationType"
                          value={
                            prize?.discordNotificationType || "ChannelOnly"
                          }
                          onChange={(e) =>
                            setPrize({
                              ...prize,
                              discordNotificationType: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          {" "}
                          <option value="ChannelOnly">Channel Only</option>
                          <option value="Everyone">Everyone</option>
                        </select>

                        {prize?.type === "Box" && (
                          <>
                            <label className="text-sm font-medium text-gray-900">
                              Box ID
                            </label>
                            <input
                              name="boxWon"
                              value={prize?.boxWon}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  boxWon: e.target.value,
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              type="text"
                              placeholder="Box ID"
                            />
                          </>
                        )}

                        {prize?.type === "DigitalCoindraw" && (
                          <>
                            <label className="text-sm font-medium text-gray-900">
                              NFT Contract Address
                            </label>
                            <input
                              name="nftContractAddress"
                              value={prize?.nftContractAddress}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  nftContractAddress: e.target.value,
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              type="text"
                              placeholder="NFT Contract Address"
                            />
                          </>
                        )}
                        {prize?.type === "MATIC" && (
                          <>
                            <label className="text-sm font-medium text-gray-900">
                              Matic Prize
                            </label>
                            <input
                              name="maticPrice"
                              value={prize?.maticPrice}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  maticPrice: parseFloat(e.target.value),
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              type="number"
                              placeholder="Matic Prize"
                            />
                          </>
                        )}
                        {prize?.type === "CustomCoin" && (
                          <>
                            <label className="text-sm font-medium text-gray-900">
                              Coin Name
                            </label>
                            <input
                              name="coinName"
                              value={prize?.coinName}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  coinName: e.target.value,
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              type="text"
                              placeholder="Coin Name"
                            />
                            <label className="text-sm font-medium text-gray-900">
                              Coin Address
                            </label>
                            <input
                              name="coinAddress"
                              value={prize?.coinAddress}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  coinAddress: e.target.value,
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              type="text"
                              placeholder="Coin Address"
                            />
                            <label className="text-sm font-medium text-gray-900">
                              Coin Amount
                            </label>
                            <input
                              name="coinAmount"
                              value={prize?.coinAmount}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  coinAmount: parseFloat(e.target.value),
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              type="number"
                              placeholder="Coin Amount"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    <ModalFooter>
                      <button
                        className="px-4 py-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                        onClick={onEditClose}
                      >
                        Close
                      </button>
                      <button
                        onClick={editPrize}
                        className="px-4 py-2 mt-2 ml-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                      >
                        Save
                      </button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Delete Prize</ModalHeader>
                    <ModalBody>
                      <p className="text-red-500">
                        Warning: This action cannot be undone!
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <button
                        className="px-4 py-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                        onClick={onDeleteClose}
                      >
                        Close
                      </button>
                      <button
                        onClick={deleteBox}
                        className="px-4 py-2 mt-2 ml-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 divide-y divide-gray-200 ">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-2xl font-semibold leading-6 text-green">
                    {box?.boxType} Box
                  </h3>
                </div>

                <div className="grid grid-cols-2 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="boxType"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Box Type
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <select
                        id="boxType"
                        name="boxType"
                        value={box?.boxType}
                        onChange={(e) =>
                          setBox({ ...box, boxType: e.target.value })
                        }
                        className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  onClick={() => editBox()}
                  className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create Box
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

const Table = ({ prizes, handleDelete, handleEdit }) => {
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
                              : prize.type === "CustomCoin"
                              ? "bg-blue-500"
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
