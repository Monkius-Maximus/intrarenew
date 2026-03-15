import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { search } = req.query;
  const employees = await prisma.employee.findMany({
    where: search
      ? { name: { contains: String(search) } }
      : undefined,
    orderBy: { name: 'asc' },
  });
  res.json(employees);
});

router.get('/birthdays', async (_req: Request, res: Response): Promise<void> => {
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const employees = await prisma.employee.findMany({
    where: { birthday: { startsWith: month } },
    orderBy: { birthday: 'asc' },
  });
  res.json(employees);
});

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const employee = await prisma.employee.findUnique({ where: { id: Number(req.params.id) } });
  if (!employee) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(employee);
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, extension, sector, birthday } = req.body;
  const employee = await prisma.employee.create({ data: { name, email, extension, sector, birthday } });
  res.status(201).json(employee);
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, extension, sector, birthday } = req.body;
  const employee = await prisma.employee.update({
    where: { id: Number(req.params.id) },
    data: { name, email, extension, sector, birthday },
  });
  res.json(employee);
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.employee.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default router;
