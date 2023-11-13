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
    boxType: "Exclusive", // Classic or Exclusive
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
        nftTokenId: 0, // Token ID of the NFT
        maticPrice: 0, // Price of the prize in Matic
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
    discordNotificationType: "Everyone", // Type of Discord notification
    nftContractAddress: "", // Address of the contract
    nftTokenId: 0, // Token ID of the NFT
    maticPrice: 0, // Price of the prize in Matic
  });

  const toast = useToast();

  const getBox = async () => {
    await boxService
      .getAllCoinboxes()
      .then((boxes) => {
        console.log(boxes.data);
        const classicBox = boxes.data.filter(
          (box) => box.boxType === "Exclusive"
        );
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
          boxType: "Exclusive",
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
    const index = box.prizes.findIndex((p) => p.id === prize.id);
    console.log("Prize index:", index);

    if (index !== -1) {
      box.prizes[index] = prize;
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
                  <h3 className="text-2xl font-semibold leading-6 text-green">
                    {box?.boxType} Box
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Prizes in the box
                  </p>
                  <button
                    onClick={onOpen}
                    className="px-4 py-2 mt-2 text-sm font-medium text-black border rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-white"
                  >
                    Add New Prize
                  </button>
                </div>
                <Table
                  prizes={box?.prizes}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add a new prize</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <div className="grid grid-cols-2 gap-4 p-4">
                        <div className="space-y-2">
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
                              <option value="Physical">Physical</option>
                              <option value="MATIC">MATIC</option>
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
                            Probability (out of 1000)
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
                            max="1000"
                            min="0"
                          />

                          <label className="text-sm font-medium text-gray-900">
                            Discord Notification Type
                          </label>
                          <select
                            name="discordNotificationType"
                            value={prize?.discordNotificationType || "Everyone"}
                            onChange={(e) =>
                              setPrize({
                                ...prize,
                                discordNotificationType: e.target.value,
                              })
                            }
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="Everyone">Everyone</option>
                            <option value="ChannelOnly">Channel Only</option>
                          </select>

                          {prize?.type === "Digital" && (
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
                              <label className="text-sm font-medium text-gray-900">
                                NFT Token IDs
                              </label>
                              <textarea
                                type="number"
                                name="nftTokenId"
                                value={prize?.nftTokenId}
                                onChange={(e) =>
                                  setPrize({
                                    ...prize,
                                    nftTokenId: e.target.value.split(","),
                                  })
                                }
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="NFT Token ID (enter each ID on a new line)"
                              />
                            </>
                          )}
                          {prize?.type === "MATIC" && (
                            <>
                              <label className="text-sm font-medium text-gray-900">
                                Matic Price
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
                                placeholder="Matic Price"
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
                <Modal isOpen={isEditOpen} onClose={onEditClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Edit Prize</ModalHeader>
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="space-y-2">
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
                            <option value="Physical">Physical</option>
                            <option value="MATIC">MATIC</option>
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
                          Probability (out of 1000)
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
                          max="1000"
                          min="0"
                        />

                        <label className="text-sm font-medium text-gray-900">
                          Discord Notification Type
                        </label>
                        <select
                          name="discordNotificationType"
                          value={prize?.discordNotificationType || "Everyone"}
                          onChange={(e) =>
                            setPrize({
                              ...prize,
                              discordNotificationType: e.target.value,
                            })
                          }
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="Everyone">Everyone</option>
                          <option value="ChannelOnly">Channel Only</option>
                        </select>

                        {prize?.type === "Digital" && (
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
                            <label className="text-sm font-medium text-gray-900">
                              NFT Token IDs
                            </label>
                            <textarea
                              type="number"
                              name="nftTokenId"
                              value={prize?.nftTokenId}
                              onChange={(e) =>
                                setPrize({
                                  ...prize,
                                  nftTokenId: e.target.value.split(","),
                                })
                              }
                              className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="NFT Token ID (enter each ID on a new line)"
                            />
                          </>
                        )}
                        {prize?.type === "MATIC" && (
                          <>
                            <label className="text-sm font-medium text-gray-900">
                              Matic Price
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
                              placeholder="Matic Price"
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
                        <option>Exclusive</option>
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
                      Token ID
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
                          {index + 1}
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
                          {prize.probability}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.discordNotificationType}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {prize.nftContractAddress}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {" "}
                          {Array.isArray(prize.nftTokenId)
                            ? prize.nftTokenId.join(", ")
                            : prize.nftTokenId}
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
