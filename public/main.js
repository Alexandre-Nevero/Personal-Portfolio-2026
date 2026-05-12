// --- Canvas & Neural Network System ---
const canvas = document.getElementById('neural-canvas');
canvas.style.opacity = '0.4'; // Reduced opacity to keep focus on the clean UI
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];
const nodeCount = 100;
let mouse = { x: -1000, y: -1000 };
let scrollPulseX = 0; // Driven by GSAP
let heatmapData = [];
let showHeatmap = false; // Toggled by GSAP in Skills section

// Colors matching CSS variables
const colors = {
    void: '#0a0e17',
    cyan: '#00f0ff',
    magenta: '#ff006e',
    violet: '#8338ec',
    green: '#06d6a0'
};
const palette = [colors.cyan, colors.magenta, colors.violet];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

class Node {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseRadius = Math.random() * 2 + 1;
        this.radius = this.baseRadius;
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse proximity interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
            this.radius = this.baseRadius + (150 - dist) / 15;
        } else {
            this.radius = this.baseRadius;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Pulse brightness if near the scrollPulseX line (the "Forward Pass")
        const distToPulse = Math.abs(this.x - scrollPulseX);
        if (distToPulse < 100) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
        } else {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.radius * 2;
            ctx.shadowColor = this.color;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    }
}

function initNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }
}
initNodes();

// Fetch Basketball Data
fetch('assets/basketball_mock.json')
    .then(res => res.json())
    .then(data => {
        heatmapData = data;
    })
    .catch(err => console.error("Could not load heatmap data:", err));

function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                
                // Connection is brighter if nodes are closer
                const alpha = 1 - (dist / 120);
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function drawHeatmap() {
    if (!showHeatmap || heatmapData.length === 0) return;
    
    heatmapData.forEach(point => {
        const px = (point.x / 100) * width;
        const py = (point.y / 100) * height;
        
        ctx.beginPath();
        ctx.arc(px, py, point.val * 30, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, point.val * 30);
        gradient.addColorStop(0, `rgba(255, 0, 110, ${point.val * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 0, 110, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    drawHeatmap();
    drawConnections();
    
    nodes.forEach(node => {
        node.update();
        node.draw();
    });

    requestAnimationFrame(animate);
}
animate();


// --- GSAP ScrollTrigger Integration ---
gsap.registerPlugin(ScrollTrigger);

// --- 3D Neural Sphere Hero Animation ---
// 1. Initial setup for 3D tilt. Because CSS uses margin:auto for centering, GSAP doesn't fight over x/y translations.
gsap.set(".ring-1", { rotationX: 65, rotationY: 15 });
gsap.set(".ring-2", { rotationX: 75, rotationY: -35 });
gsap.set(".ring-3", { rotationX: 55, rotationY: 60 });

// 2. Autonomous Continuous Rotation
gsap.to(".ring-1", { rotationZ: 360, duration: 20, repeat: -1, ease: "none" });
gsap.to(".ring-2", { rotationZ: -360, duration: 25, repeat: -1, ease: "none" });
gsap.to(".ring-3", { rotationZ: 360, duration: 15, repeat: -1, ease: "none" });

// 3. Pulsing Neurons
gsap.to(".neuron", {
    scale: 1.5,
    boxShadow: "0 0 25px 5px currentColor",
    opacity: 0.6,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    stagger: {
        each: 0.2,
        from: "random"
    }
});

// 4. ScrollTrigger 3D Perspective Shift
gsap.set(".neural-sphere-scene", { transformStyle: "preserve-3d" });
gsap.to(".neural-sphere-scene", {
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1
    },
    rotationX: 45,
    rotationY: -30,
    z: -100, // Push it back in 3D space
    ease: "none"
});

// --- Navigation Scroll Logic ---
let lastScrollY = window.scrollY;
const nav = document.getElementById('main-nav');
gsap.to(nav, { yPercent: 0, duration: 0.5, ease: "power3.out" });

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        gsap.to(nav, { yPercent: -150, duration: 0.3, ease: "power2.in" });
    } else {
        // Scrolling up
        gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out" });
    }
    lastScrollY = window.scrollY;
});

// 1. The "Forward Pass" animation: Moves a pulse line across the canvas based on scroll
gsap.to(window, {
    scrollTrigger: {
        trigger: "#app-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
            // Map scroll progress (0 to 1) to canvas width
            scrollPulseX = self.progress * width;
        }
    }
});

// 2. Animate sections with slight parallax and fade-in
gsap.utils.toArray('.section').forEach(section => {
    // Skip hero section as it has a separate pin animation
    if (section.id === 'home') return;
    
    const panel = section.querySelector('.content-wrapper');
    gsap.fromTo(panel, 
        { y: 100, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "center center",
                scrub: 1
            }
        }
    );
});

// 2.5 Hero Section Parallax (no pin to avoid flex container issues)
gsap.to('#home .hero-grid', {
    y: 150,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: '#home',
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// 2.6 ScrollTrigger Batch for Projects
ScrollTrigger.batch(".project-card", {
    onEnter: batch => {
        gsap.fromTo(batch, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, stagger: 0.15, overwrite: true, duration: 0.8, ease: "power3.out" }
        );
        // Initialize D3 visualizations
        batch.forEach(card => {
            const projectId = card.getAttribute('data-project');
            if (projectId === "1") drawShotMatrix("#viz-shot-matrix");
            if (projectId === "2") drawHarmonicWaves("#viz-harmonic");
            if (projectId === "3") drawNeuralNetwork("#viz-ethical");
        });
    },
    start: "top 85%"
});

// --- D3.js Mini-Visualizations ---
function drawShotMatrix(containerId) {
    const container = d3.select(containerId);
    if (!container.select("svg").empty()) return;

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    
    const svg = container.append("svg").attr("width", width).attr("height", height);

    const data = Array.from({length: 120}, () => {
        const cluster = Math.floor(Math.random() * 3);
        let x, y;
        if (cluster === 0) { x = Math.random() * 0.3 + 0.1; y = Math.random() * 0.4 + 0.1; }
        else if (cluster === 1) { x = Math.random() * 0.4 + 0.5; y = Math.random() * 0.3 + 0.1; }
        else { x = Math.random() * 0.4 + 0.3; y = Math.random() * 0.4 + 0.5; }
        return { x: x * width, y: y * height, val: Math.random() };
    });

    const circles = svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 0)
        .attr("fill", colors.magenta)
        .attr("opacity", 0.6);

    circles.transition()
        .duration(1000)
        .delay((d, i) => i * 8)
        .attr("r", d => d.val * 5 + 2)
        .ease(d3.easeElasticOut);
}

function drawHarmonicWaves(containerId) {
    const container = d3.select(containerId);
    if (!container.select("svg").empty()) return;

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    
    const svg = container.append("svg").attr("width", width).attr("height", height);
    const numBars = 30;
    const barWidth = width / numBars - 2;

    const data = Array.from({length: numBars}, () => Math.random() * height * 0.8);

    const bars = svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => i * (width / numBars))
        .attr("y", height)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", colors.cyan);

    bars.transition()
        .duration(800)
        .delay((d, i) => i * 30)
        .attr("y", d => height - d)
        .attr("height", d => d)
        .ease(d3.easeCubicOut)
        .on("end", function loop() {
            d3.select(this).transition()
                .duration(1000 + Math.random() * 1000)
                .attr("y", d => height - (d * (0.8 + Math.random() * 0.4)))
                .attr("height", d => d * (0.8 + Math.random() * 0.4))
                .on("end", loop);
        });
}

function drawNeuralNetwork(containerId) {
    const container = d3.select(containerId);
    if (!container.select("svg").empty()) return;

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    
    const svg = container.append("svg").attr("width", width).attr("height", height);

    const nodes = Array.from({length: 15}, (_, i) => ({ id: i }));
    const links = Array.from({length: 20}, () => ({
        source: Math.floor(Math.random() * 15),
        target: Math.floor(Math.random() * 15)
    })).filter(l => l.source !== l.target);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(40))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", "rgba(6, 214, 160, 0.3)")
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 0)
        .attr("fill", colors.green);

    node.transition()
        .duration(1000)
        .attr("r", 5)
        .ease(d3.easeBounceOut);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x = Math.max(5, Math.min(width - 5, d.x)))
            .attr("cy", d => d.y = Math.max(5, Math.min(height - 5, d.y)));
    });
}

// 3. Toggle Heatmap in the Skills section
ScrollTrigger.create({
    trigger: "#skills",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => {
        showHeatmap = true;
        document.getElementById('heatmap-legend').style.display = 'block';
    },
    onLeave: () => {
        showHeatmap = false;
        document.getElementById('heatmap-legend').style.display = 'none';
    },
    onEnterBack: () => {
        showHeatmap = true;
        document.getElementById('heatmap-legend').style.display = 'block';
    },
    onLeaveBack: () => {
        showHeatmap = false;
        document.getElementById('heatmap-legend').style.display = 'none';
    }
});


// --- Web Audio API Integration (Opt-in) ---
const audioBtn = document.getElementById('audio-toggle');
let audioCtx;
let masterGain;
let oscillators = [];
let isPlaying = false;

function initAudio() {
    if (audioCtx) return; // Already initialized
    
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.1; // Keep it subtle!
    masterGain.connect(audioCtx.destination);

    // Create a deep, evolving drone
    const freqs = [55, 110, 165]; // A1, A2, E3 (Musical harmony)
    
    freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();

        // Base oscillator
        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.value = freq;

        // LFO for slow pulsing effect
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + (index * 0.02); // Very slow
        
        lfoGain.gain.value = 5; // Pitch modulation amount
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(masterGain);
        
        osc.start();
        lfo.start();
        oscillators.push(osc);
    });
}

audioBtn.addEventListener('click', () => {
    if (!audioCtx) initAudio();

    if (isPlaying) {
        audioCtx.suspend();
        isPlaying = false;
        audioBtn.classList.remove('playing');
        audioBtn.innerHTML = '<span class="status-indicator"></span> Audio: OFF';
    } else {
        audioCtx.resume();
        isPlaying = true;
        audioBtn.classList.add('playing');
        audioBtn.innerHTML = '<span class="status-indicator"></span> Audio: ON';
    }
});
