import {useDispatch} from 'react-redux'
import {acceptReferrer} from '../../slices/referral'
import {useToast} from '@chakra-ui/react'

export default function ReferralApprovals({approvals}) {
  const toast = useToast()

  const dispatch = useDispatch()

  const now = new Date()

  const handleApproval = (userId, decision,email) => {
    dispatch(acceptReferrer({id: userId, decision: decision,approvedDate: now.toISOString().slice(0, 10), approvedBy: 'admin' ,email:email }))
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Referral approved successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        location.reload();
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Error approving referral",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }
  
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              User ID
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              First Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Last Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Approved
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Approved Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Approved By
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Approve
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {approvals?.map((a) => (
            <tr key={a?.userId}>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                {a?.userId}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {a?.firstName}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {a?.lastName}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {a?.email}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {a?.approved ? "Yes" : "No"}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {a?.approvedDate}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {a?.approvedBy}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                <button onClick={() => handleApproval(a?.id, true ,a?.email)} className="px-2 py-1 text-white rounded bg-green">Yes</button>
                <button onClick={() => handleApproval(a?.id, false, a?.email)} className="px-2 py-1 ml-2 text-white bg-red-500 rounded">No</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
