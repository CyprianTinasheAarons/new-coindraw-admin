import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import authService from "../../api/auth.service";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";

export default function AddUser({ fetchUsers }) {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signup(data);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const signup = async (data) => {
    try {
      const res = await authService.register(data);
      console.log(res);
      console.log("User has been registered");
      closeModal();
      toast({
        title: "Success",
        description: "User has been registered successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      location.reload();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response
          ? error.response.data.message
          : "User has not been registered.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <div className="my-6">
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Add User
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
                <Dialog.Panel className="w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl">
                  <>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col justify-center min-h-full py-6 sm:px-6 lg:px-8"
                    >
                      <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <a href="/">
                          <img
                            className="w-auto h-12 mx-auto"
                            src="logo.png"
                            alt="Your Company"
                          />
                        </a>
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-center text-gray-900">
                          Register New Admin User
                        </h2>
                      </div>

                      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="px-4 py-2 sm:px-10">
                          <div className="py-1">
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

                          <div className="py-1">
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

                          <div className="py-1">
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

                          <div className="py-1">
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

                          <div className="py-1">
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Password
                            </label>
                            <div className="mt-1">
                              <input
                                id="password"
                                name="password"
                                type="password"
                                {...register("password")}
                                autoComplete="password"
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="py-1">
                            <label
                              htmlFor="confirm-password"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Confirm Password
                            </label>
                            <div className="mt-1">
                              <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          {/* add function to select role user or admin */}
                          <div className="py-1">
                            <label
                              htmlFor="role"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Role
                            </label>
                            <div className="mt-1">
                              <select
                                id="role"
                                name="role"
                                {...register("role")}
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              type="submit"
                              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-green hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Submit User
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
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
