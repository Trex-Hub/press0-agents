// CORE
import { GoogleGenAI } from '@google/genai';
// CONSTANTS
import { GOOGLE_API_KEY, GOOGLE_MODEL } from '@/utils/constants';

class GoogleAIClient {
  public genAI: GoogleGenAI;
  public model: string;

  constructor() {
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not configured');
    }
    this.genAI = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
    this.model = GOOGLE_MODEL;
  }
}

export default new GoogleAIClient();
