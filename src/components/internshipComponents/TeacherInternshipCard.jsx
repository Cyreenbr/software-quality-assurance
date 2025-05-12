import { Button, DatePicker, Form, Input, message, Modal, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaEye,
  FaFileAlt,
  FaFolderOpen,
  FaUserTie,
  FaVideo
} from "react-icons/fa";

const getDocName = (doc) => {
  if (!doc) return "unknown";
  if (typeof doc === "string") return doc;
  if (typeof doc.name === "string") return doc.name;
  return Object.keys(doc)
    .filter((key) => !isNaN(key))
    .sort((a, b) => a - b)
    .map((key) => doc[key])
    .join("");
};

const TeacherInternshipCard = ({ internship, onScheduleUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const isValidDate = internship.defenseDate && !isNaN(new Date(internship.defenseDate));
  const isUpdate = isValidDate;


  const internshipId = internship.id || internship._id;

  if (!internshipId) {
    console.error("Missing internship ID:", internship);
  }

  const showModal = () => {
    form.setFieldsValue({
      date: internship.defenseDate ? dayjs(internship.defenseDate) : null,
      time: internship.defenseTime ? dayjs(internship.defenseTime, "HH:mm") : null,
      googleMeetLink: internship.googleMeetLink || "",
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const defenseData = {
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
        googleMeetLink: values.googleMeetLink,
      };

      messageApi.loading(`${isUpdate ? 'Updating' : 'Scheduling'} defense...`);

      const success = await onScheduleUpdate(internshipId, defenseData);
      
      if (success) {
        setIsModalVisible(false);
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      
      console.error("Error scheduling defense:", error);
      messageApi.error(error.message || "Failed to schedule defense");
    } finally {
      setLoading(false);
    }
  };

  // do we have studentId object !!
  const studentName = typeof internship.studentId === 'object' ? 
    internship.studentId?.name || "Unknown Student" : 
    "Unknown Student";
  
  const studentEmail = typeof internship.studentId === 'object' ? 
    internship.studentId?.email || "No email available" : 
    "No email available";

  return (
    <>
      {contextHolder} {/* Ant Design message provider */}
      <div className="border border-gray-300 p-6 shadow-sm rounded-lg hover:shadow-xl duration-300 hover:bg-gradient-to-r from-blue-50 to-purple-100 max-w-5xl w-full mx-auto">
        <table className="min-w-full table-auto">
          <tbody>
            {/* Student Info */}
            <tr className="mb-4">
              <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-3">
                <FaUserTie className="text-blue-600" />
                <span className="text-lg font-bold">{studentName}</span>
              </td>
              <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
                <FaEnvelope className="text-gray-500" />
                <span className="font-bold">Email:</span> {studentEmail}
              </td>
            </tr>

            {/* Internship Title */}
            <tr className="mb-4">
              <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
                <FaFileAlt className="text-blue-500" />
                <span className="font-bold">Title:</span> {internship.title || "No Title"}
              </td>
            </tr>

            {/* PV */}
            <tr className="mb-4">
              <td className="px-4 py-3 text-gray-600 flex items-center gap-3">
                <FaFileAlt className="text-gray-500" />
                <span className="font-bold">PV:</span> {internship.pv || "No PV available"}
              </td>
            </tr>

            {/* Defense Schedule */}
            {internship.defenseDate && (
              <tr className="mb-4">
                <td colSpan="2" className="px-4 py-3 text-gray-600 flex items-center gap-3">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="font-bold">Defense Date:</span> {new Date(internship.defenseDate).toLocaleDateString()|| "No Date"}
                </td>
              </tr>
            )}

            {internship.defenseTime && (
              <tr className="mb-4">
                <td colSpan="2" className="px-4 py-3 text-gray-600 flex items-center gap-3">
                  <FaClock className="text-orange-500" />
                  <span className="font-bold">Defense Time:</span> {internship.defenseTime || "No Time"}
                </td>
              </tr>
            )}

            {internship.googleMeetLink && (
              <tr className="mb-4">
                <td colSpan="2" className="px-4 py-3 text-gray-600 flex items-start gap-3">
                  <FaVideo className="text-red-500" />
                  <span className="font-bold">Meeting Link:</span>
                  <a href={internship.googleMeetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                  {internship.googleMeetLink}
                  </a>
                </td>
              </tr>
            )}

            {/* Documents */}
            <tr className="mb-4">
              <td className="px-4 py-3 text-gray-600 flex items-start gap-3">
                <FaFolderOpen className="text-gray-500 mt-1" size={20} />
                <div>
                  <span className="font-bold">Documents:</span>
                  {internship.documents && internship.documents.length > 0 ? (
                    <div className="space-y-4 mt-2">
                      {internship.documents.map((doc, index) => {
                        const fileName = getDocName(doc);
                        const fileURL = `http://localhost:3000/uploads/${fileName}`;

                        return (
                          <div key={index}>
                            <div className="flex items-center gap-2">
                              <FaEye className="text-pink-500 text-xl" />
                              <span className="font-semibold">Consulter</span>
                              <a
                                href={fileURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={fileName}
                                className="text-blue-600 hover:underline ml-2"
                              >
                                {fileName}
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-2">No documents available</div>
                  )}
                </div>
              </td>
            </tr>

            {/* Schedule Button */}
            <tr className="mb-4">
              <td colSpan="2" className="px-4 py-3">
                <button
                  onClick={showModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                  {isUpdate ? "Update Defense" : "Schedule Defense"}

                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Schedule Modal */}
        <Modal
          title={isUpdate ? "Update Defense" : "Schedule Defense"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
              Submit
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="date"
              label={
                <div className="flex items-center gap-2 font-semibold">
                  <FaCalendarAlt className="text-blue-500" />
                  Defense Date
                </div>
              }
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="time"
              label={
                <div className="flex items-center gap-2 font-semibold">
                  <FaClock className="text-orange-500" />
                  Defense Time
                </div>
              }
              rules={[{ required: true, message: "Please select a time" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="googleMeetLink"
              label={
                <div className="flex items-center gap-2 font-semibold">
                  <FaVideo className="text-red-500" />
                  Link Google Meet
                </div>
              }
              rules={[
                { required: true, message: "Please enter the meeting link" },
                { type: "url", message: "Please enter a valid URL" }
              ]}
            >
              <Input placeholder="https://meet.google.com/xxx-yyyy-zzz" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default TeacherInternshipCard;