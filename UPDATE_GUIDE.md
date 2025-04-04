# Guide for Requesting Website Updates

This guide helps you request changes to the website layout and content effectively, utilizing the new Block architecture.

## Understanding the Structure

Remember the hierarchy: **Sections > Blocks > Cards/Text**.

*   **Sections:** Broad topics (Violinist, Educator, Technology, About, Contact).
*   **Blocks:** Define *how* content is laid out within a section (`.block-text`, `.block-tetris`, `.block-even`, `.block-events`, `.block-one-card`, `.block-stretched`).
*   **Cards/Text:** The actual content pieces.

Refer to `ARCHITECTURE_GUIDE.md` for details on each block type.

## How to Request Changes

Be specific about **WHAT** you want to change and **WHERE** it should happen.

**1. Adding a New Card:**

*   **Specify:**
    *   The **Section** (e.g., "Educator", "Technology").
    *   The **Block** you want to add it to (e.g., "the Tetris block", "the Even block"). If unsure, describe the desired layout relative to existing cards.
    *   The desired **position** within the block (e.g., "after the Patreon card", "before the ArcoAI card"). *Note: For Tetris blocks, the exact visual position depends on column flow.*
    *   The **content** for the new card (Title, Text, Image URL, Link URL).
    *   Does it need special internal styling (like a social media card)?

*   **Example Request:** "Please add a new card to the **Educator** section, inside the **Tetris block**, right after the 'Boston Violin Intensive' card. Title: 'New Workshop', Text: 'Details about the upcoming workshop...', Image: 'assets/images/new_workshop.jpg', Link: 'workshop-details.html'."

**2. Moving/Reordering Cards:**

*   **Specify:**
    *   The **Section** and **Block** the card is currently in.
    *   The specific **Card** to move (identify by its Title or unique content).
    *   The **Destination Section** and **Block**.
    *   The desired **position** within the destination block.

*   **Example Request:** "Please move the 'Kurofune Project' card from the **Violinist** section's **Tetris block** to the **About** section, placing it inside the **Events block** after the 'Photography' card."

**3. Changing a Block's Type:**

*   **Specify:**
    *   The **Section** containing the block.
    *   Identify the **Block** (e.g., "the block containing the Albums", "the first Tetris block in Educator").
    *   The **new Block type** you want to apply (e.g., "change it to an Even block", "make it a Tetris block").
*   **Note:** Changing block type will significantly alter the layout of the cards within it.

*   **Example Request:** "In the **Violinist** section, please change the **Events block** (containing Aegis Trio and Finehouse Duo) into a **Tetris block**."

**4. Adding a New Block:**

*   **Specify:**
    *   The **Section** to add the block to.
    *   The desired **position** within the section (e.g., "before the existing Tetris block", "after the Text block").
    *   The **type** of block (`.block-text`, `.block-tetris`, etc.).
    *   The **content** that will go inside this new block (text or a list of cards).

*   **Example Request:** "In the **Technology** section, please add a new **Text block** right after the Section Header. The text should be: 'An overview of my tech projects...'."

**5. Modifying Text/Card Content:**

*   **Specify:**
    *   The **Section** and **Block** (if applicable).
    *   Identify the specific **Card** or **Text** element (e.g., "the 'ArcoAI' card", "the second paragraph in the About text block").
    *   Clearly state the **change** needed (e.g., "change the title to...", "update the image URL to...", "replace the paragraph text with...").

*   **Example Request:** "In the **Technology** section's **Tetris block**, please update the text in the **'Arco Connect' card** to read: 'This platform seamlessly connects teachers and students...'."

**Providing Clear Information:**

The more specific you are about the Section, Block, Card, and desired outcome, the easier and faster it will be to implement the changes accurately.