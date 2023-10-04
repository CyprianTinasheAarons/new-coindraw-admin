import { useDispatch } from "react-redux";
import { getTransactions, updateTransaction } from "../../slices/transactions";
import { sendReward } from "../../slices/referral";
import { useEffect, useState } from "react";
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
  Button,
  useToast,
} from "@chakra-ui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReferralRequests({ data }) {

  const combinedData = data.filter((t) => t?.requestPayout?.requested === true || t?.requestNewCode?.requested === true || t?.requestDateExtension?.requested === true);


  return (
    <div>
   
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
              Request Payout
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Request New Code
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Request Date Extension
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
            Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {combinedData?.map((t) => (
            <tr key={t?.id}>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.email}
              </td>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                {t?.requestPayout?.requested ? "Yes" : "No"}
              
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.requestNewCode?.requested ? "Yes" : "No"}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {t?.requestDateExtension?.requested ? "Yes" : "No"}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {new Date(t?.updatedAt).toLocaleDateString()}
              </td>

              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
}
