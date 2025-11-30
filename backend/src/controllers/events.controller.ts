import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Event } from '../entities/Event';
import { AuthRequest } from '../middleware/auth.middleware';
import { body, validationResult, query } from 'express-validator';

export const getAllEvents = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const eventRepository = AppDataSource.getRepository(Event);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [events, total] = await eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.createdBy', 'createdBy')
        .orderBy('event.eventDate', 'ASC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      res.json({
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: { id: req.params.id },
      relations: ['createdBy'],
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error('Get event by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEvent = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('eventDate').isISO8601(),
  body('location').optional().trim(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const { title, description, eventDate, location, imageUrl } = req.body;

      const eventRepository = AppDataSource.getRepository(Event);
      const event = eventRepository.create({
        title,
        description,
        eventDate: new Date(eventDate),
        location,
        imageUrl,
        createdById: req.user.id,
      });

      await eventRepository.save(event);

      const savedEvent = await eventRepository.findOne({
        where: { id: event.id },
        relations: ['createdBy'],
      });

      res.status(201).json(savedEvent);
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const updateEvent = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('eventDate').optional().isISO8601(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const eventRepository = AppDataSource.getRepository(Event);
      const event = await eventRepository.findOne({
        where: { id: req.params.id },
      });

      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }

      if (
        event.createdById !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        res.status(403).json({ message: 'Permission denied' });
        return;
      }

      const { title, description, eventDate, location, imageUrl } = req.body;

      if (title) event.title = title;
      if (description) event.description = description;
      if (eventDate) event.eventDate = new Date(eventDate);
      if (location !== undefined) event.location = location;
      if (imageUrl !== undefined) event.imageUrl = imageUrl;

      await eventRepository.save(event);

      const updatedEvent = await eventRepository.findOne({
        where: { id: event.id },
        relations: ['createdBy'],
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const eventRepository = AppDataSource.getRepository(Event);
    const event = await eventRepository.findOne({
      where: { id: req.params.id },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdById !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    await eventRepository.remove(event);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

