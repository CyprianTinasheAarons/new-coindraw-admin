import { Dialog, Transition } from "@headlessui/react";
import { Fragment, use, useEffect, useState } from "react";

// import { useState } from "react";
// import AuthService from "../api/auth.service";
import authService from "../../api/auth.service";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import userService from "../../api/user.service";

export default function EditUser(user) {
  let [isOpen, setIsOpen] = useState(false);
  const [userEdit, setUserEdit] = useState({});
  const [userUpdated, setUserUpdated] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    EditUser(user.user, data);
    console.log(data);
    // signup(data);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const deleteUser = (user) => {
    userService
      .deleteUser(user.user)
      .then((res) => {
        toast("User deleted successfully", {
          type: "success",
        });
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

  const getUser = (user) => {
    userService
      .get(user.user)
      .then((res) => {
        // console.log(res.data);
        setUserEdit(res.data);
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

  const EditUser = (arg1, arg2) => {
    userService
      .update(arg1, arg2)
      .then((res) => {
        toast("User updated successfully", {
          type: "success",
        });
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

  //   console.log(userEdit);

  useEffect(() => {
    getUser(user);
  }, []);

  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={openModal}
          className="flex justify-center  px-4 py-2 text-sm font-medium text-green border border-transparent rounded-md shadow-sm border-green hover:border-red-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Edit User
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                  <>
                    <div className="flex flex-col justify-center min-h-full py-6 sm:px-6 lg:px-8">
                      <h1 className="mt-6 text-xl font-bold tracking-tight text-center text-gray-900">
                        Edit User{" "}
                      </h1>
                      <div className="flex justify-center items-center text-sm pt-4">
                        <div>
                          <p className="text-black">
                            Name : <b>{userEdit?.username}</b>
                          </p>

                          <p className="text-black">
                            Email : <b>{userEdit?.email}</b>
                          </p>

                          <p className="text-black">
                            Phone Number : <b>{userEdit?.phoneNumber}</b>
                          </p>
                        </div>
                      </div>
                      <div>
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="flex flex-col justify-center min-h-full  sm:px-6 lg:px-8"
                        >
                          <div className="sm:mx-auto sm:w-full sm:max-w-md"></div>

                          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="px-4 py-2 bg-white shadow sm:rounded-lg sm:px-10">
                              <div>
                                <label
                                  htmlFor="username"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Full Name
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    {...register("username")}
                                    autoComplete="username"
                                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Email address
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    {...register("email")}
                                    autoComplete="email"
                                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Wallet address
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    {...register("address")}
                                    autoComplete="address"
                                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="phoneNumber"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Phone number
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    {...register("phoneNumber")}
                                    autoComplete="phoneNumber"
                                    className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                              </div>

                              <div className="mt-4">
                                <button
                                  type="submit"
                                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-green hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  Update User
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
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
