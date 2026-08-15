/**
 * Interactive Developer Terminal CLI for Sumit Kumar's Portfolio
 */

class InteractiveTerminal {
  constructor() {
    this.terminalEl = document.getElementById('terminal-body');
    this.inputEl = document.getElementById('terminal-input');
    this.formEl = document.getElementById('terminal-form');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => `
<span class="cmd-cyan">AVAILABLE COMMANDS:</span>
  <span class="cmd-green">about</span>       - Read about Sumit Kumar & background
  <span class="cmd-green">skills</span>      - Display technical skills & stack
  <span class="cmd-green">projects</span>    - List featured 3D & full-stack projects
  <span class="cmd-green">experience</span>  - View education & training timeline
  <span class="cmd-green">contact</span>     - Get contact details & direct links
  <span class="cmd-green">matrix</span>      - Trigger digital rain matrix visual
  <span class="cmd-green">theme</span>       - Toggle theme (dark / neon / light)
  <span class="cmd-green">clear</span>       - Clear terminal screen
  <span class="cmd-green">date</span>        - Display current date and time
  <span class="cmd-green">hire</span>        - Instant email contact link
`,
      about: () => `
<span class="cmd-purple">ABOUT SUMIT KUMAR:</span>
• <b>Role:</b> Full Stack Web Developer & Computer Science Student (2022-2026).
• <b>Specialization:</b> Responsive Web Applications, MERN Stack (React, Node.js, Express, MongoDB), 3D WebGL UI.
• <b>Mission:</b> Creating fast, intuitive, and visually captivating digital experiences that solve real-world problems.
`,
      skills: () => `
<span class="cmd-cyan">TECHNICAL SKILLS & TOOLKIT:</span>
• <span class="cmd-green">Frontend:</span> HTML5, CSS3, JavaScript (ES6+), React.js, Three.js, Responsive UI
• <span class="cmd-green">Backend:</span> Node.js, Express.js, REST APIs, MVC Architecture
• <span class="cmd-green">Databases:</span> MongoDB, Mongoose ODM, SQL, MySQL
• <span class="cmd-green">Developer Tools:</span> Git, GitHub, VS Code, Postman, Vite, NPM
• <span class="cmd-green">Core CS:</span> Data Structures & Algorithms, OOP, DBMS, Computer Networks
`,
      projects: () => `
<span class="cmd-purple">FEATURED PROJECTS:</span>
1. <span class="cmd-green">RentEase</span> - Furniture & Appliance Rental Web App (HTML, CSS, JS)
2. <span class="cmd-green">Pathology Management System</span> - Healthcare Workflow App (Node.js, Express, MongoDB)
3. <span class="cmd-green">MERN E-Commerce Application</span> - Full-Stack Shopping Platform (React, Node, Mongo)
4. <span class="cmd-green">3D Interactive Portfolio</span> - Three.js WebGL Developer Portfolio
<span class="cmd-dim">Tip: Click on project cards above to view live preview modals!</span>
`,
      experience: () => `
<span class="cmd-cyan">CAREER & TRAINING TIMELINE:</span>
• <b>Unified Mentor Pvt. Ltd.</b> (6 Months Full-Stack Training)
  - Hands-on React, Node.js, Express, MongoDB, REST APIs & cloud deployments.
• <b>Web Development Internship</b>
  - Practical frontend/backend modules, database optimization & real client tasks.
• <b>Bachelor's Degree in Computer Science</b> (2022 — 2026)
`,
      contact: () => `
<span class="cmd-green">CONNECT WITH SUMIT:</span>
• 📧 <b>Email:</b> <a href="mailto:skvishwakarma828401@gmail.com" class="term-link">skvishwakarma828401@gmail.com</a>
• 💼 <b>LinkedIn:</b> <a href="https://www.linkedin.com/in/sumit-kumar-6ab39631a" target="_blank" class="term-link">linkedin.com/in/sumit-kumar-6ab39631a</a>
• 💻 <b>GitHub:</b> <a href="https://github.com/sumit-kumar" target="_blank" class="term-link">github.com/sumit-kumar</a>
• 📱 <b>Phone:</b> <a href="tel:+918210828893" class="term-link">+91 82108 28893</a>
`,
      hire: () => {
        window.location.href = 'mailto:skvishwakarma828401@gmail.com?subject=Opportunity%20for%20Sumit%20Kumar';
        return `<span class="cmd-green">Opening your email client to reach out to Sumit Kumar... 🚀</span>`;
      },
      matrix: () => {
        if (window.triggerMatrixEffect) {
          window.triggerMatrixEffect();
        }
        return `<span class="cmd-green">Initializing Matrix Rain protocol... Wake up, Neo. 🟢</span>`;
      },
      theme: () => {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.click();
        return `<span class="cmd-cyan">Theme switched successfully.</span>`;
      },
      date: () => `<span class="cmd-cyan">${new Date().toLocaleString()}</span>`,
      clear: () => {
        this.clearTerminal();
        return '';
      },
      sudo: () => `<span class="cmd-red">Permission denied: Sumit Kumar is the root superuser. 🔒</span>`
    };

    this.init();
  }

  init() {
    if (!this.formEl || !this.inputEl) return;

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const commandText = this.inputEl.value.trim();
      if (commandText) {
        this.executeCommand(commandText);
        this.history.push(commandText);
        this.historyIndex = this.history.length;
        this.inputEl.value = '';
      }
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = '';
        }
      }
    });

    // Initial greeting
    this.printOutput(`
<div class="term-banner">
  <span class="cmd-cyan">Sumit Kumar [Version 3.0.0-WebGL]</span><br>
  Type <span class="cmd-green">'help'</span> to see all interactive commands, or explore sections below.
</div>
`);
  }

  clearTerminal() {
    if (this.terminalEl) {
      this.terminalEl.innerHTML = '';
    }
  }

  printOutput(html) {
    if (!this.terminalEl) return;
    const outputDiv = document.createElement('div');
    outputDiv.className = 'term-output-line';
    outputDiv.innerHTML = html;
    this.terminalEl.appendChild(outputDiv);
    this.terminalEl.scrollTop = this.terminalEl.scrollHeight;
  }

  executeCommand(cmd) {
    const rawCmd = cmd.trim();
    const cleanCmd = rawCmd.toLowerCase();

    // Print the command line prompt
    this.printOutput(`
      <div class="term-prompt-line">
        <span class="term-user">guest@sumit-dev</span>:<span class="term-path">~</span>$ <span class="term-cmd-echo">${rawCmd}</span>
      </div>
    `);

    // Synthesizer audio click if available
    if (window.soundFX && window.soundFX.playClick) {
      window.soundFX.playClick();
    }

    if (this.commands[cleanCmd]) {
      const response = this.commands[cleanCmd]();
      if (response) {
        this.printOutput(response);
      }
    } else {
      this.printOutput(`
        <span class="cmd-red">Command not found: '${rawCmd}'.</span> Type <span class="cmd-green">'help'</span> for a list of available commands.
      `);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.interactiveTerminal = new InteractiveTerminal();
});
