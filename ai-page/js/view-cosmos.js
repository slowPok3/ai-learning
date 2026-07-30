// ─────────────────────────────────────────────────────────────────
// VIEW 1: COSMOS
// ─────────────────────────────────────────────────────────────────
const CosmosView = (function () {
    let initialized = false;
    let active = false;             // was the global constellationActive
    let resumeLoop = null;          // was the global resumeConstellationLoop
    let doResize = null;            // was the global resizeConstellationFn

    function build(model, palette) {
        const container = document.getElementById('vector-container');

        // Curriculum → 3D scene graph:
        //   domain  → cluster star  (large sphere at a scattered anchor)
        //   topic   → planet       (orbits the domain star)
        //   subject → moon         (orbits its parent planet)
        // Clusters are THREE.Groups with random tilt; planets/moons use tilted
        // circular paths (tiltX/tiltZ) so orbits read as 3D, not flat rings.

        // Measure the CONTAINER, not the window — so the scene stays correct
        // when the side panel shrinks the view. Returns the live width/height.
        function getContainerSize() {
            const rect = container.getBoundingClientRect();
            // Fallbacks guard against a 0x0 measurement if the view is hidden at init.
            const w = rect.width  || window.innerWidth;
            const h = rect.height || (window.innerHeight - 60);
            return { w, h };
        }

        const scene  = new THREE.Scene();
        const { w: initW, h: initH } = getContainerSize();
        const camera = new THREE.PerspectiveCamera(60, initW / initH, 0.1, 2000);

        const homePosition = { x: 0, y: 100, z: 420 };
        camera.position.set(homePosition.x, homePosition.y, homePosition.z);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(initW, initH);
        // Cap pixel ratio to balance sharpness vs. performance.
        // Mobile screens have very high DPR (often 3+); capping too low looks
        // jagged when zoomed in. 2.5 keeps spheres/halos crisp without the full
        // (expensive) native ratio. Desktop rarely exceeds 2 anyway.
        const isTouch = ('ontouchstart' in window);
        const dprCap  = isTouch ? 2.5 : 2;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping  = true;
        controls.dampingFactor  = 0.05;
        controls.enablePan      = true;
        controls.minDistance    = 40;
        controls.maxDistance    = 1100;

        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const pointLight = new THREE.PointLight(0xffffff, 1.2);
        pointLight.position.set(0, 200, 0);
        scene.add(pointLight);

        // Background starfield (animate layer 0): 1500 points in a large cube,
        // rotated slowly each frame for a parallax "cruising through space" feel.
        const starGeo  = new THREE.BufferGeometry();
        const starVerts = [];
        for (let i = 0; i < 1500; i++) {
            starVerts.push((Math.random() - 0.5) * 1600, (Math.random() - 0.5) * 1600, (Math.random() - 0.5) * 1600);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
        // ── TWINKLE-START: per-star brightness modulation ──────────────────
        // Each star gets a random phase and speed so its brightness oscillates
        // independently. Colors are updated every frame in the animate loop.
        const starColors = new Float32Array(1500 * 3);
        const starPhases = new Float32Array(1500);
        const starSpeeds = new Float32Array(1500);
        for (let i = 0; i < 1500; i++) {
            starColors[i * 3] = 1;                        // R (initial white)
            starColors[i * 3 + 1] = 1;                    // G
            starColors[i * 3 + 2] = 1;                    // B
            starPhases[i] = Math.random() * Math.PI * 2;  // random start angle
            starSpeeds[i] = 0.01 + Math.random() * 0.02;  // fast twinkle rate (for testing)
        }
        starGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        // ── TWINKLE-END ────────────────────────────────────────────────────
        // ── TWINKLE-START: vertexColors replaces hardcoded white ────────────
        const starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.8, transparent: true, opacity: 0.5, vertexColors: true }));
        // ── TWINKLE-END ────────────────────────────────────────────────────
        scene.add(starField);

        // Shooting-star streaks (animate layer 1): a small reusable pool of glowing
        // line segments. Launched at random intervals; pooled to avoid per-spawn GC.
        const STREAK_POOL_SIZE = 5;
        const streaks = [];
        for (let i = 0; i < STREAK_POOL_SIZE; i++) {
            const g = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
            const line = new THREE.Line(g, m);
            line.visible = false;
            // ── STREAK-VARIETY-START: add tailMult & fadeRate to pool init ───
            line.userData = { active: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0,
                tailMult: 3, fadeRate: 0.012 };  // defaults overridden at launch
            // ── STREAK-VARIETY-END ──────────────────────────────────────────
            scene.add(line);
            streaks.push(line);
        }

        // Launch one streak from a random edge, flying across the view.
        function launchStreak() {
            const s = streaks.find(st => !st.userData.active);
            if (!s) return;

            // Spawn far out on a random side, aimed roughly across the scene.
            const spread = 700;
            const startX = (Math.random() - 0.5) * 2 * spread;
            const startY = (Math.random() - 0.5) * spread;
            const startZ = -spread * 0.5 - Math.random() * spread;   // start behind
            s.userData.pos.set(startX, startY, startZ);

            // ── STREAK-VARIETY-START: randomised speed & trajectory ───────
            const speed = 4 + Math.random() * 10;                    // wider range: 4-14
            const angle = Math.random() * Math.PI * 2;               // random direction in XY plane
            const upwardBias = (Math.random() - 0.5) * 0.6;         // slight Y drift tendency
            s.userData.vel.set(
                Math.cos(angle) * speed * 0.5,                        // random XY direction
                Math.sin(angle) * speed * 0.4 + upwardBias * speed,  // biased upward or downward
                speed * (0.3 + Math.random() * 0.7)                  // Z: 30-100% of full speed
            );
            s.userData.tailMult = 2 + Math.random() * 3;             // variable tail length (2-5x)
            s.userData.fadeRate = 0.008 + Math.random() * 0.010;     // variable fade (0.008-0.018)
            // ── STREAK-VARIETY-END ────────────────────────────────────────
            s.userData.life = 1;
            s.userData.active = true;
            s.visible = true;
        }

        // Schedule launches at randomized intervals (only while view is active).
        let nextStreakAt = 0;   // a "time" counter threshold (time++ each frame)
        function scheduleNextStreak() {
            // ~4–9 seconds at ~60fps → 240–540 frames. Tune MIN/RANGE below.
            nextStreakAt = time + 240 + Math.floor(Math.random() * 300);
        }
        // ────────────────────────────────────────────────────────────────

        // ── HUE-SHIFT-START: store original HSL for per-frame colour cycling ──
        function createNodeMesh(size, colorHex, emissiveHex, isMoon = false) {
            // Detail scaled by node size: tiny moons don't need 32x32 polygons
            const seg  = isMoon ? 12 : 20;
            const geo  = new THREE.SphereGeometry(size, seg, seg);
            const mat  = new THREE.MeshPhongMaterial({ color: colorHex, emissive: emissiveHex, emissiveIntensity: 0.5, shininess: 80 });
            // Store original HSL so animate() can shift hue without accumulating drift
            const _tmp = new THREE.Color(colorHex);
            const _hsl = {};
            _tmp.getHSL(_hsl);
            mat.userData = { origH: _hsl.h, origS: _hsl.s, origL: _hsl.l };
            const mesh    = new THREE.Mesh(geo, mat);
            const haloGeo = new THREE.SphereGeometry(size * (isMoon ? 2.5 : 1.6), 16, 16);
            const haloMat = new THREE.MeshBasicMaterial({ color: emissiveHex, transparent: true, opacity: isMoon ? 0.25 : 0.15 });
            mesh.add(new THREE.Mesh(haloGeo, haloMat));
            return mesh;
        }
        // ── HUE-SHIFT-END ────────────────────────────────────────────────────

        function createSprite(text, fontSize, bgColor) {
            const canvas = document.createElement('canvas');
            const ctx    = canvas.getContext('2d');
            ctx.font     = `bold ${fontSize}px Segoe UI, sans-serif`;
            const w      = ctx.measureText(text).width;
            canvas.width  = w + 30;
            canvas.height = fontSize + 20;
            ctx.font      = `bold ${fontSize}px Segoe UI, sans-serif`;
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
            ctx.fill();
            ctx.fillStyle    = '#ffffff';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 15, canvas.height / 2);
            const tex    = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
            sprite.scale.set(canvas.width / 8, canvas.height / 8, 1);
            return sprite;
        }

        const domainNames  = model.domains.map(d => d.name);

        // ── Unified cosmos placement (one helper, one dial) ────────────────
        // `spread` blends the view from "field ahead" to "surround":
        //   ~0.5 = tight field ahead      ~1.0 = forward hemisphere
        //   ~1.5 = wide / partly around    2.0 = full 360° surround
        // Everything else (depth range, no-collision spacing) is passed in.
        function computeClusterPositions(count, opts) {
            const spread        = opts.spread;
            const nearDist      = opts.nearDist;
            const farDist       = opts.farDist;
            const minSeparation = opts.minSeparation;
            const verticalScale = (opts.verticalScale != null) ? opts.verticalScale : 0.7;

            function randomDirection() {
                const theta  = 2 * Math.PI * Math.random();      // full 360° around the forward axis
                const cosPhi = 1 - Math.random() * spread;        // the ahead↔surround dial
                const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
                return {
                    x: sinPhi * Math.cos(theta),
                    y: sinPhi * Math.sin(theta) * verticalScale,
                    z: -cosPhi                                 // -Z = ahead of the camera
                };
            }

            const positions = [];
            for (let p = 0; p < count; p++) {
                let placed = null;
                for (let attempt = 0; attempt < 200; attempt++) {
                    const dir  = randomDirection();
                    const dist = nearDist + Math.random() * (farDist - nearDist);
                    const cand = { x: dir.x * dist, y: dir.y * dist, z: dir.z * dist };
                    const ok = positions.every(pos => {
                        const dx = pos.x - cand.x, dy = pos.y - cand.y, dz = pos.z - cand.z;
                        return Math.sqrt(dx*dx + dy*dy + dz*dz) >= minSeparation;
                    });
                    if (ok) { placed = cand; break; }
                }
                if (!placed) {   // extremely crowded fallback — push farther, still no overlap
                    const dir = randomDirection();
                    const dist = farDist + minSeparation * positions.length * 0.15;
                    placed = { x: dir.x * dist, y: dir.y * dist, z: dir.z * dist };
                }
                positions.push(placed);
            }
            return positions;
        }


        // Cosmos sizing + no-collision spacing (scales with domain count).
        const N = domainNames.length;
        const MAX_CLUSTER_REACH = 90;    // keep in sync with pOrbit below
        const MAX_CLUSTER_DRIFT = 35;    // keep in sync with amp below
        const SAFETY_GAP        = 100;
        const minSeparation     = 2 * (MAX_CLUSTER_REACH + MAX_CLUSTER_DRIFT) + SAFETY_GAP;

        const scatterScale = Math.cbrt(N / 10);
        const nearDist = Math.max(150, minSeparation * 0.9) * scatterScale;
        const farDist  = Math.max(420, minSeparation * 2.4) * scatterScale;

        // ── THE ONE DIAL: change COSMOS_SPREAD to shift the whole view ──
        // 0.5 ≈ field ahead   •   1.2 ≈ current (wide forward fan)   •   2.0 ≈ full surround
        const COSMOS_SPREAD = 1.2;
        const clusterPositions = computeClusterPositions(N, {
            spread: COSMOS_SPREAD,
            nearDist: nearDist,
            farDist: farDist,
            minSeparation: minSeparation,
            verticalScale: 0.7
        });

        // ── HUE-SHIFT-START: array to track planet meshes for colour cycling ──
        const hueShiftTargets = [];
        // ── HUE-SHIFT-END ────────────────────────────────────────────────────
        const orbitPivots  = [];
        const nodeMeshes   = [];
        let   hoveredMesh  = null;

        domainNames.forEach((domainName, i) => {
            const clusterColor = palette[i % palette.length];
            const clusterGroup = new THREE.Group();

            // Give each star system its own 3D orientation so they don't all look
            // parallel / identically aligned. A unique tilt per cluster adds variety.
            clusterGroup.rotation.x = (Math.random() - 0.5) * Math.PI;   // ±90° tilt
            clusterGroup.rotation.z = (Math.random() - 0.5) * Math.PI;
            clusterGroup.rotation.y = Math.random() * Math.PI * 2;       // random spin

            // Anchor from computeClusterPositions (tuned via COSMOS_SPREAD).
            const bx0 = clusterPositions[i].x;
            const by0 = clusterPositions[i].y;
            const bz0 = clusterPositions[i].z;

            // Per-cluster motion state (updated every frame in animate()):
            //   amp* + sp* + ph*   → sinusoidal sway around the anchor (by0 fixed on Y)
            //   cosmicAngle/Radius → distance preserved while orbiting (0,0,0)
            //   cosmicSpeed        → drift speed around the cosmic center
            //   rotSpeedY          → slow spin of the cluster group itself
            clusterGroup.userData = {
                bx0, by0, bz0,
                ampX: 8 + Math.random() * 10,
                ampY: 6 + Math.random() * 8,
                ampZ: 8 + Math.random() * 10,


                spX:  (0.0004 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1),
                spY:  (0.0003 + Math.random() * 0.0005) * (Math.random() < 0.5 ? 1 : -1),
                spZ:  (0.0004 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1),
                phX:  Math.random() * Math.PI * 2,
                phY:  Math.random() * Math.PI * 2,
                phZ:  Math.random() * Math.PI * 2,
                // ── CLUSTER-SPIN-START: rotation speed inversely tied to distance ──
                rotSpeedY: (() => {
                    const baseSpin = 0.003; // tune: ~0.0006–0.003 for slow-to-fast spin
                    const r = Math.sqrt(bx0 * bx0 + bz0 * bz0);         // distance from center
                    const distFactor = 1 - Math.min(r / 500, 0.9);       // 0.1 (far) → 1.0 (close)
                    return baseSpin * distFactor * (Math.random() < 0.5 ? 1 : -1);
                })(),
                // ── CLUSTER-SPIN-END ──────────────────────────────────────────────

                // Slow orbital drift around the cosmic center — each system orbits
                // (0,0,0) at its own pace so the cosmos slowly churns as a whole.
                cosmicAngle: Math.atan2(bz0, bx0),                 // current angle around center
                cosmicRadius: Math.sqrt(bx0 * bx0 + bz0 * bz0),    // distance from center (preserved)
                cosmicSpeed: 0.0001 * (Math.random() < 0.5 ? 1 : -1),   // tune: ~0.00006–0.00014 for gentle drift
                type: 'cluster'
            };

            const domainMesh = createNodeMesh(9, clusterColor.hex, clusterColor.em);
            domainMesh.userData = { label: domainName, type: 'domain' };
            clusterGroup.add(domainMesh);
            nodeMeshes.push(domainMesh);

            const dSprite = createSprite(domainName, 44, clusterColor.rgba);
            dSprite.position.set(0, 20, 0);
            domainMesh.add(dSprite);

            const subjects = model.domains[i].subjects;

            // Nested orbits: each subject is a planet group circling its domain star;
            // each topic is a moon circling its planet. orbitR sets radius; speed
            // sign alternates by index for counter-rotation; tiltX/tiltZ tilt the plane.
            subjects.forEach((subject, j) => {
                const planetGroup = new THREE.Group();
                const baseSpeed   = 0.35 - j * 0.04;
                const pSpeed      = Math.max(0.08, baseSpeed) * (j % 2 === 0 ? 1 : -1) / 300;
                const pAngle0     = (j / subjects.length) * Math.PI * 2;
                const pOrbit      = 35 + j * 8 + Math.random() * 8;

                const pTiltX = (Math.random() - 0.5) * 0.6;
                const pTiltZ = (Math.random() - 0.5) * 0.3;

                planetGroup.userData = {
                    orbitR: pOrbit, angle: pAngle0, speed: pSpeed,
                    tiltX: pTiltX, tiltZ: pTiltZ,
                    type: 'planet'
                };

                const topicMesh      = createNodeMesh(5, clusterColor.hex, clusterColor.em);
                topicMesh.userData   = { label: subject.name, type: 'subject' };
                // ── HUE-SHIFT-START: register planet for colour cycling ────────
                hueShiftTargets.push({
                    mesh: topicMesh,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.0003 + Math.random() * 0.0005   // slow hue drift
                });
                // ── HUE-SHIFT-END ────────────────────────────────────────────
                planetGroup.add(topicMesh);
                nodeMeshes.push(topicMesh);

                const tSprite = createSprite(subject.name, 32, clusterColor.rgba);
                tSprite.position.set(0, 11, 0);
                tSprite.visible = false;
                topicMesh.add(tSprite);

                const orbitPts  = new THREE.Path().absarc(0, 0, pOrbit, 0, Math.PI * 2).getSpacedPoints(64);
                const orbitGeo  = new THREE.BufferGeometry().setFromPoints(orbitPts);
                const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({ color: clusterColor.hex, transparent: true, opacity: 0.15 }));
                orbitLine.rotation.x = Math.PI / 2 + pTiltX;
                orbitLine.rotation.z = pTiltZ;
                clusterGroup.add(orbitLine);

                subject.topics.forEach((sub, k) => {
                    const moonGroup = new THREE.Group();
                    const mSpeed  = (0.55 + k * 0.08) * (k % 2 === 0 ? 1 : -1) / 360;
                    const mAngle0 = (k / subject.topics.length) * Math.PI * 2;
                    const mOrbit  = 14 + k * 3 + Math.random() * 4;

                    const mTiltX  = (Math.random() - 0.5) * 0.45;
                    const mTiltZ  = (Math.random() - 0.5) * 0.2;

                    moonGroup.userData = {
                        orbitR: mOrbit, angle: mAngle0, speed: mSpeed,
                        tiltX: mTiltX, tiltZ: mTiltZ,
                        type: 'moon'
                    };

                    const subMesh    = createNodeMesh(2.5, clusterColor.hex, clusterColor.em, true);
                    subMesh.userData = { label: sub.name, type: 'topic', fullObj: sub, color: clusterColor.base };
                    moonGroup.add(subMesh);
                    nodeMeshes.push(subMesh);

                    const sSprite = createSprite(sub.name, 24, 'rgba(0,0,0,0.6)');
                    sSprite.position.set(0, 6, 0);
                    sSprite.visible = false;
                    subMesh.add(sSprite);

                    const mOrbitPts  = new THREE.Path().absarc(0, 0, mOrbit, 0, Math.PI * 2).getSpacedPoints(32);
                    const mOrbitGeo  = new THREE.BufferGeometry().setFromPoints(mOrbitPts);
                    const mOrbitLine = new THREE.Line(mOrbitGeo, new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.2 }));
                    mOrbitLine.rotation.x = Math.PI / 2 + mTiltX;
                    mOrbitLine.rotation.z = mTiltZ;
                    planetGroup.add(mOrbitLine);
                    planetGroup.add(moonGroup);
                });

                clusterGroup.add(planetGroup);
            });

            orbitPivots.push(clusterGroup);
            scene.add(clusterGroup);
        });

        const raycaster = new THREE.Raycaster();
        const mouse     = new THREE.Vector2();
        const tooltip   = document.getElementById('tooltip');

        container.addEventListener('mousemove', e => {
            // Use the cached rect (refreshed on resize) instead of measuring every frame.
            mouse.x =  ((e.clientX - cachedRect.left) / cachedRect.width)  * 2 - 1;
            mouse.y = -((e.clientY - cachedRect.top)  / cachedRect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);


            const hits = raycaster.intersectObjects(nodeMeshes);

            if (hoveredMesh) {
                if (hoveredMesh.userData.type !== 'domain') {
                    const sprite = hoveredMesh.children.find(c => c.type === 'Sprite');
                    if (sprite) sprite.visible = false;
                }
                hoveredMesh = null;
            }

            if (hits.length) {
                hoveredMesh = hits[0].object;
                const ud    = hoveredMesh.userData;
                const prefix = ud.type === 'domain'  ? '🌟 ' : ud.type === 'subject' ? '🪐 ' : '🌙 ';
                tooltip.innerHTML      = prefix + escapeHtml(ud.label);
                tooltip.style.left     = (e.clientX + 14) + 'px';
                tooltip.style.top      = (e.clientY + 14) + 'px';
                tooltip.style.display  = 'block';

                container.style.cursor = ud.type === 'subject' ? 'pointer' : 'default';

                if (ud.type !== 'domain') {
                    const sprite = hoveredMesh.children.find(c => c.type === 'Sprite');
                    if (sprite) sprite.visible = true;
                }
            } else {
                tooltip.style.display  = 'none';
                container.style.cursor = 'default';
            }
        });

        // Cosmos view is intentionally ambient: hover shows the name (handled in
        // mousemove). Clicking a moon does NOT open the side panel here — detail
        // views (Explorer / Mission Control) are where subjects are inspected.
        // (Click handler removed by design.)

        container.addEventListener('dblclick', e => {
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(nodeMeshes);
            if (!hits.length) {
                const startPos = camera.position.clone();
                const target   = new THREE.Vector3(homePosition.x, homePosition.y, homePosition.z);
                let   t        = 0;
                function resetAnim() {
                    t += 0.04;
                    camera.position.lerpVectors(startPos, target, Math.min(t, 1));
                    controls.update();
                    if (t < 1) requestAnimationFrame(resetAnim);
                }
                resetAnim();
            }
        });

        // ── Mobile: tap a moon to reveal its name (no hover on touch) ──
        // Shows the tooltip at the tap point, then auto-hides after a moment.
        let touchTooltipTimer = null;
        container.addEventListener('touchstart', e => {
            if (e.touches.length !== 1) return;   // ignore pinch/multi-touch (that's zoom)

            const tx = e.touches[0].clientX;
            const ty = e.touches[0].clientY;
            mouse.x =  ((tx - cachedRect.left) / cachedRect.width)  * 2 - 1;
            mouse.y = -((ty - cachedRect.top)  / cachedRect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(nodeMeshes);

            if (hits.length) {
                const ud = hits[0].object.userData;
                const prefix = ud.type === 'domain' ? '🌟 ' : ud.type === 'subject' ? '🪐 ' : '🌙 ';
                tooltip.innerHTML     = prefix + escapeHtml(ud.label);
                tooltip.style.left    = (tx + 14) + 'px';
                tooltip.style.top     = (ty + 14) + 'px';
                tooltip.style.display = 'block';

                // Auto-dismiss after 2s (no "mouse-away" on touch to hide it).
                clearTimeout(touchTooltipTimer);
                touchTooltipTimer = setTimeout(() => { tooltip.style.display = 'none'; }, 2000);
            } else {
                tooltip.style.display = 'none';   // tapped empty space → hide
            }
        }, { passive: true });

        const hint = document.getElementById('hint');
        if ('ontouchstart' in window) {
            hint.textContent = '👆 Tap for names • Pinch to zoom • Drag to rotate';
        }
        setTimeout(() => {
            hint.style.transition = 'opacity 1.5s ease';
            hint.style.opacity    = '0';
            setTimeout(() => { hint.style.pointerEvents = 'none'; }, 1500);
        }, 4000);

        let time = 0;
        let constellationLoopId = null;
        function animate() {
            // Stop the loop entirely when this view isn't visible (saves GPU/battery).
            if (!active) { constellationLoopId = null; return; }
            constellationLoopId = requestAnimationFrame(animate);

            // Per-frame animation layers:
            //   0 — starField rotation (parallax background)
            //   1 — shooting-star spawn + streak update
            //   2 — cluster cosmic drift (orbit around origin)
            //   3 — cluster sinusoidal sway + group spin
            //   4 — planet orbits (topics around domain)
            //   5 — moon orbits (subjects around topic)

            time++; /// <-- COMMENT THIS OUT TO FREEZE THE VIEW (for screenshots, etc.)

            // Layer 1: constant gentle drift — a slow "cruising through space" feel.
            // Tune the rotation multipliers below; 0.00008 was imperceptible.
            starField.rotation.y = time * 0.00025;
            starField.rotation.x = time * 0.00010;   // slight cross-axis = more organic

            // ── TWINKLE-START: update per-star brightness each frame ───────
            // Brightness oscillates: 0.1 (dim) ↔ 1.0 (full) via sine wave.
            // starPhases[i] and starSpeeds[i] are set once at init (Change A).
            const colAttr = starField.geometry.getAttribute('color');
            const colArr = colAttr.array;
            for (let i = 0; i < 1500; i++) {
                const b = 0.1 + 0.9 * (0.5 + 0.5 * Math.sin(time * starSpeeds[i] + starPhases[i]));
                colArr[i * 3]     = b;   // R
                colArr[i * 3 + 1] = b;   // G
                colArr[i * 3 + 2] = b;   // B
            }
            colAttr.needsUpdate = true;
            // ── TWINKLE-END ────────────────────────────────────────────────

            if (time >= nextStreakAt) {
                launchStreak();
                scheduleNextStreak();
            }

            for (const s of streaks) {
                if (!s.userData.active) continue;
                const ud = s.userData;
                ud.pos.add(ud.vel);

                // ── STREAK-VARIETY-START: use per-streak fade rate ──────
                ud.life -= ud.fadeRate;
                // ── STREAK-VARIETY-END ──────────────────────────────────

                // The line is drawn from current pos to a point "behind" it,
                // creating the tail in the direction of travel.
                // ── STREAK-VARIETY-START: use per-streak tail length ────
                const tail = ud.pos.clone().sub(ud.vel.clone().multiplyScalar(ud.tailMult));
                // ── STREAK-VARIETY-END ──────────────────────────────────
                const positions = s.geometry.attributes.position.array;
                positions[0] = ud.pos.x;  positions[1] = ud.pos.y;  positions[2] = ud.pos.z;
                positions[3] = tail.x;    positions[4] = tail.y;    positions[5] = tail.z;
                s.geometry.attributes.position.needsUpdate = true;

                s.material.opacity = Math.max(0, ud.life) * 0.9;

                // ── STREAK-VARIETY-START: wider deactivation range ──────
                if (ud.life <= 0 || ud.pos.z > 600 || ud.pos.z < -1200) {
                // ── STREAK-VARIETY-END ──────────────────────────────────
                    ud.active = false;
                    s.visible = false;
                }
            }

            orbitPivots.forEach(cl => {
                const ud = cl.userData;

                // Layer 1 — slow orbital drift: advance this system's angle around
                // the cosmic center, then recompute its anchor (radius unchanged).
                ud.cosmicAngle += ud.cosmicSpeed;
                const driftX = Math.cos(ud.cosmicAngle) * ud.cosmicRadius;
                const driftZ = Math.sin(ud.cosmicAngle) * ud.cosmicRadius;

                // Layer 2 — gentle sway: wobble around the (now drifting) anchor.
                cl.position.x = driftX + Math.sin(time * ud.spX + ud.phX) * ud.ampX;
                cl.position.y = ud.by0 + Math.cos(time * ud.spY + ud.phY) * ud.ampY;
                cl.position.z = driftZ + Math.sin(time * ud.spZ + ud.phZ) * ud.ampZ;
                cl.rotation.y += ud.rotSpeedY;

                cl.children.forEach(child => {
                    if (!child.userData) return;
                    if (child.userData.type === 'planet') {
                        child.userData.angle += child.userData.speed;

                        const a    = child.userData.angle;
                        const r    = child.userData.orbitR;
                        const tx   = child.userData.tiltX;

                        child.position.x = Math.cos(a) * r;
                        child.position.y = Math.sin(a) * r * Math.sin(tx);
                        child.position.z = Math.sin(a) * r * Math.cos(tx);

                        child.children.forEach(grandchild => {
                            if (!grandchild.userData) return;
                            if (grandchild.userData.type === 'moon') {
                                grandchild.userData.angle += grandchild.userData.speed;
                                const ma   = grandchild.userData.angle;
                                const mr   = grandchild.userData.orbitR;
                                const mtx  = grandchild.userData.tiltX;

                                grandchild.position.x = Math.cos(ma) * mr;
                                grandchild.position.y = Math.sin(ma) * mr * Math.sin(mtx);
                                grandchild.position.z = Math.sin(ma) * mr * Math.cos(mtx);
                            }
                        });
                    }
                });
            });

            // ── HUE-SHIFT-START: subtle per-planet hue cycling ───────────────
            // Each planet's colour shifts ±4% hue around its original, oscillating
            // via sine wave. Phase and speed are set at creation time.
            for (const h of hueShiftTargets) {
                const m = h.mesh.material;
                if (!m.userData) continue;
                const d = m.userData;
                const hueOffset = 0.04 * Math.sin(time * h.speed + h.phase);  // ±4% hue
                m.color.setHSL(
                    (d.origH + hueOffset) % 1,
                    d.origS,
                    d.origL
                );
            }
            // ── HUE-SHIFT-END ────────────────────────────────────────────────

            controls.update();
            renderer.render(scene, camera);
        }
        // Expose a resume function so activate() can restart the loop
        // when the user returns to the constellation view.
        resumeLoop = function () {
            if (active && constellationLoopId === null) {
                animate();
            }
        };

        // Schedule the first shooting star, then start the loop.
        scheduleNextStreak();

        // Start it now (build() only runs when the view is first activated).
        active = true;
        animate();

        // Cache the canvas rect so raycasting doesn't measure the DOM every frame.
        // We only refresh it when the size can actually change (resize / re-fit).
        let cachedRect = container.getBoundingClientRect();

        // Recompute from the container so resizes (and panel re-fits) are handled.
        function resizeConstellation() {
            const { w, h } = getContainerSize();
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            cachedRect = container.getBoundingClientRect();   // refresh cache after layout change
        }
        window.addEventListener('resize', resizeConstellation);

        // Expose it so Panel can trigger a re-fit when it opens/closes.
        doResize = resizeConstellation;
    }

    return {
        activate(model, palette) {
            if (!initialized) { build(model, palette); initialized = true; }
            active = true;
            if (resumeLoop) resumeLoop();
        },
        deactivate() { active = false; },
        resize() { if (doResize) doResize(); }
    };
})();
