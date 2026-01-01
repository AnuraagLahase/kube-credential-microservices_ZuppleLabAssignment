import express, { Request, Response } from "express";

const router = express.Router();
const issuedCredentials: Record<string, any> = {};

router.post("/issue", (req: Request, res: Response) => {
  const { user_id, credential } = req.body;
  if (!user_id || !credential)
    return res.status(400).json({ message: "Missing user_id or credential" });
  if (issuedCredentials[user_id])
    return res.status(409).json({ message: "Credential already issued" });

  const id = Math.floor(Math.random() * 1000000);
  issuedCredentials[user_id] = { ...credential, id };
  res.status(201).json({ message: `Credential issued for ${user_id}`, id });
});

router.get("/", (req: Request, res: Response) =>
  res.json(Object.values(issuedCredentials))
);
router.get("/:id", (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (!idParam) return res.status(400).json({ message: "ID is required" });
  const id = parseInt(idParam);
  const credential = Object.values(issuedCredentials).find(
    (c) => c.id === id
  );
  if (!credential) return res.status(404).json({ message: "Not found" });
  res.json(credential);
});

export default router;
