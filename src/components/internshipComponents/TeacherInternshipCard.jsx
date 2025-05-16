import { Button, DatePicker, Form, Input, message, Modal, Radio, TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaEnvelope,
  FaEye,
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

const statusColors = {
  pending: "bg-blue-100 text-blue-800",
  validated: "bg-green-100 text-green-800",
  default: "bg-red-100 text-red-800"
};

const TeacherInternshipCard = ({ internship, onScheduleUpdate, onEvaluate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEvaluationModalVisible, setIsEvaluationModalVisible] = useState(false);
  const [evaluationForm] = Form.useForm();
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showDetails, setShowDetails] = useState(false);
  const isValidDate = internship.defenseDate && !isNaN(new Date(internship.defenseDate));
  const isUpdate = isValidDate;

  const internshipId = internship.id || internship._id;

  if (!internshipId) {
    console.error("Missing internship ID:", internship);
  }

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase();
    return statusColors[lowerStatus] || statusColors.default;
  };

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

  const handleEvaluationSubmit = async () => {
    try {
      setEvaluationLoading(true);
      const values = await evaluationForm.validateFields();
      
      messageApi.loading('Submitting evaluation...');

      const success = await onEvaluate(internshipId, {
        validated: values.validated,
        reason: values.validated ? '' : values.reason
      });
      
      if (success) {
        setIsEvaluationModalVisible(false);
        evaluationForm.resetFields();
      }
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      console.error("Error evaluating internship:", error);
      messageApi.error(error.message || "Failed to submit evaluation");
    } finally {
      setEvaluationLoading(false);
    }
  };

  const studentName = typeof internship.studentId === 'object' ? 
    internship.studentId?.name || "Unknown Student" : 
    "Unknown Student";
  
  const studentEmail = typeof internship.studentId === 'object' ? 
    internship.studentId?.email || "No email available" : 
    "No email available";

  return (
    <>
      {contextHolder}
      <div className="border border-gray-100 p-6 shadow-sm rounded-lg  hover:shadow-xl hover:bg-gradient-to-r from-blue-50 to-purple-100 duration-300 max-w-5xl w-full mx-auto mb-4">
        {/* Summary View */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-blue-600">
              <FaUserTie size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{studentName}</h3>
              <p className="text-gray-600">{internship.title || "No Title"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full ${getStatusColor(internship.status)}`}>
              {internship.status}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={showModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition duration-300 ease-in-out flex items-center gap-2 text-sm"
              >
                <FaCalendarAlt />
                {isUpdate ? "Update" : "Schedule"}
              </button>
              <button
                onClick={() => setIsEvaluationModalVisible(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition duration-300 ease-in-out flex items-center gap-2 text-sm"
              >
                <FaCheckCircle />
                Evaluate
              </button>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-lg transition duration-300 ease-in-out flex items-center gap-2 text-sm"
              >
                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
                Details
              </button>
            </div>
          </div>
        </div>

        {/* Detailed View */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="text-gray-500" />
                  <span className="font-bold">Email:</span> {studentEmail}
                </div>
                
                {internship.defenseDate && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaCalendarAlt className="text-green-500" />
                    <span className="font-bold">Defense Date:</span> {new Date(internship.defenseDate).toLocaleDateString() || "No Date"}
                  </div>
                )}

                {internship.defenseTime && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaClock className="text-orange-500" />
                    <span className="font-bold">Defense Time:</span> {internship.defenseTime || "No Time"}
                  </div>
                )}
              </div>

              {/* Meeting Link */}
              {internship.googleMeetLink && (
                <div className="flex items-start gap-3 text-gray-600">
                  <FaVideo className="text-red-500 mt-1" />
                  <div>
                    <span className="font-bold">Meeting Link:</span>
                    <a 
                      href={internship.googleMeetLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline ml-2 break-all"
                    >
                      {internship.googleMeetLink}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <div className="flex items-center gap-3 text-gray-600 mb-3">
                <FaFolderOpen className="text-gray-500" />
                <span className="font-bold">Documents:</span>
              </div>
              
              {internship.documents && internship.documents.length > 0 ? (
                <div className="space-y-2 pl-8">
                  {internship.documents.map((doc, index) => {
                    const fileName = getDocName(doc);
                    const fileURL = `http://localhost:3000/uploads/${fileName}`;

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <FaEye className="text-pink-500" />
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={fileName}
                          className="text-blue-600 hover:underline"
                        >
                          {fileName}
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 pl-8">No documents available</div>
              )}
            </div>
          </div>
        )}

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
                  Google Meet Link
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

        {/* Evaluation Modal */}
        <Modal
          title="Evaluate Internship"
          open={isEvaluationModalVisible}
          onCancel={() => setIsEvaluationModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsEvaluationModalVisible(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={evaluationLoading} 
              onClick={handleEvaluationSubmit}
            >
              Submit Evaluation
            </Button>,
          ]}
        >
          <Form form={evaluationForm} layout="vertical">
            <Form.Item
              name="validated"
              label="Internship Validation"
              rules={[{ required: true, message: "Please select an option" }]}
            >
              <Radio.Group>
                <Radio value={true}>Validated</Radio>
                <Radio value={false}>Not Validated</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.validated !== currentValues.validated}
            >
              {({ getFieldValue }) => 
                getFieldValue('validated') === false ? (
                  <Form.Item
                    name="reason"
                    label="PV (Reason for rejection)"
                    rules={[{ required: true, message: "Please provide a reason for rejection" }]}
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder="Explain why the internship is not validated..." 
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default TeacherInternshipCard;