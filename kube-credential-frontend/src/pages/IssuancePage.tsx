import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  FormControl,
  Spinner,
  Toast,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const IssuancePage: React.FC = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    credentialType: "",
    credentialUserName: "",
    credentialName: "",
    issued_by: "pod-1",
    status: "issued",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [credentials, setCredentials] = useState([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [errorCredentials, setErrorCredentials] = useState("");

  const initialFormData = {
    user_id: "",
    credentialType: "",
    credentialUserName: "",
    credentialName: "",
    issued_by: "pod-1",
    status: "issued",
  };

  const handleShow = () => {
    setFormData(initialFormData);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.user_id.trim()) newErrors.user_id = "User ID is required";
    if (!formData.credentialType.trim())
      newErrors.credentialType = "Type is required";
    if (!formData.credentialName.trim())
      newErrors.credentialName = "Name is required";
    if (!formData.credentialUserName.trim())
      newErrors.credentialUserName = "User Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const labelMap: { [key: string]: string } = {
    certificate: "Certificate Name",
    diploma: "Diploma Name",
    badge: "Badge Name",
  };

  const placeholderMap: { [key: string]: string } = {
    certificate: "Enter certificate name",
    diploma: "Enter diploma name",
    badge: "Enter badge name",
  };

  const label = labelMap[formData.credentialType] || "Name";
  const placeholder = placeholderMap[formData.credentialType] || "Enter name";

  const formatDate = (isoDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(isoDate).toLocaleString('en-GB', options);
  };
  

  const fetchCredentials = async () => {
    setLoadingCredentials(true);
    try {
      const res = await fetch('http://localhost:3000/api/credentials');
      console.log('RES -> ',res)
      if (res.ok) {
        const data = await res.json();
        setCredentials(data);
      }
    } catch (error) {
      setErrorCredentials('Error loading credentials');
    } finally {
      setLoadingCredentials(false);
    }
  };
  
  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setShowToast(false);
  
    const payload = {
      user_id: formData.user_id,
      credential: {
        type: formData.credentialType,
        name: formData.credentialName,
        userName: formData.credentialUserName,
      },
      issued_by: formData.issued_by,
      status: formData.status,
    };
  
    try {
      const response = await fetch(
        "http://localhost:3000/api/credentials/issue",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setToastVariant("success");
        setToastMessage(data.message);
        setShowToast(true);
        handleClose();
        fetchCredentials();
      } else if (response.status === 409) {
        const data = await response.json();
        setToastVariant("danger");
        setToastMessage(data.message || "Credential already issued");
        setShowToast(true);
      } else {
        setToastVariant("danger");
        setToastMessage("Failed to issue credential");
        setShowToast(true);
      }
    } catch (err) {
      setToastVariant("danger");
      setToastMessage("Network error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand h1 mx-auto">Kube Credential</span>
        </div>
      </nav>

      <div className="container d-flex justify-content-end mt-4">
  <Button variant="primary" size="lg" onClick={handleShow}>
    + Issuance
  </Button>
  <Link to="/verify" className="btn btn-secondary btn-lg ms-3">
    Verification Page
  </Link>
</div>


      <div className="container-fluid my-4 px-2">
  {loadingCredentials ? (
    <p>Loading credentials...</p>
  ) : errorCredentials ? (
    <p>{errorCredentials}</p>
  ) : credentials.length === 0 ? (
    <p>No credentials issued yet.</p>
  ) : (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
        <th>Sr. No</th>
        <th>Worker ID</th>
          <th>Worker</th>
          <th>Type</th>
          <th>Name</th>
          <th>Issued Date</th>
          <th>Issued By</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {credentials.map((credential: any,index) => (
          <tr key={credential.id || credential.user_id}>
            <td>{index+1}</td>
            <td>{credential.user_id}</td>
            <td>{credential.credential?.userName}</td>
            <td>{credential.credential?.type}</td>
            <td>{credential.credential?.name}</td>
            <td>{formatDate(credential.issued_at)}</td>
            <td>{credential.issued_by}</td>
            <td>{credential.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
</div>


      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Issuance Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="userId">
              <Form.Label>User ID *</Form.Label>
              <Form.Control
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                isInvalid={!!errors.user_id}
                placeholder="Enter User ID"
              />
              <Form.Control.Feedback type="invalid">
                {errors.user_id}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formCredentialUserName" className="mb-3">
              <Form.Label>Worker Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                name="credentialUserName"
                value={formData.credentialUserName}
                onChange={handleChange}
                isInvalid={!!errors.credentialUserName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.credentialUserName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formCredentialType" className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                name="credentialType"
                value={formData.credentialType}
                onChange={handleChange}
                isInvalid={!!errors.credentialType}
              >
                <option value="">-- Select Type --</option>
                <option value="certificate">Certificate</option>
                <option value="diploma">Diploma</option>
                <option value="badge">Badge</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.credentialType}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Label>{label} *</Form.Label>
            <Form.Control
              type="text"
              placeholder={placeholder}
              name="credentialName"
              value={formData.credentialName}
              onChange={handleChange}
              isInvalid={!!errors.credentialName}
            />

            <Form.Group className="mb-3" controlId="issuedBy">
              <Form.Label>Issued By</Form.Label>
              <Form.Control
                type="text"
                name="issued_by"
                value={formData.issued_by}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for showing messages */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        className={`bg-${toastVariant} text-white`}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          minWidth: "250px",
          zIndex: 1050,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default IssuancePage;
