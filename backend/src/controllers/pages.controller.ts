import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Page } from '../entities/Page';
import { AuthRequest } from '../middleware/auth.middleware';
import { body, validationResult } from 'express-validator';

export const getAllPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageRepository = AppDataSource.getRepository(Page);
    const pages = await pageRepository.find({
      order: { createdAt: 'DESC' },
    });

    res.json(pages);
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPageBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pageRepository = AppDataSource.getRepository(Page);
    const page = await pageRepository.findOne({
      where: { slug: req.params.slug },
    });

    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    res.json(page);
  } catch (error) {
    console.error('Get page by slug error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPage = [
  body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/),
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'lecturer')) {
        res.status(403).json({ message: 'Permission denied' });
        return;
      }

      const { slug, title, content, metaDescription } = req.body;

      const pageRepository = AppDataSource.getRepository(Page);

      const existingPage = await pageRepository.findOne({ where: { slug } });
      if (existingPage) {
        res.status(400).json({ message: 'Page with this slug already exists' });
        return;
      }

      const page = pageRepository.create({
        slug,
        title,
        content,
        metaDescription,
      });

      await pageRepository.save(page);

      res.status(201).json(page);
    } catch (error) {
      console.error('Create page error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const updatePage = [
  body('title').optional().trim().notEmpty(),
  body('content').optional().trim().notEmpty(),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'lecturer')) {
        res.status(403).json({ message: 'Permission denied' });
        return;
      }

      const pageRepository = AppDataSource.getRepository(Page);
      const page = await pageRepository.findOne({
        where: { id: req.params.id },
      });

      if (!page) {
        res.status(404).json({ message: 'Page not found' });
        return;
      }

      const { title, content, metaDescription } = req.body;

      if (title) page.title = title;
      if (content) page.content = content;
      if (metaDescription !== undefined) page.metaDescription = metaDescription;

      await pageRepository.save(page);

      res.json(page);
    } catch (error) {
      console.error('Update page error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const deletePage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const pageRepository = AppDataSource.getRepository(Page);
    const page = await pageRepository.findOne({
      where: { id: req.params.id },
    });

    if (!page) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    await pageRepository.remove(page);

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

