import Layout from "../components/Layout";
import DiscountsTable from "../components/tables/discountsTable";
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
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDiscount, getAllDiscounts } from "../slices/discount";

const Discounts = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const allDiscounts = useSelector((state) => state.discount.discounts);
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();
  const drawTypes = [
    { name: "Classic", value: "Classic" },
    { name: "Monthly", value: "Monthly" },
    { name: "Elite", value: "Elite" },
    { name: "Quarterly", value: "Quarterly" },
    { name: "Yearly", value: "Yearly" },
    { name: "Custom", value: "Custom" },
  ];

  const [selectedDraws, setSelectedDraws] = useState([]);
  const [discountData, setDiscountData] = useState({
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

  const getData = () => {
    dispatch(getAllDiscounts());
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  const create = async () => {
    if (!discountData.applicableDraws.length) {
      toast({
        title: "No Draws Selected",
        description: "Please select at least one draw type",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(createDiscount(discountData)).unwrap();
      toast({
        title: "Discount Created",
        description: "Discount created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      getData();
      onCloseCreate();
    } catch (err) {
      toast({
        title: "Discount Creation Failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCheckboxChange = (event, value) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the value to the selectedDraws array
      setSelectedDraws([...selectedDraws, value]);
      // Add the value to the applicableDraws array in discountData
      setDiscountData((prev) => ({
        ...prev,
        applicableDraws: [...prev.applicableDraws, value],
      }));
    } else {
      // Remove the value from the selectedDraws array
      setSelectedDraws(selectedDraws.filter((draw) => draw !== value));
      // Remove the value from the applicableDraws array in discountData
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
    <>
      <Head>
        <title>Coindraw Admin | Discounts </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full bg-white">
        <Layout>
          <div className="py-8 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Discounts
            </h3>
            <div className="flex mt-3 sm:ml-4 sm:mt-0">
              <button
                type="button"
                onClick={onOpenCreate}
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Add Discount
              </button>
            </div>
          </div>

          <DiscountsTable data={allDiscounts} />

          <Modal isOpen={isOpenCreate} onClose={onCloseCreate}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Discount</ModalHeader>
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
                      Expiry
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
                      htmlFor="applicableDraws"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Applicable Draws
                    </label>
                    <div className="mt-1">
                      {/* Reviewing the code, it seems to be correctly mapping through drawTypes and creating a checkbox for each drawType */}
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
                              onChange={(e) =>
                                handleCheckboxChange(e, drawType.value)
                              }
                              className="block w-6 h-6 my-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <label htmlFor={drawType.value} className="text-sm">
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
                  onClick={onCloseCreate}
                  className="inline-flex justify-center px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={create}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                  Create
                </button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Layout>
      </main>
    </>
  );
};

export default Discounts;
