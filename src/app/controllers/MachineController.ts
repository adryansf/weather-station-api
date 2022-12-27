import bson from 'bson-objectid';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../database';

class MachineController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const machines = await prisma.machine.findMany();

      return res.json(machines);
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    try {
      const machine = await prisma.machine.create({
        data: {
          name,
        },
      });

      return res.json({ machine });
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { machineId } = req.params;

    if (!bson.isValid(machineId))
      return res.status(404).json({ error: 'Machine not found' });

    try {
      const machine = await prisma.machine.findUnique({
        where: {
          id: machineId,
        },
      });

      if (!machine)
        return res.status(404).json({ error: 'Machine not found.' });

      await prisma.machine.delete({
        where: {
          id: machineId,
        },
      });

      await prisma.report.deleteMany({
        where: {
          machineId,
        },
      });

      return res.sendStatus(202);
    } catch (err) {
      return res.sendStatus(500);
    }
  }
}

export default new MachineController();
