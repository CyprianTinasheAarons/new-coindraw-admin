
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { updateReferralData } from "../../slices/referral";

export default function MyProfile({user}) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [userProfile, setUserProfile] = useState({
    userId: user?.userId || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zip: user?.zip || "",
    payout: {
      payoutType: user?.payout?.payoutType || "",
      walletAddress: user?.payout?.walletAddress || "",
      paypalId: user?.payout?.paypalId || "",
      bankDetails: {
        bankName: user?.payout?.bankDetails?.bankName || "",
        accountName: user?.payout?.bankDetails?.accountName || "",
        accountNumber: user?.payout?.bankDetails?.accountNumber || "",
        routingNumber: user?.payout?.bankDetails?.routingNumber || "",
        swiftCode: user?.payout?.bankDetails?.swiftCode || "",
        bankAddress: user?.payout?.bankDetails?.bankAddress || "",
        bankCity: user?.payout?.bankDetails?.bankCity || "",
        bankState: user?.payout?.bankDetails?.bankState || "",
        bankZip: user?.payout?.bankDetails?.bankZip || "",
        bankCountry: user?.payout?.bankDetails?.bankCountry || "",
        isFiat: user?.payout?.bankDetails?.isFiat || false,
        fiatCurrency: user?.payout?.bankDetails?.fiatCurrency || "",
        iban: user?.payout?.bankDetails?.iban || "",
      },
    },

  });

  const handleSubmit = () => {
    dispatch(updateReferralData({ id: user?.userId, data: userProfile }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Referral updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Error updating referral",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }
  

  
  return (
    <div>
      <div className="space-y-12">
        <div className="pb-12 border-b border-gray-900/10">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={userProfile.firstName}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, firstName: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={userProfile.lastName}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, lastName: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, email: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, phone: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  value={userProfile.country}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, country: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="IT">Italy</option>
                  <option value="JP">Japan</option>
                  <option value="US">United States</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={userProfile.address}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, address: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={userProfile.city}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, city: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={userProfile.state}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, state: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="zip"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  value={userProfile.zip}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, zip: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pb-12 border-b border-gray-900/10">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Payout Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide your payout details.
          </p>

          <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="payoutType"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Payout Type
              </label>
              <div className="mt-2">
                <select
                  name="type"
                  id="type"
                  value={userProfile.payout.payoutType}
                  onChange={(e) => {
                    const newPayoutType = e.target.value;
                    let newPayoutDetails = { ...userProfile.payout };
                    if (newPayoutType !== "FIAT") {
                      newPayoutDetails = { ...newPayoutDetails, bankDetails: {} };
                    }
                    setUserProfile({ ...userProfile, payout: { ...newPayoutDetails, payoutType: newPayoutType } });
                  }}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-1"
                >
                  <option value="FIAT">FIAT</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Paypal">Paypal</option>
                </select>
              </div>
            </div>

            {userProfile.payout.payoutType === "FIAT" && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="bankName"
                    id="bankName"
                    value={userProfile.payout.bankDetails.bankName}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, bankName: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Account Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="accountName"
                    id="accountName"
                    value={userProfile.payout.bankDetails.accountName}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, accountName: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Account Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="accountNumber"
                    id="accountNumber"
                    value={userProfile.payout.bankDetails.accountNumber}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, accountNumber: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="routingNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Routing Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="routingNumber"
                    id="routingNumber"
                    value={userProfile.payout.bankDetails.routingNumber}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, routingNumber: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="swiftCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Swift Code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="swiftCode"
                    id="swiftCode"
                    value={userProfile.payout.bankDetails.swiftCode}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, swiftCode: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="bankAddress"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="bankAddress"
                    id="bankAddress"
                    value={userProfile.payout.bankDetails.bankAddress}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, bankAddress: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="bankCity"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="bankCity"
                    id="bankCity"
                    value={userProfile.payout.bankDetails.bankCity}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, bankCity: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="bankState"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank State
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="bankState"
                    id="bankState"
                    value={userProfile.payout.bankDetails.bankState}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, bankState: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="bankZip"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank ZIP
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="bankZip"
                    id="bankZip"
                    value={userProfile.payout.bankDetails.bankZip}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, bankZip: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="bank-country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank Country
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="bank-country"
                    id="bank-country"
                    value={userProfile.payout.bankDetails.bankCountry}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, bankCountry: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label
                  htmlFor="iban"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  IBAN
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="iban"
                    id="iban"
                    value={userProfile.payout.bankDetails.iban}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, bankDetails: { ...userProfile.payout.bankDetails, iban: e.target.value } } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
            {userProfile.payout.payoutType === "Wallet" && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="wallet-address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Wallet Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="walletAddress"
                    id="walletAddress"
                    value={userProfile.payout.walletAddress}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, walletAddress: e.target.value } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
            {userProfile.payout.payoutType === "Paypal" && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="paypal-id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Paypal ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="paypalId"
                    id="paypalId"
                    value={userProfile.payout.paypalId}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, payout: { ...userProfile.payout, paypalId: e.target.value } })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-6 gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
