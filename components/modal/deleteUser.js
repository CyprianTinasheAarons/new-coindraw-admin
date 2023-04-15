import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import { toast } from "react-toastify";
import userService from "../../api/user.service";

export default function DeleteUser({ user, fetchUsers }) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const deleteUser = (user) => {
    console.log(user);
    userService
      .deleteUser(user)
      .then(() => {
        toast("User deleted successfully", {
          type: "success",
        });
        fetchUsers();
      })
      .catch((err) => {
        console.log(user);
        toast(
          `${err.response && err.response.data && err.response.data.message}`,
          {
            type: "error",
          }
        );
      });
  };

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={openModal}
          className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <>
                    <div className="flex flex-col justify-center min-h-full py-6 sm:px-6 lg:px-8">
                      <h1 className="pb-6 my-2 text-center">
                        Are you sure you want to Delete User ?
                      </h1>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            deleteUser(user);
                          }}
                          className="px-4 py-1 border border-red-400 rounded-md "
                        >
                          {" "}
                          Yes
                        </button>
                        <button
                          onClick={() => closeModal()}
                          className="px-4 py-1 border rounded-md border-green "
                        >
                          {" "}
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
