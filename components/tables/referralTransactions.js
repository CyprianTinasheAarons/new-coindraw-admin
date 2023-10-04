import { useDispatch } from "react-redux";
import { getTransactions, updateTransaction } from "../../slices/transactions";
import { sendReward } from "../../slices/referral";
import {useEffect, useState} from 'react'
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
  Button
  ,useToast
} from "@chakra-ui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReferralTransactions({data}) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [usersTransactions, setUsersTransactions] = useState([]);
  const [transaction, setTransaction] = useState({
    email: "",
    receiptUrl: "",
    amount: "",
    type: ""
  })
  const [selectedUser, setSelectedUser] = useState({}); 
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose } = useDisclosure();
  
  const getData = async () => {
    const res = await dispatch(getTransactions()).unwrap();
    const filteredTransactions = res.filter(t => ["Paypal", "Fiat", "Crypto(MATIC)"].includes(t.type));
    setUsersTransactions(filteredTransactions);
  }

  useEffect(() => {
    getData(); // Fetch transactions immediately on component mount
    const interval = setInterval(() => {
      getData();
    }, 300000); // Fetches transactions every 5 minutes
    return () => clearInterval(interval); // Cleanup on component unmount
  }
  , [dispatch]);
  
  const uploadReceipt = (receiptUrl) => {
    setTransaction({...transaction, receiptUrl});
    onUploadOpen();
  }
  
  const saveTransaction = () => {
    onSaveOpen();
  }

  const handleSave = async () => {
    if (selectedUser.referrerReward <= 0) {
      toast({
        title: "Insufficient Reward.",
        description: "The selected user does not have enough referrer reward.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      const data = {
        email: selectedUser.email,
        receiptUrl: transaction.receiptUrl,
        amount: selectedUser.referrerReward,
        type: transaction.type || 'Paypal'
      }

      const res = await dispatch(sendReward(data)).unwrap()
      if(res){
        toast({
          title: "Transaction saved.",
          description: "We've saved your transaction.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        getData();
        onSaveClose();
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "An error occurred.",
        description: `Unable to save transaction`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  const handleUpload = (id) => {
    const res = dispatch(updateTransaction({id: selectedUser?.id, receiptUrl: transaction?.receiptUrl})).unwrap();
    if(res){
      toast({
        title: "Receipt uploaded.",
        description: "We've uploaded your receipt.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      getData();
      onUploadClose();
    }
  }

  console.log(data)
  
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={saveTransaction}
          className="p-2 m-1 border-2 border-gray-300 rounded-md border-green hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
        >
          Save Payout
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Email
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              Transaction
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
              Amount
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Receipt URL
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {usersTransactions?.map((t) => (
            <tr key={t?.id}>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.email}
              </td>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                {t?.transactionHash
                  ? t?.transactionHash?.substring(0, 20) + "..."
                  : "No hash"}
                {t?.transactionHash && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        t?.transactionHash ? t?.transactionHash : "No hash"
                      )
                    }
                    className="px-2 py-1 ml-2 text-xs text-white bg-blue-500 rounded"
                  >
                    Copy
                  </button>
                )}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.type}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.amount}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(t?.createdAt).toLocaleDateString()}
              </td>

              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.receiptUrl ? (
                  <a
                    href={t?.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline uppercase text-green"
                  >
                    View Receipt
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      uploadReceipt(t?.transactionHash);
                      setSelectedUser(t);
                    }}
                    className="px-4 py-2 text-white border rounded-md bg-green"
                  >
                    Upload Receipt
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Receipt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <label
              htmlFor="receipt"
              className="block text-sm font-medium text-gray-700"
            >
              Receipt url
            </label>
            <div className="mt-1">
              <input
                id="receiptUrl"
                name="receiptUrl"
                type="text"
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setTransaction({
                    ...transaction,
                    receiptUrl: e.target.value,
                  })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onUploadClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleUpload}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSaveOpen} onClose={onSaveClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <Combobox
                as="div"
                value={selectedUser}
                onChange={setSelectedUser}
              >
                <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
                  Select a person
                </Combobox.Label>
                <div className="relative mt-2">
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(person) => person?.email}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                    <ChevronUpDownIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  {data?.length > 0 && (
                    <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {data?.map((person) => (
                        <Combobox.Option
                          key={person.id}
                          value={person}
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
                                    person.referrerReward > 0
                                      ? "bg-green"
                                      : "bg-red-400"
                                  )}
                                  aria-hidden="true"
                                />
                                <span
                                  className={classNames(
                                    "ml-3 truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {person.email}
                                </span>
                                <span
                                  className={classNames(
                                    "ml-3 truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                 $ = {person.referrerReward}
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
              <label
                htmlFor="receipt"
                className="block text-sm font-medium text-gray-700"
              >
                Receipt url
              </label>
              <div className="mt-1">
                <input
                  id="receipt"
                  name="receipt"
                  type="text"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      receiptUrl: e.target.value,
                    })
                  }
                />
              </div>

              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      type: e.target.value,
                    })
                  }
                  defaultChecked="Paypal"
                >
                  <option value="Paypal">Paypal</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Crypto(MATIC)">Crypto(MATIC)</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onSaveClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
