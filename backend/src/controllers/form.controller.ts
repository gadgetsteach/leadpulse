import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const createForm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const { title, description, metaTitle, metaDescription } = req.body;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!title) {
      res.status(400).json({ error: 'Form title is required' });
      return;
    }

    let slug = generateSlug(title);
    let slugExists = await prisma.form.findUnique({ where: { slug } });
    let count = 1;
    while (slugExists) {
      const newSlug = `${slug}-${count}`;
      slugExists = await prisma.form.findUnique({ where: { slug: newSlug } });
      if (!slugExists) {
        slug = newSlug;
      }
      count++;
    }

    const form = await prisma.form.create({
      data: {
        businessId,
        title,
        description,
        slug,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
      },
    });

    res.status(201).json(form);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error creating form' });
  }
};

export const getForms = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const forms = await prisma.form.findMany({
      where: { businessId },
      include: {
        _count: {
          select: { leads: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(forms);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching forms' });
  }
};

export const getFormById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const id = req.params.id as string;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const form = await prisma.form.findFirst({
      where: { id, businessId },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    res.status(200).json(form);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching form' });
  }
};

export const updateForm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const id = req.params.id as string;
    const { title, description, isActive, metaTitle, metaDescription, questions, whatsappNumber, whatsappEnabled } = req.body;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingForm = await prisma.form.findFirst({ where: { id, businessId } });
    if (!existingForm) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    await prisma.form.update({
      where: { id },
      data: {
        title,
        description,
        isActive,
        metaTitle,
        metaDescription,
        whatsappNumber,
        whatsappEnabled,
      },
    });

    if (questions && Array.isArray(questions)) {
      const currentQuestionsInDb = await prisma.formQuestion.findMany({
        where: { formId: id },
        select: { id: true },
      });
      const dbQuestionIds = currentQuestionsInDb.map((q: { id: string }) => q.id);

      const incomingQuestionIds = questions
        .map((q: any) => q.id)
        .filter((qid: any) => qid && typeof qid === 'string');

      const idsToDelete = dbQuestionIds.filter((qid: string) => !incomingQuestionIds.includes(qid));
      if (idsToDelete.length > 0) {
        await prisma.formQuestion.deleteMany({
          where: {
            id: { in: idsToDelete },
          },
        });
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionData = {
          questionText: q.questionText,
          questionType: q.questionType,
          isRequired: q.isRequired || false,
          sortOrder: i,
          options: q.options || null,
        };

        if (q.id && dbQuestionIds.includes(q.id)) {
          await prisma.formQuestion.update({
            where: { id: q.id },
            data: questionData,
          });
        } else {
          await prisma.formQuestion.create({
            data: {
              ...questionData,
              formId: id,
            },
          });
        }
      }
    }

    const updatedForm = await prisma.form.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    res.status(200).json(updatedForm);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error updating form' });
  }
};

export const deleteForm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const id = req.params.id as string;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const form = await prisma.form.findFirst({ where: { id, businessId } });
    if (!form) {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    await prisma.form.delete({ where: { id } });

    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error deleting form' });
  }
};

export const getPublicFormBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const form = await prisma.form.findUnique({
      where: { slug },
      include: {
        business: {
          select: {
            name: true,
            slug: true,
            description: true,
            logoUrl: true,
          },
        },
        questions: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!form || !form.isActive) {
      res.status(404).json({ error: 'Form not found or inactive' });
      return;
    }

    res.status(200).json(form);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching public form' });
  }
};
