import { Request, Response } from "express";
import axios from "axios";

const ISSUANCE_SERVICE_URL = process.env.ISSUANCE_SERVICE_URL || "http://localhost:3000";

export async function checkCredential(req: Request, res: Response) {
  try {
    if (!req.body || !req.body.credential) {
      return res.status(400).json({ message: "Missing credential data" });
    }

    const credentialToCheck = req.body.credential;

    // HTTP POST request to issuance microservice
    const response = await axios.post(`${ISSUANCE_SERVICE_URL}/api/credentials/lookup`, credentialToCheck);
    const credential = response.data;

    if (!credential) {
      return res.status(404).json({ message: "Credential not found or invalid" });
    }

    return res.json({
      worker_id: credential.user_id,
      issued_at: credential.issued_at,
    });
  } catch (error: any) {
    if (error.response) { // error from axios HTTP request
      if (error.response.status === 400) {
        return res.status(400).json({ message: error.response.data.message || "Bad Request" });
      }
      if (error.response.status === 404) {
        return res.status(404).json({ message: error.response.data.message || "Credential not found" });
      }
    }
    // generic server error if none of above match
    return res.status(500).json({ message: "Error verifying credential", error: error.message });
  }
}
