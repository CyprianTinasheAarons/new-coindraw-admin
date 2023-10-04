import { useDispatch } from "react-redux";
import { getTransactions,createTransaction, updateTransaction } from "../../slices/transactions";
import {useEffect, useState} from 'react'

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

export default function ReferralTransactions() {
  const dispatch = useDispatch();
  const toast = useToast();
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
    const res = await dispatch(createTransaction(transaction)).unwrap();
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
  
  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={saveTransaction}
          className="p-2 m-1 border-2 border-gray-300 rounded-md border-green hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
        >
          Save Transaction
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      email: e.target.value,
                    })
                  }
                />
              </div>
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
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <div className="mt-1">
                <input
                  id="amount"
                  name="amount"
                  type="text"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      amount: e.target.value,
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
