import { useDispatch } from "react-redux";
import {
  acceptNewCode,
  acceptPayout,
  acceptDateExtension,
} from "../../slices/referral";
import { useState, useEffect } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure, 
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text
} from "@chakra-ui/react";

export default function ReferralRequests({ data }) {
  const [startDate, setStartDate] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    setCombinedData(
      data.filter(
        (t) =>
          t?.requestPayout?.requested === true ||
          t?.requestNewCode?.requested === true ||
          t?.requestDateExtension?.requested === true
      )
    );
  }, [data]);

  const dispatch = useDispatch();
  const toast = useToast();

  const handleAcceptNewCode = async (user, decision) => {
    const data = {
      userEmail: user?.email,
      decision,
      userId: user?.id,
    }
    try {
     await dispatch(acceptNewCode(data)).unwrap();
      toast({
        title: "Success",
        description: "New code request accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept new code request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAcceptPayout = async (user, decision) => {
    const data = {
      userEmail: user?.email,
      decision,
      userId: user?.id,
    }
    try {
      await dispatch(acceptPayout(data)).unwrap();
      toast({
        title: "Success",
        description: "Payout request accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
        location.reload();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to accept payout request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleAcceptDateExtension = async (user, decision, date) => {
    const data = {
      userEmail: user?.email,
      decision,
      userId: user?.id,
      date
    }

    try {
      await dispatch(acceptDateExtension(data)).unwrap();
      toast({
        title: "Success",
        description: "Date extension request accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
     location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept date extension request",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  
  return (
    <div>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Request Payout</Th>
            <Th>Request New Code</Th>
            <Th>Request Date Extension</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {combinedData?.map((t) => (
            <Tr key={t?.id}>
              <Td>{t?.email}</Td>
              <Td>
                <Text textAlign="left">
                  {t?.requestPayout?.requested ? "Requested" : ""}
                </Text>
                {t?.requestPayout?.requested ? (
                  <>
                    {" "}
                    <Button
                      colorScheme="blue"
                      onClick={() => handleAcceptPayout(t, true)}
                      className="mb-1 mr-2"
                    >
                      Accept
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleAcceptPayout(t, false)}
                    >
                      Decline
                    </Button>
                  </>
                ): "-"}
              </Td>
              <Td>
                <Text textAlign="left">
                  {t?.requestNewCode?.requested ? "Requested" : ""}
                </Text>
                   {t?.requestNewCode?.requested ? <>
                    <Button
                  colorScheme="blue"
                  onClick={() => handleAcceptNewCode(t, true)}
                  className="mr-2"
                >
                  Accept
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleAcceptNewCode(t, false)}
                >
                  Decline
                </Button></>
                : "-"} 
              </Td>
              <Td>
                <Text textAlign="left">
                  {t?.requestDateExtension?.requested
                    ? "Requested"
                    : ""}
                </Text>
                {t?.requestDateExtension?.requested ?<> <Button
                  colorScheme="blue"
                  onClick={() => {
                    onOpen();
                    setSelected(t);
                  }}
                  className="mr-2"
                >
                  Accept
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleAcceptDateExtension(t, false)}
                >
                  Decline
                </Button>
                </> : "-"}
              </Td>
              <Td>{new Date(t?.updatedAt).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                className="w-full border rounded-md"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                handleAcceptDateExtension(selected, true, startDate)
              }
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
