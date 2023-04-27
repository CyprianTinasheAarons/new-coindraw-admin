import { useState } from "react";
import { useToast, Spinner } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setPercentage } from "../../slices/referral";

const SetPercentage = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onSuccessSetPercentage = async () => {
    toast({
      title: "Set Percentage successful.",
      description: "We've successfully set the percentage.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    setValue("");
    setTimeout(() => {
      location.reload();
    }, 1000);
  };

  const onErrorSetPercentage = () =>
    toast({
      title: "Set Percentage failed.",
      description: "We've failed to set the percentage.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const onSubmit = async () => {
    setLoading(true);

    try {
      await dispatch(setPercentage({ referralPercentage: value })).unwrap();
      onSuccessSetPercentage();
      setLoading(false);
    } catch (error) {
      onErrorSetPercentage();
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col my-4">
        <label className="block text-sm font-medium text-gray-700">
          New Percentage
        </label>
        <input
          type="number"
          name="value"
          id="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-green focus:border-green sm:text-sm"
        />
      </div>
      <div className="flex flex-col my-4">
        <button
          type="button"
          onClick={onSubmit}
          className="flex items-center justify-center px-3 py-2 text-sm font-semibold text-center text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {loading ? <Spinner size="sm" /> : "Set Percentage"}
        </button>
      </div>
    </div>
  );
};

export default SetPercentage;
