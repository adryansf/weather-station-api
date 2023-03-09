import bson from 'bson-objectid';
import { endOfDay, startOfDay } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../database';

interface Data {
  humidity: number;
  pressure: number;
  temperature: number;
  rain: number;
  solarRadiation: number;
  windVelocity: number;
  windDirection: number;
}

class DayController {
  async index(req: Request, res: Response, next: NextFunction) {
    const { machineId } = req.params;
    const { day = new Date() } = req.query;
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

      const reports = await prisma.report.findMany({
        where: {
          machineId,
          createdAt: {
            lte: endOfDay(new Date(String(day))),
            gte: startOfDay(new Date(String(day))),
          },
        },
        select: {
          humidity: true,
          pressure: true,
          temperature: true,
          rain: true,
          solarRadiation: true,
          windVelocity: true,
          windDirection: true,
        },
      });

      let data: Data = {
        humidity: 0.0,
        pressure: 0.0,
        temperature: 0.0,
        rain: 0.0,
        solarRadiation: 0.0,
        windVelocity: 0.0,
        windDirection: 0.0,
      };

      for (let report of reports) {
        for (let key of Object.keys(data)) {
          data[key as keyof Data] += report[key as keyof Data] || 0.0;
        }
      }

      for (let key of Object.keys(data)) {
        if (key === 'rain') continue;

        let reportsWithKey = 0;
        for (let report of reports) {
          if (
            report[key as keyof Data] != null &&
            report[key as keyof Data] != undefined
          )
            reportsWithKey++;
        }
        data[key as keyof Data] = data[key as keyof Data] / reportsWithKey;
      }

      return res.json(data);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}

export default new DayController();
