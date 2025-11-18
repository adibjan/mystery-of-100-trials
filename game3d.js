// ========================================
// Ultra Pro 3D Memory Game - Professional
// ========================================

// ======== SCENE SETUP ========
const canvas = document.getElementById("game-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.Fog(0x0a0a1a, 5, 30);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ======== LIGHTS & NEON GLOW ========
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 2, 100);
pointLight.position.set(0, 10, 10);
scene.add(pointLight);

// Glow effect helper
function createGlowMesh(mesh, color = 0x00ffff) {
    const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6
    });
    const glowMesh = new THREE.Mesh(mesh.geometry.clone(), glowMat);
    glowMesh.scale.multiplyScalar(1.1);
    mesh.add(glowMesh);
}

// ======== PARTICLE SYSTEM ========
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 200;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 5;
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0xffdd33, size: 0.1 });
const particles = new THREE.Points(particleGeometry, particleMaterial);
particles.visible = false;
scene.add(particles);

// ======== GROUND ========
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x111133, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ======== GAME STATE ========
let cards = [];
let firstCard = null, secondCard = null, lockBoard = false;
let numPlayers = 1, players = [], currentPlayer = 0;
let level = 1;

// UI Elements
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const scoreboardDiv = document.getElementById("scoreboard");
const lootBoxDiv = document.getElementById("loot-box");
const openLootBtn = document.getElementById("open-loot-btn");
const lootResultDiv = document.getElementById("loot-result");
const playerCountSelect = document.getElementById("player-count");

// Sounds
const matchSound = document.getElementById("match-sound");
const wrongSound = document.getElementById("wrong-sound");
const rewardSound = document.getElementById("reward-sound");
const winSound = document.getElementById("win-sound");

// ======== START GAME ========
startBtn.addEventListener("click", () => {
    numPlayers = parseInt(playerCountSelect.value);
    players = [];
    for (let i = 0; i < numPlayers; i++) players.push({ score: 0, name: "Player " + (i + 1), level: 1, xp: 0 });
    currentPlayer = 0;
    startScreen.classList.add("hidden");
    scoreboardDiv.classList.remove("hidden");
    backBtn.classList.remove("hidden");
    setupLevel();
    renderScoreboard();
});

// Back to Start
backBtn.addEventListener("click", () => { location.reload(); });

// ======== CARD CREATION ========
const cardGeometry = new THREE.BoxGeometry(1.5, 0.2, 2);
const backMaterial = new THREE.MeshStandardMaterial({ color: 0x3333aa });
const frontMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xff4444 }),
    new THREE.MeshStandardMaterial({ color: 0x44ff44 }),
    new THREE.MeshStandardMaterial({ color: 0x4444ff }),
    new THREE.MeshStandardMaterial({ color: 0xffff44 }),
    new THREE.MeshStandardMaterial({ color: 0xff44ff }),
];

function setupLevel() {
    // Remove previous cards
    cards.forEach(c => scene.remove(c));
    cards = [];
    firstCard = null; secondCard = null; lockBoard = false;

    const numPairs = Math.min(5 + level, 10);
    const values = [];
    for (let i = 1; i <= numPairs; i++) values.push(i, i);
    values.sort(() => Math.random() - 0.5);

    let index = 0;
    const rows = Math.ceil(Math.sqrt(values.length));
    const spacing = 2;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            if (index >= values.length) break;

            const cardGroup = new THREE.Group();
            cardGroup.position.set((j - rows / 2) * spacing, 0, (i - rows / 2) * spacing);
            cardGroup.userData.value = values[index];

            // Back mesh
            const back = new THREE.Mesh(cardGeometry, backMaterial);
            cardGroup.add(back);

            // Front mesh
            const front = new THREE.Mesh(cardGeometry, frontMaterials[values[index] - 1]);
            front.rotation.y = Math.PI;
            front.visible = false;
            cardGroup.add(front);

            // Add Glow
            createGlowMesh(front, 0x00ffff);

            scene.add(cardGroup);
            cards.push(cardGroup);

            index++;
        }
    }
}

// ======== FLIP & MATCH LOGIC ========
function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;

    const back = card.children[0], front = card.children[1];

    // Tween Flip Animation
    new TWEEN.Tween(card.rotation)
        .to({ y: card.rotation.y + Math.PI }, 400)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    back.visible = false;
    front.visible = true;

    if (!firstCard) { firstCard = card; return; }

    secondCard = card;
    lockBoard = true;
    checkMatch();
}

function checkMatch() {
    if (firstCard.userData.value === secondCard.userData.value) {
        matchSound.play();
        players[currentPlayer].score += 10;
        players[currentPlayer].xp += 5;
        updateLevel(players[currentPlayer]);

        // Particle Effect
        particles.position.copy(firstCard.position);
        particles.visible = true;
        setTimeout(() => { particles.visible = false; }, 500);

        setTimeout(() => {
            firstCard.scale.set(0, 0, 0);
            secondCard.scale.set(0, 0, 0);
            resetTurn();
            checkLevelComplete();
        }, 800);
    } else {
        wrongSound.play();
        setTimeout(() => {
            unflip(firstCard);
            unflip(secondCard);
            nextPlayer();
            resetTurn();
        }, 800);
    }
    renderScoreboard();
}

function unflip(card) {
    card.children[0].visible = true;
    card.children[1].visible = false;
}

function resetTurn() { firstCard = null; secondCard = null; lockBoard = false; }
function nextPlayer() { currentPlayer = (currentPlayer + 1) % numPlayers; }
function updateLevel(player) { if (player.xp >= 50) { player.level++; player.xp = 0; } }

// ======== LEVEL COMPLETE & LOOT BOX ========
function checkLevelComplete() {
    const unmatched = cards.filter(c => c.scale.x > 0);
    if (unmatched.length === 0) {
        winSound.play();
        level++;
        lootBoxDiv.classList.remove("hidden");
    }
}

openLootBtn.addEventListener("click", () => {
    const rewards = ["⭐ Star +50", "⏰ Clock +5s", "❤️ Heart +1 Life"];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    lootResultDiv.textContent = reward;
    if (reward.includes("Star")) players[currentPlayer].score += 50;
    rewardSound.play();
    lootBoxDiv.classList.add("hidden");
    setupLevel();
    renderScoreboard();
});

// ======== SCOREBOARD RENDER ========
function renderScoreboard() {
    scoreboardDiv.innerHTML = "";
    players.forEach((p, i) => {
        const div = document.createElement("div");
        div.textContent = `${p.name}: Score ${p.score} | Level ${p.level} | XP ${p.xp} ${i===currentPlayer ? "⬅ Current": ""}`;
        scoreboardDiv.appendChild(div);
    });
}

// ======== RAYCAST & MOUSE CLICK ========
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards, true);
    if (intersects.length > 0) flipCard(intersects[0].object.parent);
});

// ======== RENDER LOOP ========
function animate(time) {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update(time);
    renderer.render(scene, camera);
}
animate();

// ======== RESIZE HANDLER ========
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ======== ANTI-HACK / BASIC SECURITY ========
Object.freeze(players);
Object.freeze(cards);