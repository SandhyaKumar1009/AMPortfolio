// Global variables
let mouseX = 0, mouseY = 0;
let cursorTrails = [];

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
    const text = "Mechanical Engineer & Product Designer";
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
    "CNC Tool Holder & Split Holder": `
      <h2 style="color:#ff6b35;">🚀 Design and Development of CNC Tool Holder & Split Holder</h2>
      <p><strong>Company:</strong> Eppinger Tooling Asia Pvt. Ltd., Coimbatore, India</p>
      <p><strong>Position:</strong> Mechanical Engineer | <strong>Duration:</strong> September 2022 – October 2023</p>
      <h3>🔧 Technologies & Tools Used:</h3>
      <ul>
        <li>CAD Tools: CREO (3D Modelling), AutoCAD (2D Drafting)</li>
        <li>ERP System: ABAS (For BOM and workflow management)</li>
        <li>CNC Technologies: VMC, HMC</li>
        <li>Manufacturing Methods: Forging, Sawing, Heat Treatment (Case hardening, Stress relief), Precision CNC Machining, Grinding, Drilling, Milling</li>
        <li>Quality & Testing Tools: Metrology Instruments, Runout inspection tools, GD&T practices</li>
      </ul>
      <h3>🎓 Engineering Topics Applied:</h3>
      <ul>
        <li>Computer-Aided Design (CAD)</li>
        <li>Manufacturing Process Optimization</li>
        <li>Geometric Dimensioning & Tolerancing (GD&T)</li>
        <li>Material Selection & Heat Treatment</li>
        <li>CNC Programming Logic (G-Code, M-Code Planning)</li>
        <li>Quality Control & Inspection Techniques</li>
        <li>Project & Team Management</li>
      </ul>
      <h3>🌟 Project Highlights:</h3>
      <ul>
        <li>Converted traditional single-unit tool holders into a two-part system (Housing + Shaft), enabling improved tolerance management and cost-effective production.</li>
        <li>Developed detailed process guide cards and stage drawings, selecting raw materials based on machinability and performance.</li>
        <li>Reduced waste by choosing forged over bright rods, and designed custom fixtures for clamping to reduce tolerance errors.</li>
        <li>Ran multiple trials, recorded operation times, machining efficiency, and tolerance performance, and compared new assembly output with traditional tool holders.</li>
        <li>Collaborated with QA team to verify dimensional accuracy and implemented mid-process and post-process quality checks.</li>
      </ul>
      <h3>🧰 Challenges Overcome:</h3>
      <ul>
        <li>Resolved tolerance mismatches in assembly via fixture innovation.</li>
        <li>Reduced runout in shaft-housing mating by refining clamping strategy.</li>
        <li>Managed production delays through load-sharing across two ETA plants.</li>
        <li>Optimized material procurement and reduced machining time by switching to forged parts.</li>
      </ul>
      <h3>🧬 Project Management & Leadership:</h3>
      <ul>
        <li>Led cross-functional team through all project stages, created Gantt charts, tracked milestones, and delegated design and fabrication tasks.</li>
        <li>Maintained coordination across departments: Design, QA, Procurement, and Production.</li>
        <li>Ensured documentation and ERP (ABAS) integration for BOM and process flows.</li>
      </ul>
      <h3>📊 Results & Takeaways:</h3>
      <ul>
        <li>Achieved reduced machining cost and cycle time.</li>
        <li>Enhanced performance and stability of CNC tool holders.</li>
        <li>Learned deep insights into tolerance management and fixture design.</li>
        <li>Delivered a scalable and industry-ready solution that aligned with ISO & DIN standards.</li>
      </ul>
      <div class="confidential-warning">
        <p style="color: #ff6b35; font-weight: bold; text-align: center; margin: 2rem 0 1rem 0; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3);">
          ⚠️ CONFIDENTIAL CONTENT - Images are intentionally blurred for privacy and security purposes
        </p>
      </div>
      <div class="project-image-container">
    <img src="Screenshot 2025-07-31 221904.png" alt="CNC Tool Holder Design" class="project-detail-image">
</div>
      <div class="project-image-container">
    <img src="Screenshot 2025-07-31 221934.png" alt="CNC Tool Holder Components" class="project-detail-image">
</div>
       <div class="project-image-container">
    <img src="Screenshot 2025-07-31 221954.png" alt="CNC Tool Holder in Action" class="project-detail-image">
</div>
      <div class="project-image-container">
    <img src="Screenshot 2025-07-31 222038.png" alt="Cycloidal Gearbox Design" class="project-detail-image">
</div>
    `,

    "Cycloidal Gearbox": `
      <h2 style="color:#ff6b35;">🚀 Design and Development of Cycloidal Gearbox for CNC Speed Reduction</h2>
      
      <p><strong>Company:</strong> Eppinger Tooling Asia Pvt. Ltd., Coimbatore, India</p>
      <p><strong>Position:</strong> Mechanical Engineer | <strong>Duration:</strong> January 2022 – July 2022</p>
      <h3>🔧 Technologies & Tools Used:</h3>
      <ul>
        <li>CAD Tools: CREO (3D Modeling), AutoCAD (2D Drafting)</li>
        <li>ERP System: ABAS for BOM and workflow</li>
        <li>CNC Machining: VMC, HMC</li>
        <li>Manufacturing Techniques: Sawing, Forging, Rough Turning, Heat Treatment (Case Hardening, Stress Relief), Gear Calculation and Assembly, Grinding (Cylindrical/Surface)</li>
        <li>Quality & Testing: Metrology Instruments, Quality Control Reports, Guide Cards for Process Tracking</li>
        
      </ul>
      <h3>🎓 Engineering Topics Applied:</h3>
      <ul>
        <li>Cycloidal Gear Design & Motion Analysis</li>
        <li>CAD Design and Tolerance Evaluation (ISO & DIN standards)</li>
        <li>BOM Preparation & ERP Integration</li>
        <li>CNC Programming (G-codes, M-codes coordination)</li>
        <li>Fixture and Clamping Device Design</li>
        <li>Quality Assurance and Testing</li>
      </ul>
      <h3>🌟 Project Highlights:</h3>
      <ul>
        <li>Introduced Cycloidal Gearbox as a solution to backlash and inefficiencies in traditional gear systems used in CNC machines, demonstrating smoother torque transmission and improved torque-to-weight ratio.</li>
        <li>Created 3D/2D models optimized for lobe design, load transfer, and material selection, using theoretical modeling to predict performance before prototype fabrication.</li>
        <li>Developed custom guide cards with detailed operations and time logging, and strategically selected between sawing, forging, or pre-turned blanks based on machine feasibility.</li>
        <li>Switched to cut-bits over rods to minimize material waste, and integrated fixture-based clamping for runout control and assembly alignment.</li>
        <li>Conducted lab-based evaluations of noise levels, torque output, and assembly precision, identifying fitting issues and addressing tolerance mismatches with creative adjustments.</li>
      </ul>
      <h3>🧰 Challenges Overcome:</h3>
      <ul>
        <li>Balanced between black rods and bright rods to control machining margin and cost.</li>
        <li>Solved runout issues by altering clamping methods and redesigning fixture supports.</li>
        <li>Offloaded machine load by collaborating with vendors and switching to external processes when required.</li>
      </ul>
      <h3>🧬 Project Management & Leadership:</h3>
      <ul>
        <li>Developed Gantt charts for project scheduling, delegated design and fabrication tasks among the team, and maintained coordination between design, QA, procurement, and production teams.</li>
        <li>Assisted team in report writing and document preparation post-project.</li>
      </ul>
      <h3>📊 Results & Learnings:</h3>
      <ul>
        <li>Delivered a fully functional Cycloidal Gearbox prototype with proven CNC application efficiency.</li>
        <li>Enhanced understanding of gearbox tolerance handling, clamping, and assembly alignment.</li>
        <li>Achieved better part precision through trial-and-error methodology and quality report analysis.</li>
        <li>Contributed to reduced operational costs and manufacturing time for future product lines.</li>
      </ul>
      <div class="confidential-warning">
        <p style="color: #ff6b35; font-weight: bold; text-align: center; margin: 2rem 0 1rem 0; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3);">
          ⚠️ CONFIDENTIAL CONTENT - Images are intentionally blurred for privacy and security purposes
        </p>
      </div>
      <div class="project-image-container">
    <img src="Screenshot 2025-07-31 222949.png" alt="CNC Tool Holder Design" class="project-detail-image">
</div>
      <div class="project-image-container">
    <img src="Screenshot 2025-07-31 223014.png" alt="CNC Tool Holder Components" class="project-detail-image">
</div>
       <div class="project-image-container">
    <img src="Screenshot 2025-07-31 223051.png" alt="CNC Tool Holder in Action" class="project-detail-image">
</div>
    `,
    "Agricultural Sprayer": `
      <h2 style="color:#ff6b35;">🚀 Design and Fabrication of Slider Crank Mechanism-Based Agricultural Sprayer</h2>
      
      <p><strong>University:</strong> Anna University, Chennai</p>
      <p><strong>College:</strong> Sri Eshwar College of Engineering</p>
      <p><strong>Discipline:</strong> B.E. Mechanical Engineering | <strong>Project Period:</strong> December 2019 – March 2020</p>
      <p><strong>Position:</strong> Team Lead</p>
      <h3>🔧 Technologies & Tools Used:</h3>
      <ul>
        <li>Design Software: CREO (CAD modeling of parts and assembly)</li>
        <li>Manufacturing Techniques: Gas and Electric Welding, Drilling, Machining, Fabrication, Sprocket, Chain, Piston Mechanisms</li>
        <li>Mechanism Focus: Slider Crank Mechanism for motion conversion</li>
        <li>Material Selection: Mild Steel (Frame), Polyethylene (Tank)</li>
        <li>Project Management Tool: Gantt Chart (Task planning and timeline tracking)</li>
      </ul>
      <h3>🎓 Engineering Topics Applied:</h3>
      <ul>
        <li>Kinematics of Machinery (Slider Crank Analysis)</li>
        <li>CAD Design and Mechanical Drafting</li>
        <li>Engineering Mechanics and Design Calculations</li>
        <li>Thermodynamics (Nozzle pressure calculations)</li>
        <li>Material Science for component selection</li>
        <li>Transmission system design (wheel-to-crank linkage)</li>
      </ul>
      <h3>🌟 Project Highlights:</h3>
      <ul>
        <li>Solved issues associated with traditional backpack sprayers such as poor capacity, back pain, and inefficiency.</li>
        <li>Developed a mechanically powered pesticide sprayer using a slider crank mechanism, requiring no fuel or electricity for operation.</li>
        <li>Designed crank, sprocket, connecting rod, and mounting system in-house, and integrated height-adjustable spraying nozzles on both sides, covering up to 6 feet spray width via six-nozzle design.</li>
        <li>Increased tank capacity to 16L+, optimized sprocket teeth count for output pressure, and added flow control valves for precision application.</li>
      </ul>
      <h3>🧰 Challenges Overcome:</h3>
      <ul>
        <li>Dealt with tolerance alignment issues in driven sprocket and chain linkage.</li>
        <li>Solved fitting and positioning problems by adjusting connecting rod geometry.</li>
        <li>Prevented over-spraying and minimized waste through controlled valve mechanisms.</li>
        <li>Resolved fabrication issues by using hollow mild steel for weight reduction.</li>
      </ul>
      <h3>🧬 Project Management & Leadership:</h3>
      <ul>
        <li>Created Gantt charts to define timelines and assign responsibilities.</li>
        <li>Distributed fabrication, design, and research tasks equally among team members.</li>
        <li>Coordinated literature reviews and field testing, and led design approvals and component sourcing.</li>
      </ul>
      <h3>📊 Results & Learnings:</h3>
      <ul>
        <li>Delivered a low-cost, efficient, non-electric sprayer suitable for small-scale farmers.</li>
        <li>Developed key technical knowledge in motion mechanisms and agricultural equipment design.</li>
        <li>Gained leadership skills in managing a multidisciplinary student project.</li>
        <li>Understood how field analysis impacts real-world design and usability.</li>
      </ul>
      <div class="confidential-warning">
        <p style="color: #ff6b35; font-weight: bold; text-align: center; margin: 2rem 0 1rem 0; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px; border: 1px solid rgba(255, 107, 53, 0.3);">
          ⚠️ CONFIDENTIAL CONTENT - Images are intentionally blurred for privacy and security purposes
        </p>
      </div>
      <div class="project-image-container">
        <img src="Screenshot 2025-07-31 223813.png" alt="Agricultural Sprayer Design" class="project-detail-image">
      </div>
      <div class="project-image-container">
        <img src="Screenshot 2025-07-31 223307.png" alt="Agricultural Sprayer Components" class="project-detail-image">
      </div>
      <div class="project-image-container">
        <img src="Screenshot 2025-07-31 223417.png" alt="Agricultural Sprayer in Action" class="project-detail-image">
      </div>
      <div class="project-image-container">
        <img src="Screenshot 2025-07-31 223432.png" alt="Agricultural Sprayer Assembly" class="project-detail-image">
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
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🧠 Keywords & Competencies:</h3>
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
        
        <h3 style="color:#00d4ff; margin-top:1.5rem;">🔑 Keywords & Core Competencies:</h3>
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
        
        <h3 style="color:#f7931e; margin-top:1.5rem;">🔑 Keywords & Core Competencies:</h3>
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
        
        <h3 style="color:#ff6b35; margin-top:1.5rem;">🔑 Keywords & Skills Highlighted:</h3>
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
