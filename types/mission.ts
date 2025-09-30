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
  nextStepId?: string; // Optional: specify which step to go to
}

export interface LanguageOption {
  french: string;
  phonetic: string;
  words: Word[];
  correct: 'perfect' | 'acceptable' | 'wrong';
  feedback: Feedback;
  nextStepId?: string; // Optional: specify which step to go to
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

// Base interface for all addon layers
interface BaseAddonLayer {
  type: string;
}

// Existing addon layer types
interface ActionChoiceAddon extends BaseAddonLayer {
  type: 'action_choice';
  prompt: string;
  choices: ActionChoice[];
}

interface LanguageChoiceAddon extends BaseAddonLayer {
  type: 'language_choice';
  prompt: string;
  options: LanguageOption[];
  spotlight?: Spotlight;
}

// New spotlight display addon layer
interface SpotlightDisplayAddon extends BaseAddonLayer {
  type: 'spotlight_display';
  title: string;
  content: string;
}

// Union type for all addon layers - add new types here for extensibility
export type AddonLayer = ActionChoiceAddon | LanguageChoiceAddon | SpotlightDisplayAddon;

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
  id?: string;
  title?: string;
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
  nextAction: 'start' | 'proceed' | 'show_addon' | 'wait_selection' | 'wait_language_selection' | 'show_feedback' | 'proceed_after_feedback' | 'restart' | 'understood';
  selectedAction?: string;
}