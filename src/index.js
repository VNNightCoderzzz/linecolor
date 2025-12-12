const RESET = "\x1b[0m";
const OPEN = {
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",
    underline: "\x1b[4m",
    inverse: "\x1b[7m",
    hidden: "\x1b[8m",
    strike: "\x1b[9m"
};

export function TextProgressBar(percent, width = 30, filledHex = "#10B981", emptyHex = "#E5E7EB") {
  const p = Math.max(0, Math.min(100, Number(percent) || 0));
  const filled = Math.round((p / 100) * width);
  const empty = width - filled;
  const fpart = "█".repeat(filled);
  const epart = "░".repeat(empty);
  return `${TextHEX(fpart, filledHex)}${TextHEX(epart, emptyHex)} ${p}%`;
}

export function TextTimestamp(prefix = "", colorHex = "#94A3B8") {
  const t = new Date().toISOString();
  const out = prefix ? `${prefix} ${t}` : t;
  return TextHEX(out, colorHex);
}

export function TextShadow(text, shadowHex = "#555555") {
    const shadow = TextHEX(text, shadowHex);
    const normal = text;
    return `${shadow}\n ${normal}${RESET}`;
}

export function TextOutline(text, hex = "#FFFFFF") {
    const outline = TextHEX(text, hex);
    return ` ${outline} \n${outline} ${outline}\n ${outline} `;
}

export function TextDoubleUnderline(text) {
    return `\x1b[21m${text}${RESET}`;
}

export function TextOverline(text) {
    return `\x1b[53m${text}${RESET}`;
}

export function TextBox(text, hex = "#00AEEF") {
    const color = TextHEX(text, hex);
    const len = text.length + 4;
    const top = "┏" + "━".repeat(len - 2) + "┓";
    const mid = `┃  ${color}  ┃`;
    const bot = "┗" + "━".repeat(len - 2) + "┛";
    return `${top}\n${mid}\n${bot}${RESET}`;
}

export function TextTag(tag, msg, hex = "#00FF7F") {
    const t = TextHEX(tag, hex);
    return `[${t}] ${msg}${RESET}`;
}

export function TextGlitch(text) {
    let out = "";
    for (let c of text) {
        const r = Math.floor(Math.random()*50)+200;
        const g = Math.floor(Math.random()*50);
        const b = Math.floor(Math.random()*50);
        const ghost = `\x1b[38;2;${r};${g};${b}m${c}`;
        out += `${ghost}${c}`;
    }
    return out + RESET;
}


export function GradientEffect(text, gradientColors) {
    if (!Array.isArray(gradientColors) || gradientColors.length < 2) {
        throw new Error("gradientColors must be an array with at least 2 colors");
    }

    const rgbColors = gradientColors.map(hexToRgb);
    const segments = text.length / (rgbColors.length - 1);

    let result = "";

    for (let i = 0; i < text.length; i++) {
        const segIndex = Math.floor(i / segments);
        const start = rgbColors[segIndex];
        const end = rgbColors[Math.min(segIndex + 1, rgbColors.length - 1)];

        const factor = (i % segments) / segments;

        const r = Math.round(lerp(start.r, end.r, factor));
        const g = Math.round(lerp(start.g, end.g, factor));
        const b = Math.round(lerp(start.b, end.b, factor));

        result += `\x1b[38;2;${r};${g};${b}m${text[i]}`;
    }

    return result + RESET;
}

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
    };
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function styleWrap(open, text) {
    return `${open}${text}${RESET}`;
}

export function TextRGB(text, r, g, b) {
    return `\x1b[38;2;${r};${g};${b}m${text}${RESET}`;
}

export function TextHEX(text, hex) {
    if (hex.startsWith("#")) hex = hex.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return TextRGB(text, r, g, b);
}

export function TextHSL(text, h, s, l) {
    s /= 100; 
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r1, g1, b1;

    if (h < 60)       [r1, g1, b1] = [c, x, 0];
    else if (h <120) [r1, g1, b1] = [x, c, 0];
    else if (h <180) [r1, g1, b1] = [0, c, x];
    else if (h <240) [r1, g1, b1] = [0, x, c];
    else if (h <300) [r1, g1, b1] = [x, 0, c];
    else             [r1, g1, b1] = [c, 0, x];

    return TextRGB(text, Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255));
}

export function TextBG_RGB(text, r, g, b) {
    return `\x1b[48;2;${r};${g};${b}m${text}${RESET}`;
}

export function TextBG_HEX(text, hex) {
    if (hex.startsWith("#")) hex = hex.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return TextBG_RGB(text, r, g, b);
}

export function TextBG_HSL(text, h, s, l) {
    return TextHSL(text, h, s, l).replace("\x1b[38", "\x1b[48");
}
export function TextColorName(text, name) {
    const color = namedColors[name.toLowerCase()];
    if (!color) return text;
    return TextHEX(text, color);
}

export function TextNameColor(text, name) {
    return TextColorName(text, name);
}
export const TextBold      = t => styleWrap(OPEN.bold, t);
export const TextDim       = t => styleWrap(OPEN.dim, t);
export const TextItalic    = t => styleWrap(OPEN.italic, t);
export const TextUnderline = t => styleWrap(OPEN.underline, t);
export const TextStrike    = t => styleWrap(OPEN.strike, t);
export const TextInverse   = t => styleWrap(OPEN.inverse, t);

function buildStyle(prev = "", apply = t => t) {
    const fn = text => apply(text);

    return new Proxy(fn, {
        get(_, key) {
            if (key === "rgb") {
                return (r, g, b) =>
                    buildStyle(prev + "rgb", t => TextRGB(apply(t), r, g, b));
            }

            if (key === "hex") {
                return hex =>
                    buildStyle(prev + "hex", t => TextHEX(apply(t), hex));
            }

            if (key === "hsl") {
                return (h, s, l) =>
                    buildStyle(prev + "hsl", t => TextHSL(apply(t), h, s, l));
            }

            if (key === "bgRgb") {
                return (r, g, b) =>
                    buildStyle(prev + "bgRgb", t => TextBG_RGB(apply(t), r, g, b));
            }

            if (key === "bgHex") {
                return hex =>
                    buildStyle(prev + "bgHex", t => TextBG_HEX(apply(t), hex));
            }

            if (key === "bgHsl") {
                return (h, s, l) =>
                    buildStyle(prev + "bgHsl", t => TextBG_HSL(apply(t), h, s, l));
            }

            if (key in OPEN) {
                const open = OPEN[key];
                return buildStyle(prev + key, t => `${open}${apply(t)}${RESET}`);
            }

            return Reflect.get(_, key);
        }
    });
}

export const color = buildStyle();
const namedColors = {
    aliceblue: "#F0F8FF",
    antiquewhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedalmond: "#FFEBCD",
    blue: "#0000FF",
    blueviolet: "#8A2BE2",
    brown: "#A52A2A",
    burlywood: "#DEB887",
    cadetblue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerblue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkblue: "#00008B",
    darkcyan: "#008B8B",
    darkgoldenrod: "#B8860B",
    darkgray: "#A9A9A9",
    darkgreen: "#006400",
    darkgrey: "#A9A9A9",
    darkkhaki: "#BDB76B",
    darkmagenta: "#8B008B",
    darkolivegreen: "#556B2F",
    darkorange: "#FF8C00",
    darkorchid: "#9932CC",
    darkred: "#8B0000",
    darksalmon: "#E9967A",
    darkseagreen: "#8FBC8F",
    darkslateblue: "#483D8B",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    darkturquoise: "#00CED1",
    darkviolet: "#9400D3",
    deeppink: "#FF1493",
    deepskyblue: "#00BFFF",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1E90FF",
    firebrick: "#B22222",
    floralwhite: "#FFFAF0",
    forestgreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostwhite: "#F8F8FF",
    gold: "#FFD700",
    goldenrod: "#DAA520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#ADFF2F",
    grey: "#808080",
    honeydew: "#F0FFF0",
    hotpink: "#FF69B4",
    indianred: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderblush: "#FFF0F5",
    lawngreen: "#7CFC00",
    lemonchiffon: "#FFFACD",
    lightblue: "#ADD8E6",
    lightcoral: "#F08080",
    lightcyan: "#E0FFFF",
    lightgoldenrodyellow: "#FAFAD2",
    lightgray: "#D3D3D3",
    lightgreen: "#90EE90",
    lightgrey: "#D3D3D3",
    lightpink: "#FFB6C1",
    lightsalmon: "#FFA07A",
    lightseagreen: "#20B2AA",
    lightskyblue: "#87CEFA",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#B0C4DE",
    lightyellow: "#FFFFE0",
    lime: "#00FF00",
    limegreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumaquamarine: "#66CDAA",
    mediumblue: "#0000CD",
    mediumorchid: "#BA55D3",
    mediumpurple: "#9370DB",
    mediumseagreen: "#3CB371",
    mediumslateblue: "#7B68EE",
    mediumspringgreen: "#00FA9A",
    mediumturquoise: "#48D1CC",
    mediumvioletred: "#C71585",
    midnightblue: "#191970",
    mintcream: "#F5FFFA",
    mistyrose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajowhite: "#FFDEAD",
    navy: "#000080",
    oldlace: "#FDF5E6",
    olive: "#808000",
    olivedrab: "#6B8E23",
    orange: "#FFA500",
    orangered: "#FF4500",
    orchid: "#DA70D6",
    palegoldenrod: "#EEE8AA",
    palegreen: "#98FB98",
    paleturquoise: "#AFEEEE",
    palevioletred: "#DB7093",
    papayawhip: "#FFEFD5",
    peachpuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderblue: "#B0E0E6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#FF0000",
    rosybrown: "#BC8F8F",
    royalblue: "#4169E1",
    saddlebrown: "#8B4513",
    salmon: "#FA8072",
    sandybrown: "#F4A460",
    seagreen: "#2E8B57",
    seashell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyblue: "#87CEEB",
    slateblue: "#6A5ACD",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#FFFAFA",
    springgreen: "#00FF7F",
    steelblue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whitesmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowgreen: "#9ACD32",
brightred: "#ef4444",
softred: "#fca5a5",
brightgreen: "#22c55e",
softgreen: "#86efac",
brightblue: "#3b82f6",
softblue: "#93c5fd",
sky: "#0ea5e9",
skysoft: "#7dd3fc",
cyanblue: "#06b6d4",
emerald: "#10b981",
limeaccent: "#84cc16",
amber: "#f59e0b",
warmyellow: "#fef08a",
warmorange: "#fb923c",
deeporange: "#ea580c",
warmgray: "#78716c",
coolgray: "#94a3b8",
slate: "#64748b",
mdred: "#F44336",
mdpink: "#E91E63",
mdpurple: "#9C27B0",
mddeeppurple: "#673AB7",
mdindigo: "#3F51B5",
mdblue: "#2196F3",
mdlightblue: "#03A9F4",
mdcyan: "#00BCD4",
mdteal: "#009688",
mdgreen: "#4CAF50",
mdlightgreen: "#8BC34A",
mdlime: "#CDDC39",
mdyellow: "#FFEB3B",
mdamber: "#FFC107",
mdorange: "#FF9800",
mddeeporange: "#FF5722",
mdbrown: "#795548",
mdgrey: "#9E9E9E",
mdbluegrey: "#607D8B",
pastelpink: "#FFB5E8",
pastelblue: "#AEC6FF",
pastelgreen: "#C4FCEF",
pastelyellow: "#FFF5BA",
pastelorange: "#FFD8A8",
pastelpurple: "#D7AEFF",
neongreen: "#39FF14",
neonblue: "#04D9FF",
neonpink: "#FF6EC7",
neonpurple: "#BC13FE",
neonyellow: "#FFFF33",
neonorange: "#FF5F1F",
neonred: "#FF073A",
cyberpink: "#FF009D",
cyberblue: "#00E5FF",
cyberpurple: "#A200FF",
cyberyellow: "#F9F910",
cybergreen: "#00FF9F",
royalgold: "#F6E27F",
deepgold: "#D4AF37",
softgold: "#FBE7A1",
mint: "#98FF98",
bloodred: "#8A0303",
lavenderpurple: "#C084FC",
electricblue: "#7DF9FF",
midnightpurple: "#2E004F",
oceanblue: "#0066CC",
forest: "#0B6623",
rose: "#FF007F",
sunrise: "#FFCC70",
sunset: "#FF7E5F",
flame: "#E25822",
sunflare: "#FFB037",
tangerine: "#FF8F00",
ember: "#FF4500",
rustyred: "#DA2C43",
lavarose: "#FF595E",
bubblegum: "#FF71CE",
blossom: "#FFB7C5",
pearlpink: "#F9D5E5",
coralpink: "#FF6F61",
ultramarine: "#3F00FF",
deepcerulean: "#007BA7",
arcticblue: "#7FDBFF",
iceblue: "#D6F6FF",
frostblue: "#AEE1F9",
emeraldsea: "#2ECC71",
springmint: "#AAF0D1",
deepmint: "#009E60",
leafgreen: "#32A852",
jadegreen: "#00A36C",
sandstone: "#C2B280",
desertsand: "#EDC9AF",
warmbeige: "#F5E5C0",
latte: "#E3C39D",
mocha: "#A47551",
platinum: "#E5E4E2",
charcoal: "#36454F",
iron: "#D4D7D9",
spacegray: "#444E5A",
voidgray: "#2A2D34",
amethyst: "#9966CC",
witchpurple: "#5D3FD3",
royalviolet: "#8F00FF",
velvetpurple: "#6F2DA8",
moonpurple: "#A185C9"
};