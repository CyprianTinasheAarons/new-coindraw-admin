import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import boxService from "../../api/box.service";
import { useToast } from "@chakra-ui/react";
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
} from "@chakra-ui/react";

export default function BoxViewer() {
  const [box, setBox] = useState({
    boxType: "Monthly", // Classic or Monthly
    prizes: [
      {
        id: "",
        name: "", // Name of the prize
        image: "", // Image of the prize
        type: "", // Type of prize
        unlimitedQuantity: false, // Unlimited quantity of prize
        quantity: 0, // Quantity of the prize
        probability: 0, // Probability of winning the prize
        discordNotificationType: "", // Type of Discord notification
        nftContractAddress: "", // Address of the contract
        nftTokenId: 0, // Token ID of the NFT
        maticPrice: 0, // Price of the prize in Matic
        coinAddress: "", // Address of the coin
        coinAmount: 0, // Amount of the coin
        boxWon: "", // ID of the box won
      },
    ],
  });
  const [prize, setPrize] = useState({
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`, // ID of the prize, if it exists
    name: "", // Name of the prize
    image: "", // Image of the prize
    type: "Digital", // Type of prize
    unlimitedQuantity: false, // Unlimited quantity of prize
    quantity: 0, // Quantity of the prize
    probability: 0, // Probability of winning the prize
    discordNotificationType: "ChannelOnly", // Type of Discord notification
    nftContractAddress: "", // Address of the contract
    nftTokenId: 0, // Token ID of the NFT
    maticPrice: 0, // Price of the prize in Matic
    boxWon: "", // ID of the box won
  });

  const toast = useToast();

  const getBox = async () => {
    await boxService
      .getAllCoinboxes()
      .then((boxes) => {
        console.log(boxes.data);
        const classicBox = boxes.data.filter(
          (box) => box.boxType === "Monthly"
        );
        classicBox[0].prizes.sort((a, b) => a.order - b.order);
        setBox(classicBox[0]);
        console.log(classicBox[0]);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "There was an error fetching the box",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    getBox();
  }, []);

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
      const updatedPrizes = [...box.prizes, prize];
      try {
        await boxService.updateCoinbox(box.id, { prizes: updatedPrizes });
        toast({
          title: "Box Updated",
          description: "The box has been updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        await getBox(); // Refresh the box data instead of reloading the page
        onClose();
        setPrize({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
          name: "",
          image: "",
          type: "",
          unlimitedQuantity: false,
          quantity: 0,
          probability: 0,
          discordNotificationType: "",
          nftContractAddress: "",
          nftTokenId: [0],
          maticPrice: 0,
          coinAddress: "",
          coinAmount: 0,
          coinName: "",
          boxWon: "",
        });
      } catch (error) {
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
          boxType: "Monthly",
        });
        toast({
          title: "Box Created",
          description: "The box has been created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        await getBox(); // Refresh the box data instead of reloading the page
      } catch (error) {
        console.error(error);
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
    const newPrizes = box.prizes.filter((p) => p.id !== prize.id); // Use id instead of name
    try {
      await boxService.updateCoinbox(box.id, { prizes: newPrizes });
      toast({
        title: "Box Updated",
        description: "The prize has been removed from the box",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      await getBox(); // Refresh the box data instead of reloading the page
      onClose(); // Close the modal after successful deletion
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
    const index = box.prizes.findIndex((p) => p.id === prize.id);
    console.log("Prize index:", index);

    if (index !== -1) {
      box.prizes[index] = prize;
    }
    const totalProbability = box?.prizes.reduce(
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
        <div className="mb-2">
          <div className="mx-auto max-w-7xl ">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              CoinBox Editor
            </h1>
          </div>
        </div>
        {box?.id ? (
          <div className="space-y-8 divide-y divide-gray-200 ">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="flex text-2xl font-semibold leading-6 align-middle text-green">
                    {box?.boxType} Box (ID: {box?.id}){" "}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(box?.id);
                        toast({
                          title: "Box ID Copied",
                          description:
                            "The box ID has been copied to your clipboard.",
                          status: "info",
                          duration: 5000,
                          isClosable: true,
                        });
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
                          d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                    </button>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Prizes in the box
                  </p>
                  <button
                    onClick={onOpen}
                    className="px-4 py-2 mx-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:text-white"
                  >
                    New Prize
                  </button>

                  {box?.paused ? (
                    <button
                      onClick={unpauseBox}
                      className="px-4 py-2 mx-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
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
                            max="100000"
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
                          max="100000"
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
                        <option>Monthly</option>
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
