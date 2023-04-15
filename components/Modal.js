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
      <Button type="primary" className="mb-5 bg-green" onClick={showModal}>
        {props.btnTitle}
      </Button>
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
