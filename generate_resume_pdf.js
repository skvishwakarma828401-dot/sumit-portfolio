const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'resume.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 36, bottom: 36, left: 40, right: 40 }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Primary Colors & Styling
const primaryColor = '#000000';
const secondaryColor = '#2563eb';
const textColor = '#1f2937';
const mutedColor = '#4b5563';
const lineRuleColor = '#000000';

// Helper functions
function addHeader() {
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .fillColor(primaryColor)
    .text('Sumit Kumar', { align: 'center' });

  doc.moveDown(0.2);

  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor(textColor)
    .text('+91 8210828893   |   skvishwakarma828401@gmail.com   |   linkedin.com/in/sumit-kumar   |   github.com/skvishwakarma', {
      align: 'center'
    });

  doc.moveDown(0.6);
}

function addSectionTitle(title) {
  doc.moveDown(0.4);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(primaryColor)
    .text(title.toUpperCase());

  const y = doc.y;
  doc
    .strokeColor(lineRuleColor)
    .lineWidth(0.75)
    .moveTo(40, y + 2)
    .lineTo(555, y + 2)
    .stroke();

  doc.moveDown(0.4);
}

function addBullet(text) {
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(textColor)
    .text('•  ' + text, {
      indent: 10,
      lineGap: 1.5,
      paragraphGap: 2
    });
}

// 1. Header
addHeader();

// 2. Professional Summary
addSectionTitle('Professional Summary');
doc
  .font('Helvetica')
  .fontSize(9)
  .fillColor(textColor)
  .text(
    'Full-stack developer with hands-on experience in MERN stack development, RESTful API design, and MongoDB database integration. Proficient in JavaScript, React, Node.js, and Express.js, with a strong foundation in Data Structures and Algorithms, OOPs, DBMS, Operating Systems, and Computer Networks. Experienced in building responsive web applications, developing backend services, and working with Git-based development workflows.',
    { lineGap: 1.5, align: 'justify' }
  );

// 3. Education
addSectionTitle('Education');

// B.Tech
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Durgapur Institute of Advanced Technology and Management', 40, doc.y, { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('Durgapur, West Bengal', { align: 'right' });

doc.font('Helvetica-Oblique').fontSize(9).fillColor(textColor).text('Bachelor of Technology (CGPA: 7.05)', 40, doc.y, { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('2022 – 2026', { align: 'right' });

doc.moveDown(0.3);

// Diploma
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Akash Institute of Technology', 40, doc.y, { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('India', { align: 'right' });

doc.font('Helvetica-Oblique').fontSize(9).fillColor(textColor).text('Diploma (Percentage: 70%)', 40, doc.y, { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('2016 – 2019', { align: 'right' });

// 4. Technical Skills
addSectionTitle('Technical Skills');
doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Languages: ', { continued: true });
doc.font('Helvetica').fillColor(textColor).text('JavaScript, Java, HTML, CSS');

doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Frontend: ', { continued: true });
doc.font('Helvetica').fillColor(textColor).text('React, Tailwind CSS');

doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Backend: ', { continued: true });
doc.font('Helvetica').fillColor(textColor).text('Node.js, Express.js, REST APIs');

doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Databases: ', { continued: true });
doc.font('Helvetica').fillColor(textColor).text('MongoDB');

doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Tools: ', { continued: true });
doc.font('Helvetica').fillColor(textColor).text('Git, GitHub');

doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text('Core Subjects: ', { continued: true });
doc.font('Helvetica').fillColor(textColor).text('Operating Systems (OS), Computer Networks (CN), DBMS, OOPs, DSA');

// 5. Experience
addSectionTitle('Experience');
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Intern – Unified Mentor Pvt. Ltd.', 40, doc.y, { continued: true });
doc.font('Helvetica').fontSize(9).fillColor(mutedColor).text('6 Months', { align: 'right' });

addBullet('Developed and integrated RESTful APIs using Node.js and Express.js, improving backend efficiency.');
addBullet('Built and tested full-stack features using the MERN stack (MongoDB, Express.js, React, Node.js).');
addBullet('Collaborated on database design and API integration for seamless frontend-backend communication.');
addBullet('Gained experience in debugging, version control (Git), and real-world development workflows.');

// 6. Projects
addSectionTitle('Projects');

// Project 1: RentEase
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('RentEase — AI-Powered Full-Stack Furniture Rental Platform', 40, doc.y, { continued: true });
doc.font('Helvetica-Oblique').fontSize(9).fillColor(mutedColor).text('Node.js, Express, MongoDB, REST API', { align: 'right' });

doc.font('Helvetica').fontSize(8.5).fillColor(secondaryColor).text('Live Demo: https://rentease-ai-full-stack.onrender.com   |   GitHub: https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack.');
addBullet('Built an intelligent customer support and furniture recommendation AI assistant with live MongoDB inventory search.');
addBullet('Engineered multi-step checkout with tenure-based discounts (up to 35%), address validation, and simulated payment gateway.');
addBullet('Implemented real-time order tracking dashboard with a 4-step delivery progress timeline and user order cancellation.');
addBullet('Developed a role-based Admin Management Portal for real-time revenue analytics, order lifecycle management, and inventory CRUD.');

doc.moveDown(0.3);

// Project 2: Pathology Lab Management Website
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(primaryColor).text('Pathology Lab Management Website', 40, doc.y, { continued: true });
doc.font('Helvetica-Oblique').fontSize(9).fillColor(mutedColor).text('HTML, CSS, JavaScript, Node.js, MongoDB', { align: 'right' });

addBullet('Developed a web application for managing pathology diagnostic test bookings and patient medical services.');
addBullet('Implemented REST APIs and MongoDB database integration for efficient data handling and PDF receipt generation.');

// 7. Certifications
addSectionTitle('Certifications');
addBullet('HackerRank Software Engineer Certification');

// 8. Languages
addSectionTitle('Languages');
doc.font('Helvetica').fontSize(9).fillColor(textColor).text('English, Hindi, Bengali', { indent: 10 });

// Finalize PDF
doc.end();

writeStream.on('finish', () => {
  console.log('Successfully generated clean ATS-friendly resume PDF at public/resume.pdf');
});
