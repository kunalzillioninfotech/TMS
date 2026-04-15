import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { createTask } from "../services/taskApi";
import { getUsers } from "../services/userApi";

const { TextArea } = Input;

const AddTaskModal = ({ open, onClose, refreshTasks }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: null,
    assigned_to: "",
    project_id: 1,
  });

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);
  
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.title) {
        return message.error("Title required");
      }

      setLoading(true);

      const payload = {
        ...form,
        due_date: dayjs(form.due_date).format("YYYY-MM-DD"),
      };

      await createTask(payload);

      message.success("Task created");

      refreshTasks();
      onClose();

    } catch (err) {
      message.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} 
    onCancel={onClose} 
    footer={null} 
    title="Add Task" 
    maskClosable={false} 
    keyboard={false} 
    centered
    >
      <div className="flex flex-col gap-5">

        <Input
          placeholder="Title"
          className="pt-2 pb-2"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <TextArea
          placeholder="Description"
          rows={3}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <Select
          defaultValue="medium"
          className="pt-2 pb-2"
          onChange={(val) =>
            setForm({ ...form, priority: val })
          }
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />

        <DatePicker
          style={{ width: "100%" }}
          className="pt-2 pb-2"
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
          onChange={(date) =>
            setForm({ ...form, due_date: date })
          }
        />

        <Select
          placeholder="Assign User"
          className="pt-2 pb-2"
          onChange={(val) =>
            setForm({ ...form, assigned_to: val })
          }
          options={users.map((user) => ({
            value: user.id,
            label: user.name,
          }))}
        />

        <Button
          className="bg-black text-white pt-5 pb-5"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Task
        </Button>
      </div>
    </Modal>
  );
};

export default AddTaskModal;