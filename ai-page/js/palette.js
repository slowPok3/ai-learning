// Domain color palette generation, shared by all four views.

// Converts an HSL color to {r,g,b,hexString} so we can build both the
// Three.js hex ints and the CSS rgba/hex strings from one source of truth.
function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const r = Math.round(f(0) * 255);
    const g = Math.round(f(8) * 255);
    const b = Math.round(f(4) * 255);
    const hexString = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    return { r, g, b, hexString };
}

// Generates `count` evenly-spaced hues around the color wheel so any
// number of domains stays visually distinct (no wraparound collisions).
//   baseSat/baseLight   → the bright "main" color (spheres, pills, borders)
//   emSat/emLight       → the deeper "emissive" variant (glow/shadow tone)
//   hueOffset           → rotate the starting hue (0–360), just for variety
function generatePalette(count, opts = {}) {
    const {
        baseSat = 75,
        baseLight = 60,
        emSat = 80,
        emLight = 38,
        hueOffset = 0
    } = opts;

    if (count <= 0) return [];

    return Array.from({ length: count }, (_, i) => {
        const hue = (360 / count) * i + hueOffset;
        const base = hslToRgb(hue, baseSat, baseLight);
        const em   = hslToRgb(hue, emSat, emLight);
        return {
            base: base.hexString,
            hex: parseInt(base.hexString.slice(1), 16),
            em: parseInt(em.hexString.slice(1), 16),
            rgba: `rgba(${base.r}, ${base.g}, ${base.b}, 0.75)`
        };
    });
}
