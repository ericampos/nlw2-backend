import express from 'express';
import db from './database/connection';
import convertHourToMinutes from './utils/convertHourToMinute';

const routes = express.Router();

interface ScheduleItem {
  weekday: number;
  from: string;
  to: string;
}

routes.post('/classes', async (request, response) => {

  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = request.body;

  const tran = await db.transaction();

  try {
    const insertedUserId = await tran('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
    });

    const user_id = insertedUserId[0];

    const insertedClassId = await tran('classes').insert({
      subject,
      cost,
      user_id,
    });

    const class_id = insertedClassId[0];

    const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
      return {
        class_id,
        weekday: scheduleItem.weekday,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
      };
    })

    await tran('class_schedule').insert(classSchedule);

    await tran.commit();
    return response.status(201).send();

  } catch (err) {

    await tran.rollback();

    return response.status(400).json({
      error: 'Erro não esperado ao tentar criar uma nova classe.'
    })
  }

});


export default routes;