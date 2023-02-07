import bson from 'bson-objectid';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../database';

interface CreateData {
  humidity?: number;
  pressure?: number;
  temperature?: number;
  rain?: number;
  solarRadiation?: number;
  windVelocity?: number;
  windDirection?: number;
  createdAt?: string;
  machineId: string;
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
          windVelocity: true,
          windDirection: true,
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
    if (Object.values(req.body || {}).length <= 0) return res.sendStatus(406);

    const attributes = [
      'humidity',
      'pressure',
      'temperature',
      'rain',
      'solarRadiation',
      'windVelocity',
      'windDirection',
      'createdAt',
    ];

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

      let unformattedData = !Object.keys(req.body).includes('multi')
        ? [req.body]
        : req.body.multi;
      let data: CreateData[] = [];

      for (let i of unformattedData) {
        let currentData: CreateData = { machineId };
        for (let attr of attributes) {
          switch (attr) {
            case 'createdAt':
              currentData = { ...currentData, [attr]: i[attr] };
              break;
            default:
              currentData = { ...currentData, [attr]: parseFloat(i[attr]) };
              break;
          }
        }
        data.push(currentData);
      }

      await prisma.report.createMany({
        data,
      });

      return res.sendStatus(201);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new ReportController();
