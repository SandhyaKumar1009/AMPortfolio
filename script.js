// Global variables
let mouseX = 0, mouseY = 0;
let cursorTrails = [];

// Prevent right-click and other context menus
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Prevent keyboard shortcuts
window.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'J') || 
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.metaKey && e.key === 's') ||
        (e.metaKey && e.key === 'S')) {
        e.preventDefault();
        return false;
    }
});

// Prevent drag and drop of images
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Prevent touch events for images on mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
}, { passive: false });

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        initializeEffects();
        // Show home section by default (if you have a showSection function, otherwise remove this line)
        if (typeof showSection === 'function') showSection('home');
    }, 2000);
});

// --- Composite Initialization ---
function initializeEffects() {
    initializeCursor();
    initializeParticles();
    initializeMouseGlow();
    initializeScrollEffects();
    initializeTypingAnimation();
    initializeAboutCards();
}

// --- Custom Cursor with Trails ---
function initializeCursor() {
    const cursor = document.getElementById('cursor');
    for(let i = 0; i < 8; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        cursorTrails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';

        cursorTrails.forEach((trail, index) => {
            const delay = (index + 1) * 0.1;
            setTimeout(() => {
                trail.element.style.left = mouseX - 3 + 'px';
                trail.element.style.top = mouseY - 3 + 'px';
                trail.element.style.opacity = (8 - index) / 8 * 0.5;
            }, delay * 100);
        });
    });
    document.querySelectorAll('a, .project-card, .skill, .contact-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// --- Particle System ---
function initializeParticles() {
    const particleContainer = document.getElementById('particles');
    for(let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particleContainer.appendChild(particle);
    }
}

// --- Mouse Glow Effect ---
function initializeMouseGlow() {
    const mouseGlow = document.getElementById('mouseGlow');
    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = e.clientX - 150 + 'px';
        mouseGlow.style.top = e.clientY - 150 + 'px';
    });
}

// --- Scroll Effects & Intersection Animations ---
function initializeScrollEffects() {
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateX(-50%) translateY(-100%)';
            nav.style.opacity = '0.7';
        } else {
            nav.style.transform = 'translateX(-50%) translateY(0)';
            nav.style.opacity = '1';
        }
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for .project-card, .skill, .contact-item
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.project-card, .skill, .contact-item').forEach(el => {
        observer.observe(el);
    });
}



// Typing Animation for Subtitle
function initializeTypingAnimation() {
    const typingText = document.getElementById('typingText');
    const text = "Mechanical Process Planning and Design Engineer";
    let index = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (isDeleting) {
            // Deleting text
            typingText.textContent = text.substring(0, index - 1);
            index--;
        } else {
            // Typing text
            typingText.textContent = text.substring(0, index + 1);
            index++;
        }
        
        // Set typing speed
        let typeSpeed = isDeleting ? 100 : 150;
        
        // If word is complete, pause before deleting
        if (!isDeleting && index === text.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && index === 0) {
            isDeleting = false;
            typeSpeed = 500; // Pause before starting again
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start the typing animation
    typeWriter();
}

// --- Project Card Interactions: Ripple + Parallax ---
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 107, 53, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = mouseX - card.getBoundingClientRect().left - 25 + 'px';
            ripple.style.top = mouseY - card.getBoundingClientRect().top - 25 + 'px';
            ripple.style.width = '50px';
            ripple.style.height = '50px';
            ripple.style.pointerEvents = 'none';
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `
                translateY(-20px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });
});

// --- Ripple Keyframe (Inject to Head) ---
const rippleKeyframes = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
const style = document.createElement('style');
style.textContent = rippleKeyframes;
document.head.appendChild(style);

// --- Matrix Rain Effect (Background Enhancement) ---
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-3';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "⚙️🔧📐🔩⚡🚀🛠️🏭";
    const drops = [];
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    for(let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff6b35';
        ctx.font = fontSize + 'px monospace';

        for(let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 150);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
setTimeout(createMatrixRain, 3000);

// --- Audio Feedback (Subtle Beeps on Interactions) ---
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function playTone(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}
document.querySelectorAll('a, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(800, 0.1));
});
document.querySelectorAll('.nav-links a').forEach(el => {
    el.addEventListener('click', () => playTone(1200, 0.2));
});

// --- Project Modal Logic ---
const modal = document.getElementById("projectModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.querySelector(".close-btn");

const fullProjectDetails = {
    "🔧 Tool Holder Optimization & Modular Design for CNC Machines": `
      <h2 style="color:#ff6b35;">🔧 Tool Holder Optimization & Modular Design for CNC Machines</h2>
      <p><strong>Role:</strong> Mechanical Engineer | <strong>Company:</strong> Eppinger Tooling Asia Pvt. Ltd., Coimbatore</p>
      <p><strong>Duration:</strong> Sep 2022 – Oct 2023 (1 year)</p>
      <h3>🔧 Tools & Skills:</h3>
      <p>CREO, AutoCAD, CNC Machining, GD&T, BOM, VMC/HMC, Forging, Precision Engineering, Process Planning, ISO & DIN Standards, Metrology, ERP (ABAS), Tooling Design, Cost Optimization, DFM/DFA, Mechanical Tolerancing, Quality Control, Fixture Design, CAM, G-Codes & M-Codes</p>
      
      <h3>🚀 Project Overview</h3>
      <p>Led the full lifecycle design and process development of an innovative modular tool holder system by segmenting traditional monolithic holders into a Housing and Shaft sub-assembly. This strategic redesign aimed at improving cost-efficiency, machining precision, and operational flexibility in CNC environments.</p>
      
      <h3>🎯 Key Objectives</h3>
      <ul>
        <li>Analyze existing single-piece tool holders and identify limitations.</li>
        <li>Redesign and validate modular components (housing + shaft).</li>
        <li>Reduce production costs, machining time, and number of operations.</li>
        <li>Optimize tolerancing for manufacturability and interchangeability.</li>
        <li>Implement a sustainable design-for-manufacturing (DFM) strategy.</li>
        <li>Improve runout control and component stability through innovative clamping and fixture design.</li>
      </ul>
      
      <h3>🔍 Key Contributions & Responsibilities</h3>
      <h4>✅ Design & Simulation</h4>
      <ul>
        <li>Conceptualized and developed 2D & 3D CAD models in CREO and AutoCAD following ISO & DIN standards.</li>
        <li>Integrated threading and toothed interfaces for effective Housing-Shaft assembly.</li>
        <li>Conducted tolerance stack-up analysis and GD&T validation to ensure compatibility and performance.</li>
      </ul>
      
      <h4>✅ Process Planning & Manufacturing</h4>
      <ul>
        <li>Developed detailed process flowcharts, guide cards, and BOM for all stages of manufacturing.</li>
        <li>Chose optimal material types (forged blanks vs bright/black rods) and specified heat treatment strategies (case-hardening, toughening) based on mechanical properties and machinability.</li>
        <li>Oversaw in-house and external operations, including VMC/HMC machining, drilling, grinding, turning, and fixture design.</li>
      </ul>
      
      <h4>✅ Fixture & Clamping Design</h4>
      <ul>
        <li>Collaborated with the Tool Room to design custom fixtures to address clamping-related tolerance issues.</li>
        <li>Solved runout and concentricity challenges by engineering sub-component geometries and fixtures, improving repeatability across production batches.</li>
      </ul>
      
      <h4>✅ Quality Control & Cost Estimation</h4>
      <ul>
        <li>Conducted comprehensive time studies and machining cost evaluations.</li>
        <li>Ensured compliance with GD&T and metrological standards, contributing to high-quality output with <0.02mm runout.</li>
      </ul>
      
      <h4>✅ Team Leadership & Coordination</h4>
      <ul>
        <li>Led cross-functional teams across two plants (ETA-200 for Tool Holders, ETA-300 for Gears).</li>
        <li>Created Gantt charts for project planning, conducted regular progress meetings, and facilitated knowledge-sharing sessions across design, production, and QA teams.</li>
      </ul>
      
      <h3>📊 Quantifiable Achievements</h3>
      <ul>
        <li>🔻 30% Reduction in machining time per tool holder through modular redesign.</li>
        <li>💲 25% Cost savings in production by transitioning from monolithic to two-part components.</li>
        <li>🛠 40+ components successfully managed through ERP (ABAS) and internal/external workflows.</li>
        <li>📉 60% reduction in material waste by shifting to forged blanks from rods.</li>
        <li>📏 >98% accuracy in final components achieved through iterative prototyping and fixture tuning.</li>
      </ul>
      
      <h3>🧠 Challenges Overcome</h3>
      <ul>
        <li>Addressed critical runout control issues by engineering separate mating interfaces with precision fits.</li>
        <li>Overcame tooling limitations by initiating the purchase and specification of new metrology equipment.</li>
        <li>Dealt with tolerance mismatches through component redesign and fixture alignment strategies, preventing large-scale scrappage.</li>
      </ul>
      
      <h3>🧩 Tools, Technologies & Standards Used</h3>
      <ul>
        <li><strong>CAD/CAM Software:</strong> CREO, AutoCAD</li>
        <li><strong>Manufacturing Tools:</strong> CNC (VMC/HMC), Forging, Grinding, Turning, Drilling</li>
        <li><strong>Standards & Methodologies:</strong> ISO, DIN, GD&T, DFM/DFA</li>
        <li><strong>ERP System:</strong> ABAS</li>
        <li><strong>Quality Tools:</strong> Metrology instruments, Process Flow Cards, Inspection Reports</li>
        <li><strong>Programming:</strong> G-Codes, M-Codes</li>
      </ul>
      
      <h3>🏁 Project Outcome</h3>
      <p>The reengineered modular tool holder system was successfully tested and integrated into production with superior runout performance, reduced costs, and simplified assembly workflows. The project established a replicable framework for future product redesigns and was well-received by the German head office.</p>
      
      <h3>🧠 Key Learnings & Impact</h3>
      <ul>
        <li>Gained deep technical expertise in mechanical design for CNC applications, from raw material selection to final quality inspection.</li>
        <li>Strengthened cross-disciplinary collaboration, improving coordination across engineering, production, and QA.</li>
        <li>Developed practical solutions to real-world production challenges, showcasing engineering creativity and strategic thinking.</li>
      </ul>
      
      <div class="confidential-warning">
        <p style="color: #ff6b35; font-weight: bold; text-align: center; margin: 2rem 0 1rem 0; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3);">
          ⚠️ CONFIDENTIAL CONTENT - Images are intentionally blurred for privacy and security purposes
        </p>
      </div>
      <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 221904.png" alt="CNC Tool Holder Design" class="project-detail-image">
</div>
</div>
      <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 221934.png" alt="CNC Tool Holder Components" class="project-detail-image">
</div>
</div>
       <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 221954.png" alt="CNC Tool Holder in Action" class="project-detail-image">
</div>
</div>
      <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 222038.png" alt="Cycloidal Gearbox Design" class="project-detail-image">
</div>
</div>
    `,

    "⚙ Cycloidal Gearbox Design & Optimization for CNC Applications": `
      <h2 style="color:#ff6b35;">⚙ Cycloidal Gearbox Design & Optimization for CNC Applications</h2>
      <p><strong>Role:</strong> Mechanical Engineer</p>
      <p><strong>Company:</strong> Eppinger Tooling Asia Pvt. Ltd., Coimbatore, India</p>
      <p><strong>Project Duration:</strong> January 2022 – July 2022</p>
      <p><strong>Mentor:</strong> Mr. P. Vellingiri</p>
      
      <h3>🚀 Project Overview</h3>
      <p>Designed and developed a high-efficiency Cycloidal Gearbox tailored for CNC machines, aimed at reducing backlash, enhancing torque transfer, and improving speed control. The project explored innovative cycloidal motion principles and precision manufacturing techniques to deliver a robust, low-noise, and compact gearbox solution suitable for high-accuracy industrial CNC systems.</p>
      
      <h3>🎯 Project Objectives</h3>
      <ul>
        <li>Replace conventional involute gear-based systems with an advanced cycloidal mechanism to improve torque-to-weight ratio and reduce backlash.</li>
        <li>Model, simulate, prototype, and test a cycloid gear transmission system optimized for CNC compatibility.</li>
        <li>Minimize manufacturing cost, noise, wear, and assembly errors, while improving reliability and energy efficiency.</li>
        <li>Seamlessly integrate the design into existing CNC infrastructure with minimal redesign of machine frames.</li>
      </ul>
      
      <h3>🧩 Key Skills & Tools</h3>
      <ul>
        <li><strong>CAD/CAE Tools:</strong> AutoCAD, CREO</li>
        <li><strong>Standards & Quality:</strong> ISO, DIN, GD&T</li>
        <li><strong>Manufacturing:</strong> CNC Machining, HMC, VMC, Forging, Heat Treatment, Grinding</li>
        <li><strong>Processes:</strong> DFM/DFA, Metrology, BOM Management, ERP (ABAS)</li>
        <li><strong>Programming:</strong> G-Codes, M-Codes</li>
        <li><strong>Soft Skills:</strong> Leadership, Team Coordination, Root Cause Analysis, Technical Documentation</li>
      </ul>
      
      <h3>💡 My Responsibilities & Contributions</h3>
      <h4>🔧 Design & Engineering</h4>
      <ul>
        <li>Created detailed 2D and 3D models of the cycloidal gearbox and subcomponents (e.g., casing, flange OP/IP, HS shaft, disc set) adhering to GD&T and ISO/DIN standards.</li>
        <li>Performed tolerance analysis, identified stress points, and addressed fitting and concentricity issues in assembly.</li>
        <li>Designed custom stage drawings and maintained compatibility with CNC tooling and machine limitations.</li>
      </ul>
      
      <h4>🏗 Process Planning & Optimization</h4>
      <ul>
        <li>Planned end-to-end manufacturing workflows, including selection of forged vs. cut-bit raw materials, machining methods, and heat treatments.</li>
        <li>Created process flowcards and guiding cards with step-by-step instructions, machine allocation (ETA-200, ETA-300), and worker engagement logs.</li>
        <li>Executed time-motion studies, reducing production lead time by over 20% through better toolpath planning and load balancing across plants.</li>
      </ul>
      
      <h4>🧪 Prototyping & Testing</h4>
      <ul>
        <li>Led trial production runs and root-cause analysis of high runout and tolerance mismatch issues.</li>
        <li>Implemented fixture-based clamping systems to improve machining stability and reduce scrappage by 30%.</li>
        <li>Coordinated with QA to deploy metrology tools ensuring sub-20µm concentricity across assemblies.</li>
      </ul>
      
      <h4>📦 BOM & Inventory Integration</h4>
      <ul>
        <li>Generated complete Bill of Materials (BOM), segregated into in-house and externally sourced components.</li>
        <li>Integrated production documentation and drawings with ERP system (ABAS) for seamless procurement, inventory, and assembly handoff.</li>
        <li>Issued purchase orders for standard parts and ensured availability of critical materials before each assembly phase.</li>
      </ul>
      
      <h4>🤝 Team Leadership & Collaboration</h4>
      <ul>
        <li>Managed a cross-functional team handling design, production, procurement, and QA.</li>
        <li>Conducted regular development and review meetings, resolving technical blocks proactively.</li>
        <li>Mentored junior engineers, delegated sub-tasks efficiently, and ensured cross-departmental synergy.</li>
      </ul>
      
      <h3>📊 Quantifiable Achievements</h3>
      <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
        <tr style="background: rgba(255, 107, 53, 0.1);">
          <th style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3); text-align: left;">Metric</th>
          <th style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3); text-align: left;">Result Achieved</th>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Machining Time Reduction</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">↓ 20% through optimized operations</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Scrap Rate Reduction</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">↓ 30% by addressing tolerance mismatches</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Noise Levels</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">↓ 15% compared to conventional gearboxes</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Backlash</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">↓ <0.05° (vs avg 0.2° in traditional)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Torque Efficiency</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">↑ 18% improvement in torque-to-weight</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Assembly Time Saved</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">↓ 25% due to modular part integration</td>
        </tr>
      </table>
      
      <h3>🧠 Challenges & Solutions</h3>
      <h4>🛠 Problem: Runout & Tolerance Issues</h4>
      <p><strong>Challenge:</strong> Excessive runout in shaft-casing assemblies, leading to performance deviations.</p>
      <p><strong>Solution:</strong> Re-engineered component interfaces, added fixture-assisted clamping, modified machining sequence → Achieved <0.02mm runout tolerance.</p>
      
      <h4>🛠 Problem: Material Waste & Machinability</h4>
      <p><strong>Challenge:</strong> High material loss using length rods and inconsistent surface finishes.</p>
      <p><strong>Solution:</strong> Shifted to cut-bit usage for critical parts, reducing waste by 40% and improving machinability.</p>
      
      <h3>🔍 Project Insights & Learnings</h3>
      <ul>
        <li>Gained hands-on mastery in precision gearbox design, raw material optimization, and GD&T validation.</li>
        <li>Developed a deep understanding of cycloidal motion transmission, tolerance stack-up, and fixture-based machining strategy.</li>
        <li>Strengthened leadership, project planning, and technical decision-making in a high-stakes R&D setting.</li>
      </ul>
      
      <h3>✅ Final Outcome</h3>
      <p>The project resulted in a fully functional Cycloidal Gearbox prototype, meeting all technical performance KPIs and demonstrating clear superiority over traditional gear systems in CNC machines. The modular design approach, cost-effective production pipeline, and measurable performance gains made it a scalable solution for Eppinger's broader CNC portfolio.</p>
      
      <div class="confidential-warning">
        <p style="color: #ff6b35; font-weight: bold; text-align: center; margin: 2rem 0 1rem 0; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3);">
          ⚠️ CONFIDENTIAL CONTENT - Images are intentionally blurred for privacy and security purposes
        </p>
      </div>
      <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 222949.png" alt="CNC Tool Holder Design" class="project-detail-image">
</div>
</div>
      <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 223014.png" alt="CNC Tool Holder Components" class="project-detail-image">
</div>
</div>
       <div class="project-image-container">
    <div class="image-container">
    <img src="Screenshot 2025-07-31 223051.png" alt="CNC Tool Holder in Action" class="project-detail-image">
</div>
</div>
    `,
    "🌾 Agricultural Sprayer with Slider Crank Mechanism": `
      <h2 style="color:#ff6b35;">🌾 Agricultural Sprayer with Slider Crank Mechanism</h2>
      <p><strong>Role:</strong> Team Lead & Project Manager</p>
      <p><strong>Institution:</strong> Sri Eshwar College of Engineering, Anna University, Chennai</p>
      <p><strong>Duration:</strong> December 2019 – March 2020</p>
      <p><strong>Discipline:</strong> B.E. Mechanical Engineering</p>
      
      <h3>🚀 Project Overview</h3>
      <p>Designed and fabricated an innovative, mechanically-powered agricultural sprayer utilizing a slider crank mechanism to address the limitations of traditional backpack sprayers. The project focused on creating a sustainable, cost-effective solution that eliminates the need for electricity or fuel while improving efficiency, capacity, and user comfort for small-scale farmers.</p>
      
      <h3>🎯 Project Objectives</h3>
      <ul>
        <li>Design a mechanically-powered pesticide sprayer using slider crank mechanism principles.</li>
        <li>Eliminate dependency on electricity or fuel for operation.</li>
        <li>Increase tank capacity and spraying efficiency compared to traditional backpack sprayers.</li>
        <li>Reduce user fatigue and improve ergonomics through innovative design.</li>
        <li>Create a cost-effective solution accessible to small-scale farmers.</li>
      </ul>
      
      <h3>🧩 Key Skills & Tools</h3>
      <ul>
        <li><strong>CAD Software:</strong> CREO (3D modeling, assembly, simulation)</li>
        <li><strong>Manufacturing:</strong> Gas/Electric Welding, Drilling, Machining, Fabrication</li>
        <li><strong>Mechanical Design:</strong> Slider Crank Mechanism, Sprocket & Chain Systems</li>
        <li><strong>Materials:</strong> Mild Steel, Polyethylene, Material Selection</li>
        <li><strong>Project Management:</strong> Gantt Charts, Team Coordination, Timeline Management</li>
        <li><strong>Engineering Analysis:</strong> Kinematics, Thermodynamics, Pressure Calculations</li>
      </ul>
      
      <h3>💡 My Responsibilities & Contributions</h3>
      <h4>🔧 Design & Engineering</h4>
      <ul>
        <li>Conducted comprehensive analysis of existing backpack sprayer limitations and user pain points.</li>
        <li>Designed the complete slider crank mechanism including crank, connecting rod, and piston assembly for motion conversion.</li>
        <li>Created detailed 3D CAD models in CREO for all components including frame, tank, sprocket system, and nozzle assembly.</li>
        <li>Performed kinematic analysis to optimize the slider crank mechanism for efficient power transmission.</li>
      </ul>
      
      <h4>🏗 Manufacturing & Fabrication</h4>
      <ul>
        <li>Led the fabrication of the complete sprayer system including frame, tank, and mechanical components.</li>
        <li>Designed and implemented the sprocket and chain transmission system for wheel-to-crank power transfer.</li>
        <li>Integrated height-adjustable spraying nozzles on both sides, achieving 6-foot spray width coverage.</li>
        <li>Developed the piston mechanism and flow control valves for precise pesticide application.</li>
      </ul>
      
      <h4>📊 Performance Optimization</h4>
      <ul>
        <li>Increased tank capacity to 16L+ for extended operation without refilling.</li>
        <li>Optimized sprocket teeth count and gear ratios for optimal output pressure and flow rate.</li>
        <li>Implemented flow control valves to prevent over-spraying and minimize pesticide waste.</li>
        <li>Conducted field testing to validate performance and user comfort.</li>
      </ul>
      
      <h4>🤝 Team Leadership & Project Management</h4>
      <ul>
        <li>Led a multidisciplinary team of 4 students, coordinating design, fabrication, and testing phases.</li>
        <li>Created detailed Gantt charts for project planning and timeline management.</li>
        <li>Distributed tasks equally among team members based on individual strengths and expertise.</li>
        <li>Conducted regular progress reviews and facilitated knowledge sharing sessions.</li>
      </ul>
      
      <h3>📊 Technical Specifications & Achievements</h3>
      <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
        <tr style="background: rgba(255, 107, 53, 0.1);">
          <th style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3); text-align: left;">Parameter</th>
          <th style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3); text-align: left;">Specification</th>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Tank Capacity</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">16L+ (vs 8-12L in traditional)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Spray Width</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">6 feet (dual-side nozzles)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Power Source</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Mechanical (Slider Crank)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Nozzle Configuration</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">6 nozzles (height-adjustable)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Material</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Mild Steel (Frame), Polyethylene (Tank)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">Cost Efficiency</td>
          <td style="padding: 0.5rem; border: 1px solid rgba(255, 107, 53, 0.3);">40% lower than electric alternatives</td>
        </tr>
      </table>
      
      <h3>🧠 Challenges & Solutions</h3>
      <h4>🛠 Problem: Tolerance Alignment in Chain-Sprocket System</h4>
      <p><strong>Challenge:</strong> Misalignment between driven sprocket and chain linkage causing power transmission inefficiency.</p>
      <p><strong>Solution:</strong> Redesigned sprocket mounting system with adjustable tensioners and precise alignment guides.</p>
      
      <h4>🛠 Problem: Connecting Rod Geometry Optimization</h4>
      <p><strong>Challenge:</strong> Fitting and positioning issues in the slider crank mechanism affecting stroke length and efficiency.</p>
      <p><strong>Solution:</strong> Iterative design refinement with multiple prototypes to achieve optimal connecting rod geometry and stroke parameters.</p>
      
      <h4>🛠 Problem: Weight Optimization</h4>
      <p><strong>Challenge:</strong> Heavy frame design causing user fatigue during extended operation.</p>
      <p><strong>Solution:</strong> Implemented hollow mild steel construction and strategic material placement to reduce overall weight while maintaining structural integrity.</p>
      
      <h3>🔍 Engineering Analysis & Calculations</h3>
      <ul>
        <li><strong>Kinematic Analysis:</strong> Calculated slider crank mechanism parameters for optimal motion conversion.</li>
        <li><strong>Pressure Calculations:</strong> Determined nozzle pressure requirements and flow rates for effective pesticide application.</li>
        <li><strong>Material Selection:</strong> Evaluated mechanical properties and corrosion resistance for agricultural environment suitability.</li>
        <li><strong>Load Analysis:</strong> Performed structural analysis on frame components to ensure safety and durability.</li>
      </ul>
      
      <h3>✅ Project Outcomes & Impact</h3>
      <ul>
        <li>Successfully delivered a fully functional, mechanically-powered agricultural sprayer prototype.</li>
        <li>Achieved 100% elimination of electricity/fuel dependency while maintaining operational efficiency.</li>
        <li>Demonstrated 40% cost reduction compared to electric alternatives, making it accessible to small-scale farmers.</li>
        <li>Improved user comfort and reduced fatigue through ergonomic design and increased capacity.</li>
        <li>Established a scalable design framework for future agricultural equipment development.</li>
      </ul>
      
      <h3>🧠 Key Learnings & Skills Developed</h3>
      <ul>
        <li>Gained hands-on experience in mechanical design, CAD modeling, and prototype fabrication.</li>
        <li>Developed strong project management and team leadership skills in a technical environment.</li>
        <li>Learned practical application of engineering principles including kinematics, thermodynamics, and material science.</li>
        <li>Understood the importance of user-centered design and field testing in agricultural equipment development.</li>
      </ul>
      
      <div class="project-image-container">
        <div class="image-container">
        <img src="Screenshot 2025-07-31 223813.png" alt="Agricultural Sprayer Design" class="project-detail-image no-blur">
</div>
      </div>
      <div class="project-image-container">
        <div class="image-container">
        <img src="Screenshot 2025-07-31 223307.png" alt="Agricultural Sprayer Components" class="project-detail-image no-blur">
</div>
      </div>
      <div class="project-image-container">
        <div class="image-container">
        <img src="Screenshot 2025-07-31 223417.png" alt="Agricultural Sprayer in Action" class="project-detail-image no-blur">
</div>
      </div>
      <div class="project-image-container">
        <div class="image-container">
        <img src="Screenshot 2025-07-31 223432.png" alt="Agricultural Sprayer Assembly" class="project-detail-image no-blur">
      </div>
    `
};

document.querySelectorAll(".project-card").forEach(card => {
    const title = card.querySelector(".project-title").textContent.trim();
    
    card.addEventListener("click", (e) => {
        e.preventDefault();
        
        const details = fullProjectDetails[title];
        if (details) {
            modalDetails.innerHTML = details;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else {
            modalDetails.innerHTML = `<h2 style='color:#ff6b35;'>Project Details Coming Soon</h2><p>This project will be updated with a detailed summary as the portfolio evolves.</p>`;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal when clicking the close button
closeModal.addEventListener("click", () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    setTimeout(() => {
        modalDetails.innerHTML = '';
    }, 300); // Wait for the fade-out animation to complete
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            modalDetails.innerHTML = '';
        }, 300);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            modalDetails.innerHTML = '';
        }, 300);
    }
});

// --- About Modal Logic ---
const aboutModal = document.getElementById('aboutModal');
const aboutModalDetails = document.getElementById('aboutModalDetails');
const closeAboutModal = document.querySelector('.close-about-modal');
const imageModal = document.getElementById('imageModal');
const imageGrid = document.getElementById('imageGrid');
const imageViewer = document.getElementById('imageViewer');
const modalImage = document.getElementById('modalImage');
const imageModalTitle = document.getElementById('imageModalTitle');
const imageModalClose = document.querySelector('.image-modal-close');

// --- About Card Details ---
const aboutCardDetails = {
    "Process Sheet Creation & Optimization": `
      <h2 style="color:#ff6b35;">📘Process Sheet Creation & Optimization – 2024</h2>
      <img src="1st.jpg" alt="Process Sheet Creation" style="width:100%; border-radius:12px; margin-bottom:1rem;">
      <div style="text-align: left; line-height: 1.6;">
        <p><strong>🔧 Role Summary:</strong><br>
        In 2024, I was directly responsible for managing the end-to-end lifecycle of manufacturing process sheets, including both new creation and process optimization. These documents form the backbone of the shopfloor's operational flow and are vital for process control, traceability, and ERP integration.</p>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🏗 Scope of Work:</h3>
        <p><strong>New Process Sheet Creation:</strong><br>
        Developed comprehensive process sheets from scratch for newly introduced components. This involved:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Material Size Selection based on functionality and machinability</li>
          <li>Designing the entire manufacturing process flow from raw material to finished component</li>
          <li>Machine allocation, cycle planning, operation sequencing</li>
          <li>Defining inspection points, allowances, and critical GD&T specifications</li>
        </ul>
        
        <p><strong>P.Locked Sheet Optimization:</strong><br>
        Reviewed and revised locked process sheets as per:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Latest updates from the ERP system</li>
          <li>Engineering Change Notes (ECNs) from R&D</li>
          <li>Vendor and in-house capability improvements</li>
        </ul>
        <p>Ensured compliance with new machining standards, cost control targets, and production timelines.</p>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">📊 Performance Metrics – 2024:</h3>
        <div style="background: rgba(255, 107, 53, 0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>🆕 New Process Sheets Created:</strong> 153</p>
          <p><strong>🔁 Process Locked Sheets Optimized:</strong> 361</p>
          <p><strong>📈 Total Process Sheets Handled:</strong> 514</p>
          <p><strong>Peak Month:</strong> May (65 components processed)</p>
          <p><strong>Most Balanced Month:</strong> August (nearly equal new and optimized sheets)</p>
          <p><strong>Average Monthly Output:</strong> ~43 process sheets/month</p>
        </div>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🛠 Tools & Platforms Used:</h3>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>ERP Integration: Routing & BOM management</li>
          <li>AutoCAD/CREO: Used for visualizing part features and tolerancing</li>
          <li>Excel & ERP Dashboards: For documenting process flows and tracking revisions</li>
          <li>Change Management System: For capturing ECN impacts and ensuring traceability</li>
        </ul>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🧠 Key Skills & Competencies:</h3>
        <p style="background: rgba(255, 107, 53, 0.1); padding: 1rem; border-radius: 8px;">
          Process Sheet Creation | Manufacturing Planning | ERP Optimization | Cycle Time Management | Material Selection | Machining Sequence Design | GD&T Application | ECN Implementation | Process Optimization | Component Workflow Design | P.Locked Process Review | AutoCAD | CREO Parametric | Shop Floor Engineering | Cost-Effective Manufacturing
        </p>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">💡 Impact Delivered:</h3>
        <ul style="margin-left: 2rem;">
          <li>Ensured 100% compliance with ERP-integrated workflows</li>
          <li>Reduced rework and downtime by aligning process sheets with live ECN updates</li>
          <li>Enhanced process clarity and traceability for more than 500+ components</li>
          <li>Helped production team reduce setup times by standardizing operations across similar part families</li>
        </ul>
      </div>
    `,
    "ECN Management": `
      <h2 style="color:#00d4ff;">📘Engineering Change Note (ECN) Management – 2024</h2>
      <img src="2nd.jpg" alt="ECN Management" style="width:100%; border-radius:12px; margin-bottom:1rem;">
      <div style="text-align: left; line-height: 1.6;">
        <p><strong>🎯 Overview:</strong><br>
        In 2024, I was responsible for executing and managing Engineering Change Notes (ECNs) received from the R&D department. These ECNs contained crucial design and process updates driven by industry compliance shifts, customer requirements, and internal optimization goals.</p>
        
        <p>I ensured each ECN was accurately implemented in both the ERP system and production ecosystem, maintaining alignment across documentation, routing, and real-time component manufacturing.</p>
        
        <h3 style="color:#00d4ff; margin-top:1.5rem;">💼 Core Responsibilities:</h3>
        <p><strong>ERP System Update & Integration:</strong><br>
        Integrated ECN-driven changes into the ERP for components under production, updating routing sheets, BOMs, and process parameters in accordance with revised instructions.</p>
        
        <p><strong>Drawing & Document Revision:</strong><br>
        Modified 2D drawings and 3D models using AutoCAD and CREO, incorporating revised tolerances, features, finishes, or geometry changes defined in the ECN.</p>
        
        <p><strong>Manufacturing Process Validation:</strong><br>
        Conducted cross-verification to ensure ECN instructions were:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Reflected correctly in shopfloor practices</li>
          <li>Communicated to vendors (if outsourced)</li>
          <li>Properly validated on existing tooling and process setups</li>
        </ul>
        
        <h3 style="color:#00d4ff; margin-top:1.5rem;">📊 Performance Metrics – 2024:</h3>
        <div style="background: rgba(0, 212, 255, 0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>🔄 Total ECNs Handled:</strong> 526</p>
          <p><strong>📈 Highest ECN Load Month:</strong> October – 129 ECNs</p>
          <p><strong>🔽 Lowest Activity Month:</strong> April – 27 ECNs</p>
          <p><strong>📊 ECN Type 200 (System/Process-Driven):</strong> 361</p>
          <p><strong>🔧 ECN Type 300 (Customer/Product-Driven):</strong> 165</p>
          <p><strong>🧮 Monthly Average:</strong> ~44 ECNs/month</p>
        </div>
        
        <h3 style="color:#00d4ff; margin-top:1.5rem;">🧠 Skills & Tools Demonstrated:</h3>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>ERP Change Management</li>
          <li>Process and Routing Update</li>
          <li>Engineering Drawing Revision</li>
          <li>AutoCAD & CREO Parametric</li>
          <li>Cross-functional Communication</li>
          <li>Quality and Audit Compliance</li>
          <li>Change Control & Documentation</li>
          <li>Manufacturing Traceability</li>
          <li>Component Lifecycle Management</li>
          <li>GD&T & Technical Documentation Handling</li>
        </ul>
        
        <h3 style="color:#00d4ff; margin-top:1.5rem;">🔑 Key Skills & Core Competencies:</h3>
        <p style="background: rgba(0, 212, 255, 0.1); padding: 1rem; border-radius: 8px;">
          Engineering Change Note (ECN) | Process Engineering | ERP Updates | Design Revisions | AutoCAD | CREO | Manufacturing Support | GD&T Application | Document Control | R&D Coordination | Change Management | Component Traceability | Process Validation | Product Lifecycle Integration | Customer-Driven Engineering Changes
        </p>
        
        <h3 style="color:#00d4ff; margin-top:1.5rem;">💡 Key Impact:</h3>
        <ul style="margin-left: 2rem;">
          <li>Ensured 100% accuracy in ECN implementation across production and supplier environments</li>
          <li>Improved responsiveness to engineering changes, reducing downtime and miscommunication risks</li>
          <li>Enabled a seamless integration of 526 ECNs in one calendar year—enhancing product accuracy and customer satisfaction</li>
        </ul>
      </div>
    `,
    "Stage Drawing Creation": `
      <h2 style="color:#f7931e;">📘Stage Drawing Creation for Manufacturing – 2024</h2>
      <img src="3rd.jpg" alt="Stage Drawing Creation" style="width:100%; border-radius:12px; margin-bottom:1rem;">
      <div style="text-align: left; line-height: 1.6;">
        <p><strong>🎯 Overview:</strong><br>
        In 2024, I successfully developed and delivered stage drawings to support production planning and vendor development. These drawings serve as step-by-step manufacturing blueprints, showcasing component evolution at each stage of production. This process ensures clarity, accuracy, and consistency in how complex components are fabricated and verified.</p>
        
        <h3 style="color:#f7931e; margin-top:1.5rem;">🛠 Core Responsibilities:</h3>
        <p><strong>Stage Drawing Development:</strong><br>
        Created detailed 2D stage drawings and 3D models using AutoCAD and CREO, capturing each critical step in the component's transformation from raw material to finished product.</p>
        
        <p><strong>Technical Detailing for Manufacturing:</strong><br>
        Each drawing included:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Stock allowances for grinding and machining operations</li>
          <li>Tolerances and GD&T for dimensional accuracy and assembly fit</li>
          <li>Manufacturing guidelines such as datum references, tool access, inspection points, and material flow direction</li>
        </ul>
        
        <p><strong>Cross-functional Collaboration:</strong><br>
        Worked closely with the Production, Vendor Development, and Quality Assurance teams to ensure:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Drawings were production-ready</li>
          <li>Vendors understood stage-wise requirements</li>
          <li>Outputs aligned with final product quality goals</li>
        </ul>
        
        <h3 style="color:#f7931e; margin-top:1.5rem;">📊 Annual Performance Metrics – 2024:</h3>
        <div style="background: rgba(247, 147, 30, 0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>✅ Total Stage Drawings Created:</strong> 319</p>
          <p><strong>🧰 Tool Used:</strong> AutoCAD, CREO Parametric</p>
          <p><strong>📈 Peak Month:</strong> August – 40 drawings</p>
          <p><strong>🔽 Leanest Month:</strong> May – 15 drawings</p>
          <p><strong>🧮 Monthly Average:</strong> ~27 drawings/month</p>
        </div>
        
        <h3 style="color:#f7931e; margin-top:1.5rem;">🔑 Key Skills & Core Competencies:</h3>
        <p style="background: rgba(247, 147, 30, 0.1); padding: 1rem; border-radius: 8px;">
          Stage Drawing | AutoCAD | CREO Parametric | 2D Manufacturing Drawings | Component Lifecycle Visualization | Tolerance Stack-Up | GD&T Application | Manufacturing Process Mapping | Production Engineering Support | Vendor Development Drawings | Intermediate Geometry Planning | Tooling and Fixturing Insight | Process Control Drawings | Drawing for Machining and Grinding | Mechanical Drawing Standards
        </p>
        
        <h3 style="color:#f7931e; margin-top:1.5rem;">💡 Key Achievements:</h3>
        <ul style="margin-left: 2rem;">
          <li>Created stage drawing sets for over 300 components, contributing to clear communication across production, vendor, and QA teams</li>
          <li>Helped reduce production ambiguities, minimizing dimensional mismatches and improving first-time-right manufacturing output</li>
          <li>Delivered drawing packs with precision tolerances and clear stage-wise evolution, enhancing tooling and inspection efficiency</li>
        </ul>
      </div>
    `,
    "Cost Sheet Creation": `
      <h2 style="color:#ff6b35;">📘Cost Sheet Creation for Machined Components – 2024</h2>
      <img src="Screenshot 2025-08-05 225432.png" alt="Cost Sheet Creation" style="width:100%; border-radius:12px; margin-bottom:1rem;">
      <div style="text-align: left; line-height: 1.6;">
        <p><strong>🎯 Overview:</strong><br>
        As a part of the RFQ (Request for Quotation) evaluation process, I was responsible for preparing detailed cost sheets for machined components based on customer requirements. My approach integrates technical feasibility analysis with economic evaluation to ensure competitive pricing without compromising manufacturing capability or component integrity.</p>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">💼 Key Responsibilities:</h3>
        <p><strong>Technical Feasibility Analysis:</strong><br>
        Assessed the manufacturability of components within our in-house infrastructure and vendor ecosystem by evaluating tolerances, material complexity, machine capabilities, and special process requirements.</p>
        
        <p><strong>Process Methodology Design:</strong><br>
        Developed a structured and stage-wise manufacturing process flow, simulating a realistic production route aligned with our plant's capacity and vendor strengths. Included analysis of:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Turning, Milling, Grinding, Drilling, and Heat Treatment stages</li>
          <li>Selection of appropriate fixtures, tools, and setup reduction strategies</li>
        </ul>
        
        <p><strong>Cost Calculation and Estimation:</strong><br>
        Arrived at component-wise costing using our machine hourly rate and time study estimates. Costing breakdown included:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Raw Material Costs</li>
          <li>Machining and Setup Costs</li>
          <li>Tooling and Fixturing Expenses</li>
          <li>Vendor Outsourcing Costs (if applicable)</li>
        </ul>
        
        <p><strong>Engineering Input Integration:</strong><br>
        Factored in essential mechanical and quality attributes such as:</p>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Material Selection (steel grades, hardness, machinability)</li>
          <li>GD&T and Tolerance Stack-Up</li>
          <li>Surface Finish Requirements</li>
          <li>Heat Treatment/Plating</li>
          <li>Critical to Function (CTF) features</li>
        </ul>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🔧 Tools & Methods Used:</h3>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Excel-based Quotation Models with dynamic formula linking</li>
          <li>Time Study References and machining cycle time databases</li>
          <li>CREO/AutoCAD for visualizing part geometry</li>
          <li>ERP System Cost Centers for machine-hour references</li>
          <li>Vendor Input Validation for special operations and purchased parts</li>
        </ul>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🏆 Impact Delivered:</h3>
        <ul style="margin-left: 2rem; margin-bottom: 1rem;">
          <li>Reduced cost estimation cycle time by up to 30% through standardized process templates</li>
          <li>Ensured 100% RFQ response adherence within quotation deadlines</li>
          <li>Improved costing accuracy by aligning with actual shopfloor capabilities and vendor benchmarks</li>
        </ul>
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🔑 Key Skills & Skills Highlighted:</h3>
        <p style="background: rgba(255, 107, 53, 0.1); padding: 1rem; border-radius: 8px;">
          Cost Estimation | RFQ Analysis | Feasibility Study | Process Planning | Machine Hour Rate | Manufacturing Economics | GD&T Application | Material Selection | Tooling Design | Fixture Planning | Vendor Cost Validation | Cycle Time Estimation | CREO | AutoCAD | ERP Integration | Quotation Engineering | Production Costing | Component Cost Breakdown
        </p>
      </div>
    `
};

// --- Image Gallery Data ---
const galleryImages = {
    "process-sheets": [
        { src: 'https://picsum.photos/800/600?random=process1', title: 'Process Sheet Creation' }
    ],
    "ecn-management": [
        { src: 'https://picsum.photos/800/600?random=ecn1', title: 'ECN Management' }
    ],
    "stage-drawings": [
        { src: 'https://picsum.photos/800/600?random=stage1', title: 'Stage Drawing Creation' }
    ],
    "cost-sheets": [
        { src: 'https://picsum.photos/800/600?random=cost1', title: 'Cost Sheet Creation' }
    ]
};

// --- About Cards Click Handlers ---
function initializeAboutCards() {
    document.querySelectorAll('.about-card').forEach(card => {
        // Remove any existing click handlers to prevent duplicates
        card.removeEventListener('click', handleAboutCardClick);
        // Add new click handler
        card.addEventListener('click', handleAboutCardClick);
    });
}

function handleAboutCardClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const card = e.currentTarget;
    const category = card.dataset.category;
    const title = card.dataset.title;
    
    console.log('Card clicked:', { category, title }); // Debug log
    console.log('aboutCardDetails keys:', Object.keys(aboutCardDetails)); // Debug log
    console.log('Title exists:', aboutCardDetails[title] ? 'YES' : 'NO'); // Debug log
    
    // Show the detailed content in the about modal
    if (aboutCardDetails[title]) {
        console.log('Showing modal with content for:', title); // Debug log
        aboutModalDetails.innerHTML = aboutCardDetails[title];
        aboutModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
        console.log('No content found for title:', title); // Debug log
    }
}

// Show image grid for a specific category
function showImageGrid(category, title) {
    console.log('showImageGrid called with:', { category, title }); // Debug log
    
    const images = galleryImages[category] || [];
    
    // Clear previous content
    imageGrid.innerHTML = '';
    
    // Add images to grid
    images.forEach((img, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = img.src.replace('800/600', '200/150'); // Load smaller thumbnails
        imgElement.alt = img.title;
        imgElement.className = 'grid-image';
        imgElement.dataset.index = index;
        
        imgElement.addEventListener('click', () => {
            showImageViewer(category, index);
        });
        
        imageGrid.appendChild(imgElement);
    });
    
    // Show grid and hide viewer
    imageGrid.style.display = 'grid';
    imageViewer.style.display = 'none';
    
    // Set modal title
    imageModalTitle.textContent = title;
    
    // Show modal
    imageModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    console.log('Modal should be visible now'); // Debug log
}

// Show single image in viewer
function showImageViewer(category, index) {
    const images = galleryImages[category] || [];
    const image = images[index];
    
    if (!image) return;
    
    // Set image and title
    modalImage.src = image.src;
    modalImage.alt = image.title;
    imageModalTitle.textContent = image.title;
    
    // Show viewer and hide grid
    imageViewer.style.display = 'block';
    imageGrid.style.display = 'none';
}

// Close image modal
function closeImageModal() {
    imageModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Close about modal
function closeAboutModalFunc() {
    if (aboutModal) {
        aboutModal.classList.remove('show');
        aboutModalDetails.innerHTML = "";
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize about cards
    initializeAboutCards();
    
    // Close about modal when clicking the close button
    if (closeAboutModal) {
        closeAboutModal.addEventListener('click', closeAboutModalFunc);
    }
    
    // Close about modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            closeAboutModalFunc();
        }
    });
    
    // Close image modal when clicking the close button
    if (imageModalClose) {
        imageModalClose.addEventListener('click', closeImageModal);
    }
    
    // Close image modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });
    
    // Close image modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imageModal.classList.contains('show')) {
                closeImageModal();
            } else if (aboutModal && aboutModal.style.display === 'flex') {
                closeAboutModalFunc();
            }
        }
    });
});
