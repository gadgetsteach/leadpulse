import bcrypt from 'bcryptjs';
import prisma from './utils/prisma';

async function main() {
  console.log('Seeding database...');

  // 1. Create a test business admin
  const email = 'admin@example.com';
  const existingBusiness = await prisma.business.findUnique({ where: { email } });

  let business;
  if (!existingBusiness) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    business = await prisma.business.create({
      data: {
        name: 'Spotless Cleaning & Tech Co.',
        email,
        slug: 'spotless-cleaning-tech',
        passwordHash,
        description: 'Premium cleaning and technology consulting services.',
      },
    });
    console.log('Created test business admin: admin@example.com / admin123');
  } else {
    business = existingBusiness;
    console.log('Test business admin already exists.');
  }

  // 2. Create form: Home Cleaning Service
  const cleaningFormSlug = 'home-cleaning';
  const existingCleaningForm = await prisma.form.findUnique({ where: { slug: cleaningFormSlug } });

  if (!existingCleaningForm) {
    const cleaningForm = await prisma.form.create({
      data: {
        businessId: business.id,
        title: 'Home Cleaning Questionnaire',
        description: 'Tell us about your home cleaning needs to get a personalized quote within 24 hours.',
        slug: cleaningFormSlug,
        metaTitle: 'Book Home Cleaning | Spotless Cleaning',
        metaDescription: 'Complete our quick questionnaire to get an instant tailored quote for home deep cleaning and regular cleaning services.',
      },
    });

    const questions = [
      {
        questionText: 'What type of cleaning service do you require?',
        questionType: 'select',
        isRequired: true,
        sortOrder: 0,
        options: ['Regular House Cleaning', 'Deep Cleaning', 'Move-in/Move-out Cleaning', 'Post-Construction Cleaning'],
      },
      {
        questionText: 'How many bedrooms in your house?',
        questionType: 'select',
        isRequired: true,
        sortOrder: 1,
        options: ['1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms'],
      },
      {
        questionText: 'How many bathrooms in your house?',
        questionType: 'select',
        isRequired: true,
        sortOrder: 2,
        options: ['1 Bathroom', '2 Bathrooms', '3 Bathrooms', '4+ Bathrooms'],
      },
      {
        questionText: 'Do you have any pets inside the house?',
        questionType: 'radio',
        isRequired: true,
        sortOrder: 3,
        options: ['Yes, dogs/cats', 'Yes, caged pets only', 'No pets'],
      },
      {
        questionText: 'When would you like us to come?',
        questionType: 'date',
        isRequired: true,
        sortOrder: 4,
      },
      {
        questionText: 'Do you have any special instructions or areas to focus on?',
        questionType: 'textarea',
        isRequired: false,
        sortOrder: 5,
      },
    ];

    for (const q of questions) {
      await prisma.formQuestion.create({
        data: {
          ...q,
          formId: cleaningForm.id,
        },
      });
    }

    console.log('Created Home Cleaning Form & Questions.');
  } else {
    console.log('Home Cleaning Form already exists.');
  }

  // 3. Create form: Web Design Proposal
  const techFormSlug = 'web-design';
  const existingTechForm = await prisma.form.findUnique({ where: { slug: techFormSlug } });

  if (!existingTechForm) {
    const techForm = await prisma.form.create({
      data: {
        businessId: business.id,
        title: 'Custom Web Development Inquiry',
        description: 'Describe your website requirements to get a technology design plan and quote.',
        slug: techFormSlug,
        metaTitle: 'Get a Web Design Proposal | Spotless Cleaning & Tech Co.',
        metaDescription: 'Fill out our design questionnaire to specify your budget, design preferences, and timeline for your upcoming web project.',
      },
    });

    const questions = [
      {
        questionText: 'What is your estimated budget for this project?',
        questionType: 'select',
        isRequired: true,
        sortOrder: 0,
        options: ['Under $1,500', '$1,500 - $5,000', '$5,000 - $15,000', 'Above $15,000'],
      },
      {
        questionText: 'What is the primary goal of your new website?',
        questionType: 'select',
        isRequired: true,
        sortOrder: 1,
        options: ['Generate leads', 'Sell products online (E-commerce)', 'Brand presence / portfolio', 'Provide information / blog'],
      },
      {
        questionText: 'Do you have a current website?',
        questionType: 'radio',
        isRequired: true,
        sortOrder: 2,
        options: ['Yes (I want to redesign it)', 'No (This is a brand new project)'],
      },
      {
        questionText: 'Provide link to your current website (if applicable):',
        questionType: 'text',
        isRequired: false,
        sortOrder: 3,
      },
      {
        questionText: 'Select required features (choose all that apply):',
        questionType: 'checkbox',
        isRequired: false,
        sortOrder: 4,
        options: ['Contact / Inquiry Forms', 'User Login / Registration', 'Payment Gateway Integration', 'SEO Setup', 'Admin Content Dashboard'],
      },
      {
        questionText: 'Target Launch Date:',
        questionType: 'date',
        isRequired: true,
        sortOrder: 5,
      },
    ];

    for (const q of questions) {
      await prisma.formQuestion.create({
        data: {
          ...q,
          formId: techForm.id,
        },
      });
    }

    console.log('Created Web Design Form & Questions.');
  } else {
    console.log('Web Design Form already exists.');
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
