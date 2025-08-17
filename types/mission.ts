export interface Word {
  text: string;
  translation: string;
}

export interface Feedback {
  type: 'success' | 'warning' | 'error';
  title: string;
  message: string;
  xp: number;
}

export interface ActionChoice {
  icon: string;
  text: string;
  action: string;
  moodChange: number;
}

export interface LanguageOption {
  french: string;
  phonetic: string;
  words: Word[];
  correct: 'perfect' | 'acceptable' | 'wrong';
  feedback: Feedback;
}

export interface Spotlight {
  title: string;
  content: string;
}

export interface NPC {
  name: string;
  emoji: string;
  mood: string;
  description: string;
}

export interface Dialogue {
  text: string;
  translation: string;
}

export interface MainLayer {
  npc?: NPC;
  dialogue?: Dialogue;
  preservePrevious?: boolean;
}

export interface AddonLayer {
  type: 'action_choice' | 'language_choice';
  prompt: string;
  choices?: ActionChoice[];
  options?: LanguageOption[];
  spotlight?: Spotlight;
}

export interface IntroductionContent {
  title: string;
  text: string;
  objectives: string[];
}

export interface CulturalContent {
  title: string;
  text: string;
}

export interface CompletionContent {
  title: string;
  totalXP: number;
  phrases: string[];
}

export interface MissionStep {
  id: string;
  type: 'introduction' | 'regular' | 'cultural' | 'completion';
  mainLayer?: MainLayer;
  addonLayer?: AddonLayer;
  content?: IntroductionContent | CulturalContent | CompletionContent;
}

export interface MissionData {
  steps: MissionStep[];
}

export interface GameState {
  currentStep: number;
  totalXP: number;
  mood: number;
  selectedChoice: number | null;
  feedbackShown: boolean;
  addonActive: boolean;
  path: string[];
  nextAction: 'start' | 'proceed' | 'show_addon' | 'wait_selection' | 'wait_language_selection' | 'show_feedback' | 'proceed_after_feedback' | 'restart';
  selectedAction?: string;
}