import { Request, Response } from 'express';
import * as credentialModel from '../models/credentialModel';

export async function issueCredential(req: Request, res: Response) {
  try {
    // Prepare object containing user_id and nested credential fields for duplicate check
    const credentialCheck = {
      user_id: req.body.user_id
    };
    const existingCredential = await credentialModel.findCredentialByFields(credentialCheck);
    
    
    if (existingCredential) {
      return res.status(409).json({ message: 'Credential already issued' });
    }

    // No duplicate found, create new credential
    const id = await credentialModel.createCredential(req.body);

    return res.status(201).json({ message: `Credential issued by ${req.body.issued_by}`, id });
  } catch (error) {
    return res.status(500).json({ message: 'Error issuing credential', error });
  }
}


export async function getAllCredentials(req: Request, res: Response) {
  try {
    const credentials = await credentialModel.getAllCredentials();
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credentials', error });
  }
}

export async function lookupCredential(req: Request, res: Response) {
  try {
    const credentialFields = req.body;

    // Strict validation of required fields
    if (
      !credentialFields ||
      !credentialFields.user_id ||
      !credentialFields.type ||
      !credentialFields.name ||
      !credentialFields.userName
    ) {
      return res.status(400).json({ message: "Missing required credential fields: user_id, type, name, userName" });
    }

    // Query DB using all required fields
    const credential = await credentialModel.findCredentialByFields(credentialFields);

    if (!credential) {
      return res.status(404).json({ message: "Credential not found" });
    }

    return res.json(credential);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error looking up credential", error: error.message });
    }
    return res.status(500).json({ message: "Error looking up credential" });
  }
}


export async function getCredential(req: Request, res: Response) {
  try {
    // const id = parseInt(req.params.id);
    const idParam = req.params.id;

if (!idParam) {
  res.status(400).json({ message: 'Missing id parameter' });
  return;
}
const id = parseInt(idParam, 10);

    const credential = await credentialModel.getCredentialById(id);
    if (!credential) {
      res.status(404).json({ message: 'Credential not found' });
      return;
    }
    res.json(credential);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credential', error });
  }
}
