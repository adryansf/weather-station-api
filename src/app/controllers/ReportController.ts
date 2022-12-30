import bson from 'bson-objectid';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../database';

interface CreateData {
  humidity?: number;
  pressure?: number;
  temperature?: number;
  rain?: number;
  solarRadiation?: number;
}

class ReportController {
  async index(req: Request, res: Response, next: NextFunction) {
    let { page = 1 } = req.query;
    const { machineId } = req.params;
    const reportsPerPage = 15;
    page = Number(page);

    try {
      if (!bson.isValid(machineId))
        return res.status(404).json({ error: 'Machine not found' });

      const machine = await prisma.machine.findUnique({
        where: {
          id: machineId,
        },
      });

      if (!machine)
        return res.status(404).json({ error: 'Machine not found.' });

      const count = await prisma.report.count({ where: { machineId } });

      const reports = await prisma.report.findMany({
        where: {
          machineId,
        },
        skip: reportsPerPage * (page - 1),
        take: reportsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          humidity: true,
          pressure: true,
          temperature: true,
          rain: true,
          solarRadiation: true,
          createdAt: true,
        },
      });

      return res.json({
        reports,
        page,
        reportsInPage: reports.length,
        totalReports: count,
        totalPages: Math.ceil(count / reportsPerPage),
      });
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const attributes = [
      'humidity',
      'pressure',
      'temperature',
      'rain',
      'solarRadiation',
    ];

    let data: CreateData = {};
    for (let attr of attributes) {
      if (req.body[attr])
        data = { ...data, [attr]: parseFloat(req.body[attr]) };
    }

    const { machineId } = req.params;

    try {
      if (!bson.isValid(machineId))
        return res.status(404).json({ error: 'Machine not found' });

      const machine = await prisma.machine.findUnique({
        where: {
          id: machineId,
        },
      });

      if (!machine)
        return res.status(404).json({ error: 'Machine not found.' });

      await prisma.report.create({
        data: {
          ...data,
          machineId,
        },
      });

      return res.sendStatus(201);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new ReportController();
