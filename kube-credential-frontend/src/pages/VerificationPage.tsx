import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spinner, Toast } from "react-bootstrap";

type Credential = {
  id: number;
  user_id: string;
  credential: {
    type: string;
    name: string;
    userName: string;
  };
  issued_at: string;
  issued_by: string;
  status: string;
};

const VerificationPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalWorkerId, setModalWorkerId] = useState<string | null>(null);
  const [modalIssuedAt, setModalIssuedAt] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Fetch credentials list on mount
  useEffect(() => {
    const fetchCredentials = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3000/api/credentials");
        if (!res.ok) throw new Error("Failed to fetch credentials");
        const data = await res.json();
        setCredentials(data);
      } catch (e: any) {
        setError(e.message || "Error fetching credentials");
      } finally {
        setLoading(false);
      }
    };
    fetchCredentials();
  }, []);

  // Format date in user-friendly format
  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  // Handle verify button click for one credential row
  const handleVerify = async (credential: Credential) => {
    setLoadingVerify(true);
    setShowToast(false);

    try {
      const res = await fetch("http://localhost:4000/api/verification/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: {
            user_id: credential.user_id,
            type: credential.credential.type,
            name: credential.credential.name,
            userName: credential.credential.userName,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setModalMessage(
          `Credential verified: Worker ID ${
            data.worker_id
          }, Issued At ${formatDate(data.issued_at)}`
        );
        setModalWorkerId(data.worker_id);
        setModalIssuedAt(formatDate(data.issued_at));
        setToastMessage("Credential verified successfully");
        setToastVariant("success");
        setModalType("success");
      } else {
        const errData = await res.json();
        const rawErrMsg = errData.message || "Server error during verification";

        const userFriendlyMessage = rawErrMsg.includes(
          "Missing required credential fields"
        )
          ? "Verification failed: The credential data is incomplete or invalid."
          : rawErrMsg;

        setModalMessage(userFriendlyMessage);
        setToastMessage(userFriendlyMessage);
        setToastVariant("danger");
        setModalWorkerId(null);
        setModalIssuedAt(null);
        setModalType("error");
        setShowModal(true);
      }

      setShowToast(true);
      setShowModal(true);
    } catch {
      setToastMessage("Network error during verification");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <>
      <h2 className="text-center my-4">Credential Verification</h2>
      <div className="container-fluid mt-4">
        {loading ? (
          <p>Loading credentials...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : credentials.length === 0 ? (
          <p>No credentials issued yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Type</th>
                <th>Name</th>
                <th>User Name</th>
                <th>Issued By</th>
                <th>Status</th>
                <th>Issued At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((cred, idx) => (
                <tr key={cred.id}>
                  <td>{idx + 1}</td>
                  <td>{cred.credential.type}</td>
                  <td>{cred.credential.name}</td>
                  <td>{cred.credential.userName}</td>
                  <td>{cred.issued_by}</td>
                  <td>{cred.status}</td>
                  <td>{formatDate(cred.issued_at)}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleVerify(cred)}
                      disabled={loadingVerify}
                    >
                      {loadingVerify ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Verification result modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          className={
            modalType === "error"
              ? "bg-danger text-white"
              : "bg-success text-white"
          }
        >
          <Modal.Title>
            {modalType === "error"
              ? "Verification Error"
              : "Verification Result"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {modalType === "success" ? (
            <>
              <div className="text-success fs-1 mb-3 animate-bounce">✅</div>
              <div>
                <strong>Worker ID:</strong> {modalWorkerId}
              </div>
              <div>
                <strong>Issued At:</strong> {modalIssuedAt}
              </div>
            </>
          ) : (
            <>
              <div className="text-danger fs-1 mb-3 animate-pulse">❌</div>
              <p className="text-danger fs-4">{modalMessage}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalType === "error" ? "danger" : "secondary"}
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className={`bg-${toastVariant} text-white`}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          minWidth: 250,
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

export default VerificationPage;
