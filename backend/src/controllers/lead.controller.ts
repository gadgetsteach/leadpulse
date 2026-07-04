import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const submitLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId, contact, answers } = req.body;

    if (!formId || !contact || !contact.name || !contact.email || !contact.phone) {
      res.status(400).json({ error: 'FormId and contact info (name, email, phone) are required' });
      return;
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form || !form.isActive) {
      res.status(404).json({ error: 'Form not found or inactive' });
      return;
    }

    const lead = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newLead = await tx.lead.create({
        data: {
          formId,
          businessId: form.businessId,
          status: 'new',
        },
      });

      await tx.leadContact.create({
        data: {
          leadId: newLead.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          notes: contact.notes || null,
        },
      });

      if (answers && Array.isArray(answers)) {
        for (const ans of answers) {
          if (ans.questionId && ans.value !== undefined) {
            const stringVal = typeof ans.value === 'object' ? JSON.stringify(ans.value) : String(ans.value);
            await tx.leadAnswer.create({
              data: {
                leadId: newLead.id,
                questionId: ans.questionId,
                value: stringVal,
              },
            });
          }
        }
      }

      return newLead;
    });

    res.status(201).json({ message: 'Lead submitted successfully', leadId: lead.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error submitting lead' });
  }
};

export const getLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const { formId, status } = req.query;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const whereClause: any = { businessId };
    if (formId) whereClause.formId = String(formId);
    if (status) whereClause.status = String(status);

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        form: {
          select: { title: true },
        },
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(leads);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching leads' });
  }
};

export const getLeadDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const id = req.params.id as string;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const lead = await prisma.lead.findFirst({
      where: { id, businessId },
      include: {
        form: {
          select: { title: true },
        },
        contact: true,
        answers: {
          include: {
            question: {
              select: { questionText: true, questionType: true },
            },
          },
        },
      },
    });

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    res.status(200).json(lead);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching lead details' });
  }
};

export const updateLeadStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    const id = req.params.id as string;
    const { status, notes } = req.body;

    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingLead = await prisma.lead.findFirst({ where: { id, businessId } });
    if (!existingLead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    const updatedLead = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.lead.update({
        where: { id },
        data: { status },
      });

      if (notes !== undefined) {
        await tx.leadContact.update({
          where: { leadId: id },
          data: { notes },
        });
      }

      return updated;
    });

    res.status(200).json(updatedLead);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error updating lead status' });
  }
};

export const getAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const businessId = req.businessId;
    if (!businessId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const totalLeads = await prisma.lead.count({ where: { businessId } });

    const statusCounts = await prisma.lead.groupBy({
      by: ['status'],
      where: { businessId },
      _count: { id: true },
    });

    const formCounts = await prisma.lead.groupBy({
      by: ['formId'],
      where: { businessId },
      _count: { id: true },
    });

    const forms = await prisma.form.findMany({
      where: { businessId },
      select: { id: true, title: true, slug: true },
    });

    const leadsByForm = formCounts.map((fc: { formId: string; _count: { id: number } }) => {
      const form = forms.find((f: { id: string; title: string; slug: string }) => f.id === fc.formId);
      return {
        formId: fc.formId,
        title: form?.title || 'Unknown Form',
        slug: form?.slug || '',
        count: fc._count.id,
      };
    });

    const wonCount = await prisma.lead.count({
      where: { businessId, status: 'won' },
    });
    const conversionRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;

    const recentLeads = await prisma.lead.findMany({
      where: { businessId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        form: { select: { title: true } },
        contact: true,
      },
    });

    res.status(200).json({
      totalLeads,
      statusCounts: statusCounts.reduce((acc: Record<string, number>, curr: { status: string; _count: { id: number } }) => {
        acc[curr.status] = curr._count.id;
        return acc;
      }, {}),
      leadsByForm,
      conversionRate,
      recentLeads,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching analytics' });
  }
};
