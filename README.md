# Linecolor
<p align="center">
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-Compatible-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Stable-success?style=for-the-badge"/>
</p>

A lightweight ANSI coloring toolkit for Node.js.  
Supports RGB, HEX, HSL, Named Colors, background colors, text styling, tags, boxes, outlines, gradients, progress bars, timestamps, and more.

## Installation

```bash
npm install linecolor
```

## Functions

- TextBold(text)
Creates a bold text effect using ANSI. Used to highlight important sections.

- TextDim(text)
Reduces text brightness. Often used for system logs, debugging, or supplementary messages.

- TextItalic(text)
Creates an italic effect. Some terminals may not support it, but most do.

- TextUnderline(text)
Underlines all text. Useful for titles or links.

- TextDoubleUnderline(text)
Double underline. Stronger than regular underline, used to emphasize main titles.

- TextOverline(text)
Creates a line above text. Used to group or mark sections.

- TextStrike(text)
Threads text horizontally. Used to indicate "deleted," "cancelled," or content that is no longer applicable.

- TextInverse(text)
Inverts the foreground ↔ background color. Creates the strongest highlight effect in ANSI.

- TextBox(text, hex)  
  Creates a simple ASCII box with border and colored content.

- TextTag(tag, msg, hex)  
  Creates a colored prefix tag format.

- TextGlitch(text)  
  Generates a cyber-glitch random RGB effect.

- TextShadow(text, shadowHex)  
  Adds a second shadow line below the text.

- TextOutline(text, hex)  
  Simulates a text outline using multi-line ASCII layout.
## Example Usage

```js
import { 
  TextHEX, 
  TextBold, 
  TextBox, 
  TextProgressBar 
} from "linecolor";

console.log(TextBold(TextHEX("Hello!", "#ff0077")));
console.log(TextBox("System Ready", "#00eaff"));
console.log(TextProgressBar(72));
```
# Notes
Only uses ANSI escape codes, no dependencies.
Fully compatible with most terminals (Windows, macOS, Linux).