import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { News, NewsStatus } from '../entities/News';
import { AuthRequest } from '../middleware/auth.middleware';
import { body, validationResult, query } from 'express-validator';

export const getAllNews = [
  query('status').optional().isIn(['draft', 'published']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const newsRepository = AppDataSource.getRepository(News);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const status = req.query.status as string;

      const queryBuilder = newsRepository
        .createQueryBuilder('news')
        .leftJoinAndSelect('news.author', 'author')
        .orderBy('news.createdAt', 'DESC');

      if (status) {
        queryBuilder.where('news.status = :status', { status });
      } else if (!(req as AuthRequest).user) {
        queryBuilder.where('news.status = :status', {
          status: NewsStatus.PUBLISHED,
        });
      }

      const [news, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      res.json({
        news,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get news error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const getNewsById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newsRepository = AppDataSource.getRepository(News);
    const news = await newsRepository.findOne({
      where: { id: req.params.id },
      relations: ['author'],
    });

    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }

    if (
      news.status === NewsStatus.DRAFT &&
      !(req as AuthRequest).user?.role
    ) {
      res.status(404).json({ message: 'News not found' });
      return;
    }

    res.json(news);
  } catch (error) {
    console.error('Get news by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNews = [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  body('category').optional().trim(),
  body('status').optional().isIn(['draft', 'published']),
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

      const { title, content, category, status, imageUrl } = req.body;

      const newsRepository = AppDataSource.getRepository(News);
      const news = newsRepository.create({
        title,
        content,
        category,
        imageUrl,
        status: status || NewsStatus.DRAFT,
        authorId: req.user.id,
        publishDate:
          status === NewsStatus.PUBLISHED ? new Date() : null,
      });

      await newsRepository.save(news);

      const savedNews = await newsRepository.findOne({
        where: { id: news.id },
        relations: ['author'],
      });

      res.status(201).json(savedNews);
    } catch (error) {
      console.error('Create news error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const updateNews = [
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  body('status').optional().isIn(['draft', 'published']),
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

      const newsRepository = AppDataSource.getRepository(News);
      const news = await newsRepository.findOne({
        where: { id: req.params.id },
      });

      if (!news) {
        res.status(404).json({ message: 'News not found' });
        return;
      }

      if (news.authorId !== req.user.id && req.user.role !== 'admin') {
        res.status(403).json({ message: 'Permission denied' });
        return;
      }

      const { title, content, category, status, imageUrl } = req.body;

      if (title) news.title = title;
      if (content) news.content = content;
      if (category !== undefined) news.category = category;
      if (imageUrl !== undefined) news.imageUrl = imageUrl;
      if (status) {
        news.status = status;
        if (status === NewsStatus.PUBLISHED && !news.publishDate) {
          news.publishDate = new Date();
        }
      }

      await newsRepository.save(news);

      const updatedNews = await newsRepository.findOne({
        where: { id: news.id },
        relations: ['author'],
      });

      res.json(updatedNews);
    } catch (error) {
      console.error('Update news error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const deleteNews = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const newsRepository = AppDataSource.getRepository(News);
    const news = await newsRepository.findOne({
      where: { id: req.params.id },
    });

    if (!news) {
      res.status(404).json({ message: 'News not found' });
      return;
    }

    if (news.authorId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    await newsRepository.remove(news);

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



