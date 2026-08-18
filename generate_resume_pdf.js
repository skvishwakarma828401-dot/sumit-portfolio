const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'public', 'resume.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 26, bottom: 26, left: 34, right: 34 }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Primary Colors & Styling (ATS Standard Monochrome + Navy Accent)
const primaryColor = '#0f172a';
const secondaryColor = '#1d4ed8';
const textColor = '#1e293b';
const mutedColor = '#475569';
const lineRuleColor = '#cbd5e1';

// Helper functions
function addHeader() {
  doc
    .font('Helvetica-Bold')
    .fontSize(19)
    .fillColor(primaryColor)
    .text('SUMIT KUMAR', { align: 'center', characterSpacing: 1 });

  doc.moveDown(0.15);

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(secondaryColor)
    .text('FULL-STACK DEVELOPER  |  MERN STACK & WEBGL ENGINEER', { align: 'center' });

  doc.moveDown(0.2);

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(mutedColor)
    .text('+91 8210828893  •  skvishwakarma828401@gmail.com  •  linkedin.com/in/sumit-kumar  •  github.com/skvishwakarma828401-dot', {
      align: 'center'
    });

  doc.moveDown(0.35);
}

function addSectionTitle(title) {
  doc.moveDown(0.25);
  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(primaryColor)
    .text(title.toUpperCase(), { characterSpacing: 0.5 });

  const y = doc.y;
  doc
    .strokeColor(lineRuleColor)
    .lineWidth(0.6)
    .moveTo(34, y + 1.5)
    .lineTo(561, y + 1.5)
    .stroke();

  doc.moveDown(0.25);
}

function addBullet(text) {
  doc
    .font('Helvetica')
    .fontSize(8.2)
    .fillColor(textColor)
    .text('•  ' + text, {
      indent: 8,
      lineGap: 1.2,
      paragraphGap: 1.5
    });
}

// 1. Header
addHeader();

// 2. Professional Summary
addSectionTitle('Professional Summary');
doc
  .font('Helvetica')
  .fontSize(8.2)
  .fillColor(textColor)
  .text(
    'Full-Stack Developer with hands-on expertise in MERN Stack (MongoDB, Express.js, React.js, Node.js), RESTful API design, and database modeling. Strong foundation in Data Structures & Algorithms (DSA), OOPs, DBMS, Operating Systems, and Computer Networks. Proven track record in building high-performance web applications, integrating AI workflows, developing secure authentication pipelines, and deploying production-ready applications with Git version control.',
    { lineGap: 1.2, align: 'justify' }
  );

// 3. Technical Skills
addSectionTitle('Technical Skills');

function addSkillRow(category, items) {
  doc.font('Helvetica-Bold').fontSize(8.2).fillColor(primaryColor).text(category + ': ', { continued: true });
  doc.font('Helvetica').fontSize(8.2).fillColor(textColor).text(items);
}

addSkillRow('Languages', 'JavaScript (ES6+), Java, HTML5, CSS3, SQL');
addSkillRow('Frontend', 'React.js, Redux Toolkit, Context API, Tailwind CSS, Responsive Web Design, Three.js / WebGL');
addSkillRow('Backend', 'Node.js, Express.js, RESTful APIs, JWT Authentication, Middleware, Nodemailer / SMTP');
addSkillRow('Databases & Tools', 'MongoDB, Mongoose ODM, MySQL, Git, GitHub, Postman, Vercel, Render, npm');
addSkillRow('Core CS', 'Data Structures and Algorithms (DSA), Object-Oriented Programming (OOP), DBMS, OS, Computer Networks');

// 4. Experience
addSectionTitle('Work Experience');
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(primaryColor).text('Full-Stack Developer Intern  |  Unified Mentor Pvt. Ltd.', 34, doc.y, { continued: true });
doc.font('Helvetica-Bold').fontSize(8).fillColor(mutedColor).text('6 Months', { align: 'right' });

addBullet('Architected and integrated 10+ RESTful API endpoints using Node.js and Express.js, reducing server response times.');
addBullet('Built interactive frontend modules using React.js and Tailwind CSS with responsive cross-browser compatibility.');
addBullet('Engineered and indexed MongoDB collections via Mongoose ODM for fast query retrieval and schema validation.');
addBullet('Implemented JWT-based secure user authentication and collaborated in Git-based agile sprint workflows and code reviews.');

// 5. Projects
addSectionTitle('Featured Projects');

// Project 1: RentEase
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(primaryColor).text('RentEase — AI-Powered Full-Stack Furniture Rental Platform', 34, doc.y, { continued: true });
doc.font('Helvetica-Oblique').fontSize(8).fillColor(mutedColor).text('Node.js, Express, MongoDB, REST API', { align: 'right' });

doc.font('Helvetica').fontSize(7.8).fillColor(secondaryColor).text('Live Demo: https://rentease-ai-full-stack.onrender.com   |   GitHub: https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack.');
addBullet('Architected full-stack rental platform with tenure-based discount tiers (up to 35%), address validation, and payment checkout.');
addBullet('Integrated conversational AI assistant executing live natural-language inventory queries directly against MongoDB collections.');
addBullet('Implemented 4-stage real-time order tracking progress timeline, automated email confirmations, and role-based Admin Analytics.');

doc.moveDown(0.15);

// Project 2: NEXUS-AI 3D Robot Developer Portfolio
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(primaryColor).text('NEXUS-AI — 3D WebGL Developer Portfolio & Sound Synthesizer', 34, doc.y, { continued: true });
doc.font('Helvetica-Oblique').fontSize(8).fillColor(mutedColor).text('Three.js, WebGL, Node.js, Express', { align: 'right' });

doc.font('Helvetica').fontSize(7.8).fillColor(secondaryColor).text('Live Demo: https://sumit-kumar-portfolio.onrender.com   |   GitHub: https://github.com/skvishwakarma828401-dot');
addBullet('Engineered interactive 3D WebGL application rendering articulated procedural meshes and dynamic canvas eye visors at 60 FPS.');
addBullet('Synthesized custom Web Audio API sound engine with zero audio dependencies, featuring cybernetic HUD controls and theme toggles.');
addBullet('Configured Express.js backend with Nodemailer SMTP to encode and transmit recruiter contact inquiries directly to Gmail.');

doc.moveDown(0.15);

// Project 3: Pathology Diagnostic Lab Management
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(primaryColor).text('Pathology Diagnostic Lab Management Website', 34, doc.y, { continued: true });
doc.font('Helvetica-Oblique').fontSize(8).fillColor(mutedColor).text('HTML5, CSS3, JavaScript, Node.js, MongoDB', { align: 'right' });

addBullet('Developed a comprehensive web application streamlining diagnostic test bookings, patient medical records, and sample tracking.');
addBullet('Built dynamic PDF generation pipeline to issue diagnostic receipts and integrated RESTful APIs with MongoDB validation.');

// 6. Education
addSectionTitle('Education');

// B.Tech
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(primaryColor).text('Durgapur Institute of Advanced Technology and Management', 34, doc.y, { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(mutedColor).text('Durgapur, West Bengal', { align: 'right' });

doc.font('Helvetica-Oblique').fontSize(8).fillColor(textColor).text('Bachelor of Technology (B.Tech) — CGPA: 7.05', 34, doc.y, { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(mutedColor).text('2022 – 2026', { align: 'right' });

doc.moveDown(0.15);

// Diploma
doc.font('Helvetica-Bold').fontSize(8.5).fillColor(primaryColor).text('Akash Institute of Technology', 34, doc.y, { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(mutedColor).text('India', { align: 'right' });

doc.font('Helvetica-Oblique').fontSize(8).fillColor(textColor).text('Diploma in Engineering — Percentage: 70%', 34, doc.y, { continued: true });
doc.font('Helvetica').fontSize(8).fillColor(mutedColor).text('2016 – 2019', { align: 'right' });

// 7. Certifications & Achievements
addSectionTitle('Certifications & Achievements');
addBullet('HackerRank Certified Software Engineer (Problem Solving & JavaScript)');
addBullet('Solved 150+ Data Structures and Algorithms problems across LeetCode and HackerRank.');
addBullet('Languages: English (Professional), Hindi (Fluent), Bengali (Conversational)');

// Finalize PDF
doc.end();

writeStream.on('finish', () => {
  console.log('Successfully generated clean ATS-friendly resume PDF at public/resume.pdf');
});

