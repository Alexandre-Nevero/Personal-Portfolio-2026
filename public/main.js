// --- Canvas & Neural Network System ---
const canvas = document.getElementById('neural-canvas');
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

// 2. Animate sections fading in
gsap.utils.toArray('.section').forEach(section => {
    const panel = section.querySelector('.glass-panel');
    gsap.from(panel, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// 3. Toggle Heatmap in the Weights & Biases section
ScrollTrigger.create({
    trigger: "#weights-biases",
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
