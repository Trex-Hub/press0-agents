// CORE
import type { Processor } from "@mastra/core/processors";
import type { ChunkType } from "@mastra/core/stream";

class WhatsAppFormatter implements Processor {
  readonly name = "whatsapp-formatter";

  async processOutputStream({
    part,
  }: {
    part: ChunkType;
    state?: Record<string, any>;
    abort?: (reason?: string) => never;
  }): Promise<ChunkType | null | undefined> {
    if (part.type !== "text-delta") return part;

    let txt = part.payload.text;

    // ---
    // PHASE 1: NORMALIZE LINE BREAKS AND WHITESPACE
    // ---

    // 1a) Normalize line breaks: Convert all line endings to single "\n"
    txt = txt.replace(/\r\n|\r/g, "\n");

    // 1b) Clean up non-standard whitespace (tabs, non-breaking spaces) to standard spaces
    txt = txt.replace(/[\u00A0\t]/g, " ");

    // 1c) Collapse multiple spaces to single space (but preserve intentional spacing)
    txt = txt.replace(/[ ]{2,}/g, " ");

    // ---
    // PHASE 2: CONVERT MULTI-ASTERISK TO SINGLE ASTERISK
    // ---
    // ONLY converts existing formatting: **text** → *text*
    // DOES NOT add any asterisks to plain text

    // 2a) Convert paired multi-asterisk patterns to single asterisk
    // This handles **text**, ***text***, ****text****, etc. → *text*
    txt = txt.replace(/\*\*+([^*\n]+?)\*\*+/g, "*$1*");
    
    // 2b) Clean up any remaining unpaired multi-asterisk sequences
    // Handle edge cases like **text* or *text** or standalone ***
    // Convert any sequence of 2+ consecutive asterisks to single asterisk
    txt = txt.replace(/\*\*+/g, "*");

    // ---
    // PHASE 3: PRESERVE ITALIC, STRIKETHROUGH, AND MONOSPACE
    // ---
    // These formats are already WhatsApp-compatible, so we just ensure they're clean
    // _italic_ → _italic_ (no change needed)
    // ~strikethrough~ → ~strikethrough~ (no change needed)
    // `code` → `code` (no change needed)

    // ---
    // PHASE 4: CONVERT LISTS TO WHATSAPP FORMAT
    // ---

    // 4a) Convert bullet lists: Ensure each item starts with "- " on its own line
    // Handle various bullet formats: •, -, * (but not * used for bold)
    // Only convert if it's clearly a list item (bullet + space + content)
    txt = txt.replace(/(?:^|\n)(\s*)(?:[-•]\s+)(.+)/gm, (match, indent, content) => {
      return `\n${indent}- ${content.trim()}`;
    });

    // 4b) Convert asterisk bullets (but be careful not to match bold formatting)
    // Only match if it's at start of line with space after asterisk
    txt = txt.replace(/(?:^|\n)(\s*)\*\s+(.+)/gm, (match, indent, content) => {
      // Only convert if it doesn't look like bold formatting (no closing asterisk nearby)
      if (!content.includes("*")) {
        return `\n${indent}- ${content.trim()}`;
      }
      return match; // Keep original if it might be formatting
    });

    // 4c) Ensure numbered lists are properly formatted: "1. ", "2. ", etc.
    // This preserves existing numbered lists but normalizes spacing
    txt = txt.replace(/(?:^|\n)(\s*)(\d+)\.\s+(.+)/gm, (match, indent, number, content) => {
      return `\n${indent}${number}. ${content.trim()}`;
    });

    // ---
    // PHASE 5: PRESERVE BLOCK QUOTES
    // ---
    // Block quotes with "> " prefix are already WhatsApp-compatible
    // Just ensure proper formatting
    txt = txt.replace(/(?:^|\n)(\s*)>\s*(.+)/gm, (match, indent, content) => {
      return `\n${indent}> ${content.trim()}`;
    });

    // ---
    // PHASE 6: FINAL CLEANUP
    // ---

    // 6a) Collapse excessive line breaks (max 2 consecutive for clean paragraphs)
    txt = txt.replace(/\n{3,}/g, "\n\n");

    // 6b) Trim leading/trailing whitespace and line breaks
    txt = txt.trim();

    // 6c) Convert line breaks to WhatsApp API format if needed
    // WhatsApp API typically uses "\r" for line breaks
    // Uncomment the line below if your WhatsApp API requires "\r":
    // txt = txt.replace(/\n/g, "\r");

    return {
      ...part,
      payload: { ...part.payload, text: txt },
    };
  }
}

export const whatsappFormatter = new WhatsAppFormatter();
