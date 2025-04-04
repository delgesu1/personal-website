# Website Architecture Guide: Block Layout System

This document outlines the layout architecture of the website, based on a semantic Block system.

## Core Concept: Sections > Blocks > Cards

The website layout is organized hierarchically:

1.  **Sections:** Top-level thematic areas (e.g., `<section id="violinist">`). Sections contain Blocks.
2.  **Blocks:** Containers *within* Sections that define the layout rules for the cards or text they contain. Blocks themselves usually have no visual appearance, only layout behavior. They use classes like `.block` and `.block-[type]` (e.g., `<div class="block block-tetris">`). Blocks contain Cards or text elements.
3.  **Cards:** Individual content units (e.g., `.card`, `.album-card`, `.social-card`) displaying specific information.

This system replaces the previous complex grid (`organic-grid`) and size modifier classes (`card-medium`, etc.) with a more semantic and manageable approach.

## Block Types

Each block type dictates how the cards (or text) directly inside it are arranged and sized.

### 1. Text Block (`.block-text`)

*   **Purpose:** To display formatted text content (paragraphs, lists, blockquotes) spanning the main content area width.
*   **Layout:** Standard document flow. Relies on internal text element styling (`p`, `.about-intro`, `.educator-intro`, `.discography`, etc.).
*   **Responsiveness:** Text reflows naturally with screen width.
*   **Card Sizing:** N/A (contains text elements, not cards).

### 2. Tetris Block (`.block-tetris`)

*   **Purpose:** Masonry-style layout where cards have variable heights based on their content and arrange themselves into columns without strict horizontal alignment.
*   **Layout:** Uses CSS `column-count`.
*   **Responsiveness:**
    *   `>= 1200px`: 3 columns (`column-count: 3`)
    *   `980px - 1199px`: 2 columns (`column-count: 2`)
    *   `< 980px`: 1 column (`column-count: 1`)
*   **Card Sizing:** Cards have `height: auto` and `overflow: visible`, expanding vertically to fit their content. Requires `break-inside: avoid` to prevent cards splitting across columns.

### 3. Even Block (`.block-even`)

*   **Purpose:** Grid layout where cards are arranged in uniform rows and columns. Cards within the same row are forced to be the same height.
*   **Layout:** Uses CSS `display: grid`.
*   **Responsiveness:**
    *   `>= 1200px`: 3 columns (`grid-template-columns: repeat(3, 1fr)`)
    *   `768px - 1199px`: 2 columns (`grid-template-columns: repeat(2, 1fr)`)
    *   `< 768px`: 1 column (`grid-template-columns: 1fr`)
*   **Card Sizing:** Cards stretch vertically to match the tallest card in their row (`align-items: stretch`). Image containers within use `aspect-ratio: 1 / 1` for consistency (except on mobile < 768px where height is fixed).

### 4. Events Block (`.block-events`)

*   **Purpose:** Similar to Even Block, but designed for layouts needing a maximum of two columns, often used for event listings or duo cards.
*   **Layout:** Uses CSS `display: grid`.
*   **Responsiveness:**
    *   `>= 768px`: 2 columns (`grid-template-columns: repeat(2, 1fr)`)
    *   `< 768px`: 1 column (`grid-template-columns: 1fr`)
*   **Card Sizing:** Cards stretch vertically to match the tallest card in their row. Image containers use `aspect-ratio: 4 / 3` for screens `>= 980px`, otherwise a fixed height.

### 5. One-Card Block (`.block-one-card`)

*   **Purpose:** To display a single card or element that spans the full width of the main content container.
*   **Layout:** Simple block flow.
*   **Responsiveness:** Content within the card reflows naturally.
*   **Card Sizing:** The single child element takes `width: 100%` of the container.
*   **Note:** Used for the "Upcoming Concerts" section where the outer `.card` is styled to be invisible (`background: transparent`, `box-shadow: none`).

### 6. Stretched Block (`.block-stretched`)

*   **Purpose:** To display a single card or element that breaks out of the main content container and spans the full viewport width (edge-to-edge).
*   **Layout:** Uses negative margins (`calc(50% - 50vw)`) and `width: 100vw`.
*   **Responsiveness:** Spans full width on all screen sizes.
*   **Card Sizing:** Child element takes `width: 100%`.
*   **HTML Placement:** These blocks **must** be placed *outside* the main `<div class="container">` to function correctly (e.g., the featured video).

## Implementation Notes

*   **HTML:** Blocks are implemented as `div` elements with classes `.block` and `.block-[type]` (e.g., `<div class="block block-tetris">`). Cards or text elements are placed directly inside. Sections are `<section>` elements.
*   **CSS:** Styles are defined in `assets/css/styles.css`. Base card styles (`.card`, `.social-card`, etc.) define internal appearance, while Block styles dictate arrangement and override base styles where necessary (e.g., `height: auto`, `overflow: visible` for Tetris cards).
*   **Card Internals:** The internal structure and styling of individual card types (like social media cards) are preserved; the Block system only controls their arrangement relative to each other.