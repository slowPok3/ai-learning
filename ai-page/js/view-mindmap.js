// ─────────────────────────────────────────────────────────────────
// VIEW 2: KNOWLEDGE WEB
// ─────────────────────────────────────────────────────────────────
const MindmapView = (function () {
    let initialized = false;
    let networkInstance = null;
    let mapAnimationProfile = 'pulse';
    let mindmapLoopId = null;
    let pulseProgress = 0;
    let selectedMindmapNodeId = null;

    function build(model, palette) {
        const container = document.getElementById('mindmap-container');

        // Builds a vis-network graph from the shared curriculum model:
        //   title   → center hexagon (id 0)
        //   domain  → star shape, solid edge from center
        //   subject → dot, solid edge from domain
        //   topic   → small dot, dashed edge from subject

        const nodesDataSet = new vis.DataSet([
            { id: 0, label: model.title, shape: "hexagon", size: 30, color: { background: "#38bdf8", border: "#0284c7" }, font: { color: "white", size: 16, bold: true }, _type: "center" }
        ]);

        const edges = [];
        let nodeId = 1;

        model.domains.forEach((domain, domainIdx) => {
            const domainColor = palette[domainIdx % palette.length].base;
            const domainId = nodeId++;

            nodesDataSet.add({
                id: domainId,
                label: domain.name,
                shape: "star",
                size: 20,
                color: { background: domainColor, border: domainColor },
                font: { color: "white", size: 14, bold: true },
                _type: "domain"
            });
            edges.push({ from: 0, to: domainId, length: 200, width: 2 });

            domain.subjects.forEach(subject => {
                const subjectId = nodeId++;

                nodesDataSet.add({
                    id: subjectId,
                    label: subject.name,
                    shape: "dot",
                    size: 14,
                    color: { background: domainColor + "bb", border: domainColor },
                    font: { color: "white", size: 11 },
                    _type: "subject"
                });
                edges.push({ from: domainId, to: subjectId, length: 140, width: 1.5 });

                subject.topics.forEach(topic => {
                    const topicId = nodeId++;
                    const moonBg = domainColor + "66";
                    const moonBd = domainColor + "99";

                    nodesDataSet.add({
                        id: topicId,
                        label: topic.name,
                        shape: "dot",
                        size: 8,
                        color: { background: moonBg, border: moonBd },
                        font: { color: "#cbd5e1", size: 9 },
                        title: topic.desc ? `${topic.name}: ${topic.desc}` : topic.name,
                        _type: "topic"
                    });
                    edges.push({ from: subjectId, to: topicId, length: 80, width: 1, dashes: true });
                });
            });
        });

        const edgesDataSet = new vis.DataSet(edges);

        // forceAtlas2Based lays out nodes organically; randomSeed: 42 keeps positions
        // stable across reloads. Stabilization (300 iterations) runs once at init.
        // Edge length/width vary by hierarchy level (center→domain→topic→subject).
        networkInstance = new vis.Network(
            container,
            { nodes: nodesDataSet, edges: edgesDataSet },
            {
                layout: { randomSeed: 42 },
                physics: {
                    solver: "forceAtlas2Based",
                    forceAtlas2Based: { gravitationalConstant: -80, centralGravity: 0.005, springLength: 120, springConstant: 0.04, damping: 0.4 },
                    stabilization: { iterations: 300, fit: true }
                },
                edges: {
                    smooth: { type: "cubicBezier", roundness: 0.5 },
                    color: { color: "#475569", highlight: "#38bdf8", opacity: 0.6 }
                },
                nodes: {
                    borderWidth: 1.5,
                    shadow: { enabled: true, size: 8, x: 2, y: 2, color: "rgba(0,0,0,0.4)" }
                },
                interaction: { hover: true, tooltipDelay: 80, zoomView: true }
            }
        );

        // Node click focuses the selection: connected edges highlight in accent blue,
        // all others dim. selectedMindmapNodeId also scopes the pulse glow below.
        networkInstance.on("click", function(params) {
            if (params.nodes.length > 0) {
                selectedMindmapNodeId = params.nodes[0];

                const connectedEdges = networkInstance.getConnectedEdges(selectedMindmapNodeId);
                edgesDataSet.forEach(edge => {
                    if (connectedEdges.includes(edge.id)) {
                        edgesDataSet.update({ id: edge.id, color: { color: "#38bdf8", opacity: 1.0 }, width: 2.5 });
                    } else {
                        edgesDataSet.update({ id: edge.id, color: { color: "#334155", opacity: 0.25 }, width: 1 });
                    }
                });
            } else {
                selectedMindmapNodeId = null;
                edgesDataSet.forEach(edge => {
                    edgesDataSet.update({ id: edge.id, color: { color: "#475569", opacity: 0.6 }, width: 1.5 });
                });
            }
        });

        // Pulse animation: runPulseLoop() advances pulseProgress (0→1) and
        // calls redraw(), which triggers this hook. A radial-gradient dot is drawn at
        // edge.edgeType.getPoint(t) so the glow follows the actual bezier curve.
        networkInstance.on("afterDrawing", (ctx) => {
            if (mapAnimationProfile !== 'pulse') return;

            const edgeData = networkInstance.body.edges;

            ctx.save();
            for (const id in edgeData) {
                const edge = edgeData[id];

                // When a node is selected, pulse only along edges connected to that node.
                if (selectedMindmapNodeId !== null && edge.fromId !== selectedMindmapNodeId && edge.toId !== selectedMindmapNodeId) {
                    continue;
                }

                // Use vis-network's cached edge endpoints (already in screen space).
                if (!edge.edgeType || !edge.edgeType.from || !edge.edgeType.to) continue;

                const startX = edge.edgeType.from.x;
                const startY = edge.edgeType.from.y;
                const endX = edge.edgeType.to.x;
                const endY = edge.edgeType.to.y;

                let currentPulseX, currentPulseY;
                const t = pulseProgress;

                // Ask vis-network for the actual point along the rendered curve.
                // This matches whatever smooth.type is configured (cubicBezier,
                // continuous, dynamic, etc.) instead of reimplementing the math.
                let curvePoint = null;
                if (typeof edge.edgeType.getPoint === 'function') {
                    curvePoint = edge.edgeType.getPoint(t);
                }

                if (curvePoint) {
                    currentPulseX = curvePoint.x;
                    currentPulseY = curvePoint.y;
                } else {
                    // Fallback: straight-line interpolation (only used if getPoint
                    // is ever unavailable for some edge type).
                    currentPulseX = startX + (endX - startX) * t;
                    currentPulseY = startY + (endY - startY) * t;
                }

                ctx.beginPath();
                const gradient = ctx.createRadialGradient(currentPulseX, currentPulseY, 0.5, currentPulseX, currentPulseY, 4);
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#38bdf8');
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

                ctx.fillStyle = gradient;
                ctx.arc(currentPulseX, currentPulseY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        setAnimation('pulse');
    }

    // Animation profiles (toolbar: Pulse / Drift / Static):
    //   pulse  — physics on but settles; glow travels along edges via afterDrawing
    //   drift  — continuous forceAtlas2 simulation for gentle node movement
    //   static — physics off; graph frozen in place
    function setAnimation(profileMode) {
        mapAnimationProfile = profileMode;

        document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active-mode'));
        const activeBtn = document.getElementById(`btn-anim-${profileMode}`);
        if (activeBtn) activeBtn.classList.add('active-mode');

        if (!networkInstance) return;

        if (mindmapLoopId) { cancelAnimationFrame(mindmapLoopId); mindmapLoopId = null; }

        if (profileMode === 'static') {
            networkInstance.setOptions({ physics: { enabled: false } });
        } else if (profileMode === 'drift') {
            networkInstance.setOptions({
                physics: {
                    enabled: true,
                    stabilization: false,
                    solver: "forceAtlas2Based",
                    forceAtlas2Based: { gravitationalConstant: -55, centralGravity: 0.002, springLength: 135, springConstant: 0.01, damping: 0.04 }
                }
            });
            runDriftLoop();
        } else if (profileMode === 'pulse') {
            networkInstance.setOptions({
                physics: {
                    enabled: true,
                    stabilization: false,
                    solver: "forceAtlas2Based",
                    forceAtlas2Based: { gravitationalConstant: -70, centralGravity: 0.005, springLength: 125, springConstant: 0.03, damping: 0.35 }
                }
            });
            runPulseLoop();
        }
    }

    function runPulseLoop() {
        if (mapAnimationProfile !== 'pulse' || !networkInstance) {
            mindmapLoopId = null;
            return;
        }

        pulseProgress += 0.004;
        if (pulseProgress > 1) {
            pulseProgress = 0;
        }

        // Pulse only needs a redraw to re-trigger the afterDrawing glow.
        // We no longer call startSimulation() every frame, so physics can
        // settle and the CPU stays cool. (Drift mode still simulates.)
        networkInstance.redraw();
        mindmapLoopId = requestAnimationFrame(runPulseLoop);
    }

    function runDriftLoop() {
        if (mapAnimationProfile !== 'drift' || !networkInstance) {
            mindmapLoopId = null;
            return;
        }
        // Drift mode must tick the physics engine each frame; unlike pulse (which
        // only redraws), startSimulation() here keeps nodes slowly drifting.
        networkInstance.startSimulation();
        mindmapLoopId = requestAnimationFrame(runDriftLoop);
    }

    return {
        activate(model, palette) {
            if (!initialized) { build(model, palette); initialized = true; }
            if (networkInstance) {
                setTimeout(() => {
                    networkInstance.fit({ animation: { duration: 800, easingFunction: 'easeInOutQuad' } });
                    setAnimation(mapAnimationProfile);
                }, 100);
            }
        },
        deactivate() {
            if (mindmapLoopId) { cancelAnimationFrame(mindmapLoopId); mindmapLoopId = null; }
        },
        resize() { if (networkInstance) networkInstance.setSize(); },
        setAnimation
    };
})();
