'use client';

import React, { useState, useCallback } from 'react';
import { GameState, Feedback as FeedbackType, IntroductionContent, CulturalContent, CompletionContent, MissionData } from '@/types/mission';
import { baguetteMission } from '@/data/baguetteMission';
import MissionInput from '@/components/MissionInput';
import Header from '@/components/Header';
import IntroductionStep from '@/components/IntroductionStep';
import NPCDisplay from '@/components/NPCDisplay';
import ActionChoices from '@/components/ActionChoices';
import LanguageChoices from '@/components/LanguageChoices';
import Feedback from '@/components/Feedback';
import CulturalNote from '@/components/CulturalNote';
import CompletionScreen from '@/components/CompletionScreen';

export default function Home() {
  const [currentMission, setCurrentMission] = useState<MissionData | null>(null);
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

  const currentStep = currentMission?.steps[gameState.currentStep];
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
    if (!currentStep?.addonLayer?.choices) return;
    
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
    if (!currentStep?.addonLayer?.options) return;
    
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

  const showFeedback = useCallback(() => {
    if (gameState.selectedChoice === null || !currentStep?.addonLayer?.options) return;
    
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
        const nextStepIndex = gameState.currentStep + 1;
        const nextStep = currentMission?.steps[nextStepIndex];
        let nextAction: GameState['nextAction'] = 'show_addon';
        
        if (nextStep?.type === 'introduction' || nextStep?.type === 'cultural' || nextStep?.type === 'completion') {
          nextAction = 'proceed';
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
  }, [gameState.nextAction, gameState.currentStep, currentMission, showFeedback, pendingNextStepId, findStepIndexById]);

  const getNextButtonText = () => {
    switch (gameState.nextAction) {
      case 'start': return 'Start Mission';
      case 'proceed': 
        if (currentStep?.type === 'introduction') return 'Begin Mission';
        if (currentStep?.type === 'cultural') return 'Continue';
        return 'Continue';
      case 'show_addon': return 'Next';
      case 'wait_selection':
      case 'wait_language_selection': return 'Select an option';
      case 'show_feedback': return 'Check Answer';
      case 'proceed_after_feedback': return 'Continue';
      case 'restart': return 'Restart Mission';
      default: return 'Next';
    }
  };

  const isButtonDisabled = () => {
    return gameState.nextAction === 'wait_selection' || gameState.nextAction === 'wait_language_selection';
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
        if (currentStep.mainLayer && !currentStep.mainLayer.preservePrevious) {
          return (
            <NPCDisplay 
              npc={currentStep.mainLayer.npc!} 
              dialogue={currentStep.mainLayer.dialogue!} 
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
            choices={currentStep.addonLayer.choices!}
            selectedChoice={gameState.selectedChoice}
            onSelectChoice={selectChoice}
          />
        );
      
      case 'language_choice':
        return (
          <>
            <LanguageChoices
              prompt={currentStep.addonLayer.prompt}
              options={currentStep.addonLayer.options!}
              selectedChoice={gameState.selectedChoice}
              onSelectOption={selectLanguageOption}
              spotlight={currentStep.addonLayer.spotlight}
            />
            {currentFeedback && <Feedback feedback={currentFeedback} />}
          </>
        );
      
      default:
        return null;
    }
  };

  // Show mission input if no mission is loaded
  if (!currentMission) {
    return (
      <MissionInput 
        onMissionLoaded={setCurrentMission}
        defaultMission={baguetteMission}
      />
    );
  }

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
          gameState.addonActive ? 'bottom-16' : '-bottom-full'
        }`}>
          {renderAddonContent()}
        </div>
      </div>

      <button
        className={`absolute bottom-5 left-5 right-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none p-4 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 z-50 ${
          isButtonDisabled() ? 'opacity-50 pointer-events-none' : 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30'
        }`}
        onClick={handleNext}
        disabled={isButtonDisabled()}
      >
        {getNextButtonText()}
      </button>
    </div>
  );
}