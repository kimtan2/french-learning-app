'use client';

import React, { useState, useCallback } from 'react';
import { GameState, Feedback as FeedbackType, IntroductionContent, CulturalContent, CompletionContent, MissionData, NPC, Dialogue } from '@/types/mission';
import { baguetteMission } from '@/data/baguetteMission';
import CityMap from '@/components/CityMap';
import BottomNavigation from '@/components/BottomNavigation';
import Settings from '@/components/Settings';
import SkillArea from '@/components/SkillArea';
import Header from '@/components/Header';
import IntroductionStep from '@/components/IntroductionStep';
import NPCDisplay from '@/components/NPCDisplay';
import ActionChoices from '@/components/ActionChoices';
import LanguageChoices from '@/components/LanguageChoices';
import Feedback from '@/components/Feedback';
import CulturalNote from '@/components/CulturalNote';
import CompletionScreen from '@/components/CompletionScreen';
import SpotlightDisplay from '@/components/SpotlightDisplay';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'skills' | 'settings'>('home');
  const [currentLanguage, setCurrentLanguage] = useState<'french' | 'german'>('french');
  const [currentMission, setCurrentMission] = useState<MissionData | null>(null);
  const [isInMission, setIsInMission] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentStep: 0,
    totalXP: 0,
    mood: 0,
    selectedChoice: null,
    feedbackShown: false,
    addonActive: false,
    path: [],
    nextAction: 'start'
  });

  const [currentFeedback, setCurrentFeedback] = useState<FeedbackType | null>(null);
  const [pendingNextStepId, setPendingNextStepId] = useState<string | null>(null);
  const [previousMainLayer, setPreviousMainLayer] = useState<{npc: NPC; dialogue: Dialogue} | null>(null);

  // Auto-show addon for steps with no main content
  const currentStep = currentMission?.steps[gameState.currentStep];
  
  // Update previous main layer when current step has valid main content
  React.useEffect(() => {
    if (currentStep?.type === 'regular' && currentStep.mainLayer && 
        currentStep.mainLayer.npc && currentStep.mainLayer.dialogue &&
        !currentStep.mainLayer.preservePrevious) {
      setPreviousMainLayer({
        npc: currentStep.mainLayer.npc,
        dialogue: currentStep.mainLayer.dialogue
      });
    }
  }, [currentStep]);
  
  React.useEffect(() => {
    if (currentStep?.type === 'regular' && gameState.nextAction === 'show_addon') {
      const hasMainContent = currentStep.mainLayer && 
                            currentStep.mainLayer.npc && 
                            currentStep.mainLayer.dialogue &&
                            !currentStep.mainLayer.preservePrevious;
      
      if (!hasMainContent && !gameState.addonActive) {
        // No main content, show addon immediately
        setGameState(prev => ({
          ...prev,
          addonActive: true,
          nextAction: 'wait_selection'
        }));
      }
    }
  }, [currentStep, gameState.nextAction, gameState.addonActive]);

  const progress = currentMission ? ((gameState.currentStep + 1) / currentMission.steps.length) * 100 : 0;

  const getMoodText = (mood: number) => {
    if (mood > 0) return 'Friendly';
    if (mood < 0) return 'Cold';
    return 'Neutral';
  };

  const findStepIndexById = useCallback((stepId: string): number => {
    if (!currentMission) return -1;
    return currentMission.steps.findIndex(step => step.id === stepId);
  }, [currentMission]);

  const updateNextButton = useCallback((action: GameState['nextAction']) => {
    setGameState(prev => ({ ...prev, nextAction: action }));
  }, []);

  const selectChoice = useCallback((index: number, moodChange: number) => {
    if (!currentStep?.addonLayer || currentStep.addonLayer.type !== 'action_choice') return;
    
    const choice = currentStep.addonLayer.choices[index];
    
    setGameState(prev => ({
      ...prev,
      selectedChoice: index,
      mood: prev.mood + moodChange,
      selectedAction: choice.action
    }));

    // Check if this choice has a specific next step
    if (choice.nextStepId) {
      const targetStepIndex = findStepIndexById(choice.nextStepId);
      if (targetStepIndex !== -1) {
        setTimeout(() => {
          setGameState(prev => ({ 
            ...prev, 
            currentStep: targetStepIndex,
            addonActive: false,
            selectedChoice: null,
            feedbackShown: false,
            nextAction: 'show_addon'
          }));
        }, 300);
        return;
      }
    }

    // Default behavior: proceed to next step
    updateNextButton('proceed_after_feedback');
  }, [currentStep, findStepIndexById, updateNextButton]);

  const selectLanguageOption = useCallback((index: number) => {
    if (!currentStep?.addonLayer || currentStep.addonLayer.type !== 'language_choice') return;
    
    const option = currentStep.addonLayer.options[index];
    
    setGameState(prev => ({ 
      ...prev, 
      selectedChoice: index,
      nextAction: 'show_feedback'
    }));

    // Store the next step ID if specified
    if (option.nextStepId) {
      setPendingNextStepId(option.nextStepId);
    } else {
      setPendingNextStepId(null);
    }
  }, [currentStep]);

  const handleUnderstood = useCallback(() => {
    // Handle understood directly - proceed to next step
    const targetStepIndex = gameState.currentStep + 1;
    const nextStep = currentMission?.steps[targetStepIndex];
    let nextAction: GameState['nextAction'] = 'show_addon';
    
    if (nextStep?.type === 'introduction' || nextStep?.type === 'cultural' || nextStep?.type === 'completion') {
      nextAction = 'proceed';
    }
    
    setGameState(prev => ({
      ...prev,
      currentStep: targetStepIndex,
      selectedChoice: null,
      feedbackShown: false,
      addonActive: false,
      nextAction
    }));
    setCurrentFeedback(null);
    setPendingNextStepId(null);
  }, [gameState.currentStep, currentMission]);

  const showFeedback = useCallback(() => {
    if (gameState.selectedChoice === null || !currentStep?.addonLayer || currentStep.addonLayer.type !== 'language_choice') return;
    
    const option = currentStep.addonLayer.options[gameState.selectedChoice];
    const feedback = option.feedback;
    
    setCurrentFeedback(feedback);
    setGameState(prev => ({
      ...prev,
      totalXP: prev.totalXP + feedback.xp,
      feedbackShown: true,
      nextAction: 'proceed_after_feedback'
    }));
  }, [gameState.selectedChoice, currentStep]);

  const handleNext = useCallback(() => {
    switch (gameState.nextAction) {
      case 'start':
      case 'proceed':
        // If we're on a completion step and the button says "Restart Mission", restart the game
        if (currentStep?.type === 'completion') {
          setGameState({
            currentStep: 0,
            totalXP: 0,
            mood: 0,
            selectedChoice: null,
            feedbackShown: false,
            addonActive: false,
            path: [],
            nextAction: 'start'
          });
          setCurrentFeedback(null);
          setPendingNextStepId(null);
          setPreviousMainLayer(null);
          break;
        }
        
        const nextStepIndex = gameState.currentStep + 1;
        const nextStep = currentMission?.steps[nextStepIndex];
        let nextAction: GameState['nextAction'] = 'show_addon';
        
        if (nextStep?.type === 'introduction' || nextStep?.type === 'cultural' || nextStep?.type === 'completion') {
          nextAction = 'proceed';
        } else if (nextStep?.type === 'regular') {
          // Check if this regular step has no mainLayer content
          const hasMainContent = nextStep.mainLayer && 
                                nextStep.mainLayer.npc && 
                                nextStep.mainLayer.dialogue &&
                                !nextStep.mainLayer.preservePrevious;
          
          if (!hasMainContent) {
            // No main content, show addon immediately
            setGameState(prev => ({
              ...prev,
              currentStep: nextStepIndex,
              selectedChoice: null,
              feedbackShown: false,
              addonActive: true,
              nextAction: 'wait_selection'
            }));
            setCurrentFeedback(null);
            setPendingNextStepId(null);
            return;
          }
        }
        
        setGameState(prev => ({
          ...prev,
          currentStep: nextStepIndex,
          selectedChoice: null,
          feedbackShown: false,
          addonActive: false,
          nextAction
        }));
        setCurrentFeedback(null);
        setPendingNextStepId(null);
        break;

      case 'show_addon':
        setGameState(prev => ({
          ...prev,
          addonActive: true,
          nextAction: 'wait_selection'
        }));
        break;

      case 'show_feedback':
        showFeedback();
        break;

      case 'understood':
      case 'proceed_after_feedback':
        let targetStepIndex: number;
        
        // Check if we have a pending next step ID (from language choice)
        if (pendingNextStepId) {
          targetStepIndex = findStepIndexById(pendingNextStepId);
          if (targetStepIndex === -1) {
            // Fallback to next step if target not found
            targetStepIndex = gameState.currentStep + 1;
          }
        } else {
          // Default: go to next step
          targetStepIndex = gameState.currentStep + 1;
        }
        
        const nextStepAfterFeedback = currentMission?.steps[targetStepIndex];
        let nextActionAfterFeedback: GameState['nextAction'] = 'show_addon';
        
        if (nextStepAfterFeedback?.type === 'introduction' || nextStepAfterFeedback?.type === 'cultural' || nextStepAfterFeedback?.type === 'completion') {
          nextActionAfterFeedback = 'proceed';
        }
        
        setGameState(prev => ({
          ...prev,
          currentStep: targetStepIndex,
          selectedChoice: null,
          feedbackShown: false,
          addonActive: false,
          nextAction: nextActionAfterFeedback
        }));
        setCurrentFeedback(null);
        setPendingNextStepId(null);
        break;

      case 'restart':
        setGameState({
          currentStep: 0,
          totalXP: 0,
          mood: 0,
          selectedChoice: null,
          feedbackShown: false,
          addonActive: false,
          path: [],
          nextAction: 'start'
        });
        setCurrentFeedback(null);
        setPendingNextStepId(null);
        break;
    }
  }, [gameState.nextAction, gameState.currentStep, currentMission, showFeedback, pendingNextStepId, findStepIndexById, currentStep]);

  const getNextButtonText = () => {
    // Don't show button for spotlight displays - they handle their own navigation
    if (currentStep?.addonLayer?.type === 'spotlight_display' && gameState.addonActive) {
      return 'Continue';
    }
    
    switch (gameState.nextAction) {
      case 'start': return 'Start Mission';
      case 'proceed': 
        if (currentStep?.type === 'introduction') return 'Begin Mission';
        if (currentStep?.type === 'cultural') return 'Continue';
        if (currentStep?.type === 'completion') return 'Restart Mission';
        return 'Continue';
      case 'show_addon': return 'Next';
      case 'wait_selection':
      case 'wait_language_selection': return 'Select an option';
      case 'show_feedback': return 'Check Answer';
      case 'understood': return 'Continue (understood)';
      case 'proceed_after_feedback': return 'Continue';
      case 'restart': return 'Restart Mission';
      default: return 'Next';
    }
  };

  const isButtonDisabled = () => {
    // Hide button completely for spotlight displays when addon is active
    if (currentStep?.addonLayer?.type === 'spotlight_display' && gameState.addonActive) {
      return true;
    }
    
    return gameState.nextAction === 'wait_selection' || 
           gameState.nextAction === 'wait_language_selection';
  };

  const renderMainContent = () => {
    if (!currentStep) return null;
    
    switch (currentStep.type) {
      case 'introduction':
        return <IntroductionStep content={currentStep.content as IntroductionContent} />;
      
      case 'cultural':
        return <CulturalNote content={currentStep.content as CulturalContent} />;
      
      case 'completion':
        return <CompletionScreen content={currentStep.content as CompletionContent} totalXP={gameState.totalXP} />;
      
      case 'regular':
        if (currentStep.mainLayer && !currentStep.mainLayer.preservePrevious && currentStep.mainLayer.npc && currentStep.mainLayer.dialogue) {
          return (
            <NPCDisplay 
              npc={currentStep.mainLayer.npc} 
              dialogue={currentStep.mainLayer.dialogue} 
            />
          );
        }
        // If current step has no mainLayer but we have a previous one, show the previous one
        if (previousMainLayer && (!currentStep.mainLayer || !currentStep.mainLayer.npc || !currentStep.mainLayer.dialogue)) {
          return (
            <NPCDisplay 
              npc={previousMainLayer.npc} 
              dialogue={previousMainLayer.dialogue} 
            />
          );
        }
        return null;
      
      default:
        return null;
    }
  };

  const renderAddonContent = () => {
    if (!gameState.addonActive || !currentStep?.addonLayer) return null;

    switch (currentStep.addonLayer.type) {
      case 'action_choice':
        return (
          <ActionChoices
            prompt={currentStep.addonLayer.prompt}
            choices={currentStep.addonLayer.choices}
            selectedChoice={gameState.selectedChoice}
            onSelectChoice={selectChoice}
          />
        );
      
      case 'language_choice':
        return (
          <>
            <LanguageChoices
              prompt={currentStep.addonLayer.prompt}
              options={currentStep.addonLayer.options}
              selectedChoice={gameState.selectedChoice}
              onSelectOption={selectLanguageOption}
              spotlight={currentStep.addonLayer.spotlight}
            />
            {currentFeedback && <Feedback feedback={currentFeedback} />}
          </>
        );
      
      case 'spotlight_display':
        return (
          <SpotlightDisplay
            title={currentStep.addonLayer.title}
            content={currentStep.addonLayer.content}
            onUnderstood={handleUnderstood}
          />
        );
      
      default:
        return null;
    }
  };

  const handleLocationClick = (_locationId: string) => {
    setCurrentMission(baguetteMission);
    setIsInMission(true);
  };

  const handleMissionEnd = () => {
    setIsInMission(false);
    setCurrentMission(null);
    setGameState({
      currentStep: 0,
      totalXP: 0,
      mood: 0,
      selectedChoice: null,
      feedbackShown: false,
      addonActive: false,
      path: [],
      nextAction: 'start'
    });
    setCurrentFeedback(null);
    setPendingNextStepId(null);
    setPreviousMainLayer(null);
  };

  const handleMissionImport = (mission: MissionData) => {
    // Store the imported mission for future use
    console.log('Mission imported:', mission);
  };

  if (isInMission && currentMission) {
    return (
      <div className="w-full max-w-md h-screen max-h-[800px] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col mx-auto">
        <Header
          totalXP={gameState.totalXP}
          currentStep={gameState.currentStep + 1}
          totalSteps={currentMission?.steps.length || 0}
          mood={getMoodText(gameState.mood)}
          progress={progress}
        />

        <div className="flex-1 relative bg-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800">
            {renderMainContent()}
          </div>
          
          <div className={`absolute left-0 right-0 bg-slate-700 rounded-t-3xl p-8 max-h-[70%] overflow-y-auto shadow-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            gameState.addonActive ? (renderMainContent() ? 'bottom-16' : 'bottom-0') : '-bottom-full'
          }`}>
            {renderAddonContent()}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-50">
          <button
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
            onClick={handleMissionEnd}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </button>
        </div>

        <button
          className={`absolute bottom-5 left-5 right-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none p-4 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 z-50 ${
            (isButtonDisabled() || (currentStep?.addonLayer?.type === 'spotlight_display' && gameState.addonActive)) ? 'opacity-0 pointer-events-none' : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30'
          }`}
          onClick={handleNext}
          disabled={isButtonDisabled()}
        >
          {getNextButtonText()}
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <CityMap 
            language={currentLanguage} 
            onLocationClick={handleLocationClick}
          />
        );
      case 'skills':
        return <SkillArea />;
      case 'settings':
        return (
          <Settings 
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            onMissionImport={handleMissionImport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md h-screen max-h-[800px] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col mx-auto">
      {renderTabContent()}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}