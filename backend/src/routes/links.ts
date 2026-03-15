import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const links = await prisma.link.findMany({ orderBy: { name: 'asc' } });
  res.json(links);
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const link = await prisma.link.findUnique({ where: { id: Number(req.params.id) } });
  if (!link) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(link);
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, url } = req.body;
  const link = await prisma.link.create({ data: { name, url } });
  res.status(201).json(link);
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, url } = req.body;
  const link = await prisma.link.update({ where: { id: Number(req.params.id) }, data: { name, url } });
  res.json(link);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.link.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
