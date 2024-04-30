import {
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDiscount, updateDiscount } from "../../slices/discount";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useEffect, useState } from "react";
export default function DiscountsTable({ data }) {
  const { isLoading } = useSelector((state) => state.discount);
  const [discountData, setDiscountData] = useState({
    id: "",
    name: "",
    code: "",
    percentage: 0,
    accounts: [],
    usageLimit: 0,
    usageCount: 0,
    active: false,
    expiry: new Date(),
    applicableDraws: [],
  });

  const drawTypes = [
    { name: "Classic", value: "Classic" },
    { name: "Monthly", value: "Monthly" },
    { name: "Elite", value: "Elite" },
    { name: "Quarterly", value: "Quarterly" },
    { name: "Yearly", value: "Yearly" },
    { name: "Custom", value: "Custom" },
  ];

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const toast = useToast();

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    await dispatch(deleteDiscount(id))
      .unwrap()
      .then(() => {
        toast({
          title: "Discount deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        location.reload();
      });
  };

  const handleUpdate = async () => {
    const discount = {
      id: discountData.id,
      name: discountData.name,
      code: discountData.code,
      percentage: discountData.percentage,
      accounts: discountData.accounts,
      usageLimit: discountData.usageLimit,
      usageCount: discountData.usageCount,
      active: discountData.active,
      expiry: discountData.expiry,
      applicableDraws: discountData.applicableDraws,
    };

    await dispatch(updateDiscount(discount))
      .unwrap()
      .then(() => {
        toast({
          title: "Discount updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        location.reload();
      });
  };

  const editDiscountDialog = (discount) => {
    setDiscountData(discount);
    onOpenEdit();
  };

  const handleCheckboxChange = (e, value) => {
    if (e.target.checked) {
      setDiscountData((prev) => ({
        ...prev,
        applicableDraws: [...prev.applicableDraws, value],
      }));
    } else {
      setDiscountData((prev) => ({
        ...prev,
        applicableDraws: prev.applicableDraws.filter((draw) => draw !== value),
      }));
    }
  };

  const generateDiscountCode = () => {
    const length = 8; // Choose the length of the discount code.
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setDiscountData((prev) => ({
      ...prev,
      code: result,
    }));
  };

  return (
    <div className="mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Discounts
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            All discounts created on the platform.
          </p>
        </div>
      </div>
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Discount Name
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Code
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Percentage
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Usage limit
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Usage count
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Active
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Expiry
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data?.map((r) => (
                    <tr key={r.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {r?.name}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {r?.code}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {r?.percentage}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {r?.usageLimit}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {r?.usageCount}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {new Date(r?.expiry).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {r?.active ? (
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-500 bg-blue-100 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="flex px-3 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                        <CopyToClipboard
                          text={r?.code}
                          onCopy={() =>
                            toast({
                              title: "Link copied.",
                              status: "success",
                              duration: 9000,
                              isClosable: true,
                            })
                          }
                        >
                          <button className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            Copy Code
                          </button>
                        </CopyToClipboard>
                        <button
                          type="button"
                          onClick={() => editDiscountDialog(r)}
                          className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(r?.id)}
                          className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Discount</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={discountData.name}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        name: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code
                </label>
                <div className="flex items-center mt-1 align-middle">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={discountData.code}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        code: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button onClick={generateDiscountCode}>
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
                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="percentage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Percentage
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="percentage"
                    id="percentage"
                    value={discountData.percentage}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        percentage: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="usageLimit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usage Limit
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="usageLimit"
                    id="usageLimit"
                    value={discountData.usageLimit}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        usageLimit: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="usageCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Usage Count
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="usageCount"
                    id="usageCount"
                    value={discountData.usageCount}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        usageCount: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="expiry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry (
                  {new Date(discountData?.expiry).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  )
                </label>
                <div className="mt-1">
                  {/* use 2021-12-31 format for expiry Date DatePicker */}
                  <input
                    type="date"
                    name="expiry"
                    id="expiry"
                    value={discountData.expiry}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        expiry: e.target.value,
                      })
                    }
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="types"
                  className="block text-sm font-medium text-gray-700"
                >
                  Applicable Draws
                </label>
                <div className="mt-1">
                  {/* select multiple and checkbox applicableDraws into an array */}
                  <div>
                    {drawTypes.map((drawType) => (
                      <div
                        key={drawType.value}
                        className="flex items-center align-middle"
                      >
                        <input
                          type="checkbox"
                          id={drawType.value}
                          value={drawType.value}
                          checked={discountData.applicableDraws.includes(
                            drawType.value
                          )}
                          onChange={(e) =>
                            handleCheckboxChange(e, drawType.value)
                          }
                          className="block w-6 h-6 my-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <label htmlFor={drawType.value} className="p-1 text-sm">
                          {drawType.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="active"
                  className="block text-sm font-medium text-gray-700"
                >
                  Active
                </label>
                <div className="mt-1">
                  <input
                    type="checkbox"
                    name="active"
                    id="active"
                    checked={discountData.active}
                    onChange={(e) =>
                      setDiscountData({
                        ...discountData,
                        active: e.target.checked,
                      })
                    }
                    className="block w-6 h-6 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              onClick={onCloseEdit}
              className="inline-flex justify-center px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              Update
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
