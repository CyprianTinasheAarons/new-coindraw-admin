import React, { useState } from "react";
import { Button, Modal } from "antd";

function ModalComponent(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={showModal}
      >
        {props.btnTitle}
      </button>
      <Modal
        title={props.modalTitle}
        open={isModalOpen}
        onOk={props.handleOk}
        okText={props.okText}
        okType={"ghost"}
        okButtonProps={{ className: "bg-green text-white" }}
        onCancel={handleCancel}
      >
        {props.children}
      </Modal>
    </>
  );
}

export default ModalComponent;
