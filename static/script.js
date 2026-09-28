/* ---------------------------------------------
   3D Hero Animation — safely wrapped so that even
   if it fails, the analyzer below still works.
--------------------------------------------- */
try {
  const canvas = document.getElementById('matchCanvas');
  const stage = canvas.parentElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const centerGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const centerMat = new THREE.MeshBasicMaterial({ color: 0x4EE1D6, wireframe: true });
  const centerNode = new THREE.Mesh(centerGeo, centerMat);
  scene.add(centerNode);

  const centerGlowGeo = new THREE.IcosahedronGeometry(0.6, 1);
  const centerGlowMat = new THREE.MeshBasicMaterial({ color: 0x4EE1D6, transparent: true, opacity: 0.15 });
  scene.add(new THREE.Mesh(centerGlowGeo, centerGlowMat));

  const jobCount = 6;
  const jobNodes = [];
  const lineGroup = new THREE.Group();
  scene.add(lineGroup);

  for (let i = 0; i < jobCount; i++) {
    const angle = (i / jobCount) * Math.PI * 2;
    const radius = 3.4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.6;
    const z = Math.sin(angle * 2) * 1.2;

    const jobGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const matchStrength = 0.3 + Math.random() * 0.7;
    const color = new THREE.Color().lerpColors(
      new THREE.Color(0x2c3a5c),
      new THREE.Color(0xF2A65A),
      matchStrength
    );
    const jobMat = new THREE.MeshBasicMaterial({ color });
    const jobNode = new THREE.Mesh(jobGeo, jobMat);
    jobNode.position.set(x, y, z);
    jobNode.userData.baseAngle = angle;
    jobNode.userData.radius = radius;
    jobNode.userData.matchStrength = matchStrength;
    scene.add(jobNode);
    jobNodes.push(jobNode);

    const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), jobNode.position]);
    const line = new THREE.Line(lineGeo, lineMat);
    lineGroup.add(line);
  }

  const bestMatch = Math.round(Math.max(...jobNodes.map(n => n.userData.matchStrength)) * 100);
  document.getElementById('heroScore').querySelector('.score-num').textContent = bestMatch + '%';

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    centerNode.rotation.y += 0.003;
    centerNode.rotation.x += 0.001;

    jobNodes.forEach((node, i) => {
      const angle = node.userData.baseAngle + t;
      const radius = node.userData.radius;
      node.position.x = Math.cos(angle) * radius;
      node.position.y = Math.sin(angle) * radius * 0.6;
      node.position.z = Math.sin(angle * 2 + i) * 1.2;

      const line = lineGroup.children[i];
      const positions = line.geometry.attributes.position;
      positions.setXYZ(1, node.position.x, node.position.y, node.position.z);
      positions.needsUpdate = true;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = stage.clientWidth / stage.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(stage.clientWidth, stage.clientHeight);
  });
} catch (err) {
  console.warn("3D animation load nahi ho paayi, lekin analyzer normally kaam karega:", err);
}


/* ---------------------------------------------
   Resume <-> Job Description matching logic
   (Ye hamesha chalega, chahe upar wala 3D animation
   fail ho jaaye)
--------------------------------------------- */

const SKILL_BANK = [
  "python", "java", "javascript", "react", "node", "sql", "html", "css",
  "machine learning", "deep learning", "nlp", "flask", "django",
  "tensorflow", "pytorch", "excel", "communication", "leadership",
  "project management", "git", "docker", "aws", "data analysis",
  "opencv", "pandas", "numpy", "c++", "figma", "testing"
];

function extractSkills(text) {
  const lower = text.toLowerCase();
  return SKILL_BANK.filter(skill => lower.includes(skill));
}

function renderChips(container, skills, type) {
  container.innerHTML = "";
  if (skills.length === 0) {
    container.innerHTML = '<span class="chip" style="opacity:0.5">Koi nahi mili</span>';
    return;
  }
  skills.forEach(skill => {
    const chip = document.createElement('span');
    chip.className = 'chip' + type;
    chip.textContent = skill;
    container.appendChild(chip);
  });
}

document.getElementById('analyzeBtn').addEventListener('click', () => {
  const resumeText = document.getElementById('resumeInput').value.trim();
  const jdText = document.getElementById('jdInput').value.trim();

  if (!resumeText || !jdText) {
    alert("Pehle resume aur job description dono paste karo.");
    return;
  }

  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);

  const matched = jdSkills.filter(skill => resumeSkills.includes(skill));
  const missing = jdSkills.filter(skill => !resumeSkills.includes(skill));

  const score = jdSkills.length === 0 ? 0 : Math.round((matched.length / jdSkills.length) * 100);

  document.getElementById('resultBox').hidden = false;
  document.getElementById('resultScoreNum').textContent = score + '%';

  const ring = document.getElementById('ringFg');
  const circumference = 327;
  const offset = circumference - (circumference * score) / 100;
  ring.style.strokeDashoffset = offset;

  renderChips(document.getElementById('matchedChips'), matched, 'matched');
  renderChips(document.getElementById('missingChips'), missing, 'missing');

  document.getElementById('resultBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
});