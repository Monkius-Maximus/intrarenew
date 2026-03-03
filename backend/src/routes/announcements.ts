import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(announcements);
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const ann = await prisma.announcement.findUnique({ where: { id: Number(req.params.id) } });
  if (!ann) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(ann);
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, message } = req.body;
  const ann = await prisma.announcement.create({ data: { title, message } });
  res.status(201).json(ann);
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, message } = req.body;
  const ann = await prisma.announcement.update({
    where: { id: Number(req.params.id) },
    data: { title, message },
  });
  res.json(ann);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.announcement.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
