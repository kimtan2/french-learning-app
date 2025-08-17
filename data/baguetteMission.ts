import { MissionData } from '@/types/mission';

export const baguetteMission: MissionData = {
  steps: [
    {
      id: 'intro',
      type: 'introduction',
      content: {
        title: 'Your First Boulangerie Visit',
        text: "You're in Paris, hungry for breakfast. The aroma of fresh bread leads you to a charming local bakery. Time to buy your first authentic French baguette!",
        objectives: [
          'Greet the baker politely',
          'Order a baguette in French',
          'Complete the transaction'
        ]
      }
    },
    {
      id: 'npc_greeting',
      type: 'regular',
      mainLayer: {
        npc: {
          name: 'Marie the Baker',
          emoji: '👩‍🍳',
          mood: 'friendly',
          description: 'Marie greets you warmly as you enter her bakery'
        },
        dialogue: {
          text: 'Bonjour !',
          translation: 'Hello!'
        }
      },
      addonLayer: {
        type: 'action_choice',
        prompt: 'What do you want to do?',
        choices: [
          {
            icon: '👋',
            text: 'Greet the baker back',
            action: 'greet',
            moodChange: 1
          },
          {
            icon: '🥖',
            text: 'Immediately ask for bread',
            action: 'direct',
            moodChange: -2
          },
          {
            icon: '👀',
            text: 'Look around nervously',
            action: 'nervous',
            moodChange: 0
          }
        ]
      }
    },
    {
      id: 'language_greeting',
      type: 'regular',
      mainLayer: {
        preservePrevious: true
      },
      addonLayer: {
        type: 'language_choice',
        prompt: 'How do you greet them?',
        options: [
          {
            french: 'Bonjour',
            phonetic: 'bon-ZHOOR',
            words: [
              { text: 'Bonjour', translation: 'Hello / Good day' }
            ],
            correct: 'perfect',
            feedback: {
              type: 'success',
              title: 'Parfait!',
              message: "Perfect! 'Bonjour' is the standard polite greeting.",
              xp: 15
            }
          },
          {
            french: 'Salut',
            phonetic: 'sah-LOO',
            words: [
              { text: 'Salut', translation: 'Hi (informal)' }
            ],
            correct: 'acceptable',
            feedback: {
              type: 'warning',
              title: 'Pas mal, mais...',
              message: "'Salut' is too casual for a shop. Use 'Bonjour' instead.",
              xp: 5
            }
          },
          {
            french: 'Bonsoir',
            phonetic: 'bon-SWAHR',
            words: [
              { text: 'Bonsoir', translation: 'Good evening' }
            ],
            correct: 'wrong',
            feedback: {
              type: 'error',
              title: 'Oops!',
              message: "It's morning! 'Bonsoir' is for after 6 PM.",
              xp: 0
            }
          }
        ],
        spotlight: {
          title: 'Formality in French',
          content: 'French has formal and informal registers. Always start formal in shops!'
        }
      }
    },
    {
      id: 'cultural_note',
      type: 'cultural',
      content: {
        title: 'Cultural Faux Pas!',
        text: 'In France, not greeting before making a request is very rude. Always say "Bonjour" first!'
      }
    },
    {
      id: 'npc_response',
      type: 'regular',
      mainLayer: {
        npc: {
          name: 'Marie the Baker',
          emoji: '👩‍🍳',
          mood: 'friendly',
          description: 'Marie smiles and asks what you would like to buy'
        },
        dialogue: {
          text: "Bonjour ! Qu'est-ce que vous désirez ?",
          translation: 'Hello! What would you like?'
        }
      },
      addonLayer: {
        type: 'language_choice',
        prompt: 'How do you ask for a baguette?',
        options: [
          {
            french: "Je voudrais une baguette, s'il vous plaît",
            phonetic: 'zhuh voo-DREH oon bah-GET, seel voo PLEH',
            words: [
              { text: 'Je', translation: 'I' },
              { text: 'voudrais', translation: 'would like' },
              { text: 'une', translation: 'a/one' },
              { text: 'baguette', translation: 'baguette' },
              { text: "s'il", translation: 'if it' },
              { text: 'vous', translation: 'you (formal)' },
              { text: 'plaît', translation: 'pleases' }
            ],
            correct: 'perfect',
            feedback: {
              type: 'success',
              title: 'Excellent!',
              message: 'Perfect polite request! This is exactly how to order.',
              xp: 20
            }
          },
          {
            french: 'Je veux une baguette',
            phonetic: 'zhuh VUH oon bah-GET',
            words: [
              { text: 'Je', translation: 'I' },
              { text: 'veux', translation: 'want' },
              { text: 'une', translation: 'a/one' },
              { text: 'baguette', translation: 'baguette' }
            ],
            correct: 'acceptable',
            feedback: {
              type: 'warning',
              title: 'Un peu direct...',
              message: "'Je veux' sounds childish. Use 'Je voudrais' for politeness.",
              xp: 8
            }
          }
        ],
        spotlight: {
          title: 'The Magic Words: Je voudrais',
          content: "This phrase opens doors throughout France. It's the polite way to express any desire."
        }
      }
    },
    {
      id: 'price',
      type: 'regular',
      mainLayer: {
        npc: {
          name: 'Marie the Baker',
          emoji: '👩‍🍳',
          mood: 'friendly',
          description: 'Marie hands you a fresh baguette and tells you the price'
        },
        dialogue: {
          text: "Voilà ! C'est un euro vingt.",
          translation: "Here you go! That's one euro twenty."
        }
      },
      addonLayer: {
        type: 'language_choice',
        prompt: 'How do you respond?',
        options: [
          {
            french: 'Merci beaucoup !',
            phonetic: 'mehr-SEE boh-COO',
            words: [
              { text: 'Merci', translation: 'Thank you' },
              { text: 'beaucoup', translation: 'very much' }
            ],
            correct: 'perfect',
            feedback: {
              type: 'success',
              title: 'Très bien!',
              message: 'Perfect! Always thank politely.',
              xp: 10
            }
          }
        ]
      }
    },
    {
      id: 'farewell',
      type: 'regular',
      mainLayer: {
        npc: {
          name: 'Marie the Baker',
          emoji: '👩‍🍳',
          mood: 'happy',
          description: 'Marie wishes you a good day as you complete your purchase'
        },
        dialogue: {
          text: 'Bonne journée !',
          translation: 'Have a good day!'
        }
      },
      addonLayer: {
        type: 'language_choice',
        prompt: 'Say goodbye:',
        options: [
          {
            french: 'Bonne journée !',
            phonetic: 'bun zhoor-NAY',
            words: [
              { text: 'Bonne', translation: 'Good' },
              { text: 'journée', translation: 'day' }
            ],
            correct: 'perfect',
            feedback: {
              type: 'success',
              title: 'Mission Accomplie!',
              message: 'Perfect farewell! You completed your first French transaction!',
              xp: 15
            }
          }
        ]
      }
    },
    {
      id: 'complete',
      type: 'completion',
      content: {
        title: 'Mission Complete!',
        totalXP: 0,
        phrases: ['Bonjour', 'Je voudrais', "S'il vous plaît", 'Merci', 'Bonne journée']
      }
    }
  ]
};