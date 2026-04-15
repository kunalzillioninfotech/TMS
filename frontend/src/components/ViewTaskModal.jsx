import React from "react";
import { Modal, Tag } from "antd";
import dayjs from "dayjs";

const ViewTaskModal = ({ open, onClose, task }) => {
  if (!task) return null;

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "red";
      case "medium":
        return "gold";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Task Details"
      centered
    >
      <div className="flex flex-col gap-4 dark:text-white">

        <div className="flex gap-1">
          <strong>Title:</strong>
          <p>{task.title}</p>
        </div>

        <div className="flex gap-1">
          <strong>Description:</strong>
          <p>{task.description || "No description"}</p>
        </div>

        <div >
          <strong>Priority:</strong>{" "}
          <Tag color={getPriorityColor()}>
            {task.priority}
          </Tag>
        </div>

        <div className="flex gap-1">
          <strong>Status:</strong>
          <p>{task.status}</p>
        </div>

        <div className="flex gap-1">
          <strong>Due Date:</strong>
          <p>
            {task.due_date
              ? dayjs(task.due_date).format("DD MMM YYYY")
              : "N/A"}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTaskModal;