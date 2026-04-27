import { useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface AntiCheatingOptions {
  onCheatingDetected?: (type: 'tab_switch' | 'copy_paste' | 'screenshot') => void;
  onAutoSubmit?: () => void;
  onWarning?: (message: string) => void;
  showWarnings?: boolean;
  autoSubmitOnCheat?: boolean;
  quizId?: number;
  isLeaving?: boolean;
  timeLeft?: number | null;
}

export function useAntiCheating(options: AntiCheatingOptions = {}) {
  const {
    onCheatingDetected,
    onAutoSubmit,
    onWarning,
    showWarnings = true,
    autoSubmitOnCheat = true,
    quizId,
    isLeaving = false,
    timeLeft,
  } = options;
  const isMobile = useIsMobile();

  const getTabSwitchKey = () => `quiz_tab_switches_${quizId}`;

  const showWarning = useCallback((message: string) => {
    onWarning?.(message);
    if (showWarnings) {
      alert(`Warning: ${message}`);
    }
  }, [onWarning, showWarnings]);

  const getTabSwitchCount = () => {
    const stored = sessionStorage.getItem(getTabSwitchKey());
    return stored ? parseInt(stored, 10) : 0;
  };

  const setTabSwitchCount = (count: number) => {
    sessionStorage.setItem(getTabSwitchKey(), count.toString());
  };

  const tabSwitchCountRef = useRef(getTabSwitchCount());
  const lastTabSwitchTimeRef = useRef(0);
  const tabSwitchCycleCountedRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const TAB_SWITCH_WARNING_LIMIT = 3;

  const getCheatingDelay = useCallback(() => {
    if (timeLeft == null || timeLeft <= 0) return 100;
    if (timeLeft <= 300) return 200;
    if (timeLeft <= 600) return 500;
    return 1000;
  }, [timeLeft]);

  const reportCheating = useCallback(async (type: 'tab_switch' | 'copy_paste' | 'screenshot') => {
    onCheatingDetected?.(type);

    if (autoSubmitOnCheat && onAutoSubmit && type === 'screenshot') {
      const delay = getCheatingDelay();
      setTimeout(() => {
        onAutoSubmit();
      }, delay);
    }
  }, [onCheatingDetected, onAutoSubmit, autoSubmitOnCheat, quizId, timeLeft, getCheatingDelay]);

  useEffect(() => {
    if (isLeaving || isMobile) return;
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      reportCheating('copy_paste');
      showWarning("Right-click context menu disabled. Copying quiz content is not allowed.");
    };

    const disablePasteInAnswers = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isAnswerInput = target.tagName === 'TEXTAREA' ||
      (target.tagName === 'INPUT' && target.getAttribute('type') === 'text');

      if (isAnswerInput) {
        e.preventDefault();
        reportCheating('copy_paste');
          showWarning("Pasting text into answer fields is not allowed. Please type your answers manually.");
      }
    };

    const disableKeyShortcuts = (e: KeyboardEvent) => {
      const isPasteShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';
      const isCopyShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
      const isCutShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x';

      const target = e.target as HTMLElement;
      const isAnswerInput = target.tagName === 'TEXTAREA' ||
                           (target.tagName === 'INPUT' && target.getAttribute('type') === 'text');

      if (isPasteShortcut && isAnswerInput) {
        e.preventDefault();
        reportCheating('copy_paste');
        showWarning("Pasting text into answer fields is not allowed. Please type your answers manually.");
        return;
      }

      if (isCopyShortcut || isCutShortcut) {
        e.preventDefault();
        reportCheating('copy_paste');
          showWarning("Copying or cutting quiz content is not allowed.");
        return;
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("paste", disablePasteInAnswers);
    document.addEventListener("keydown", disableKeyShortcuts);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("paste", disablePasteInAnswers);
      document.removeEventListener("keydown", disableKeyShortcuts);
    };
  }, [reportCheating, showWarning, isLeaving, isMobile]);

  useEffect(() => {
    if (isLeaving || isMobile) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleTabSwitchAttempt();
      } else {
        tabSwitchCycleCountedRef.current = false;
      }
    };

    const handleTabSwitchAttempt = () => {
      if (tabSwitchCycleCountedRef.current) {
        return;
      }

      const now = Date.now();
      if (now - lastTabSwitchTimeRef.current < 1000) {
        return;
      }

      lastTabSwitchTimeRef.current = now;
      tabSwitchCycleCountedRef.current = true;
      tabSwitchCountRef.current += 1;
      const count = tabSwitchCountRef.current;
      setTabSwitchCount(count);

      reportCheating('tab_switch');

      if (count >= TAB_SWITCH_WARNING_LIMIT) {
        showWarning(`${TAB_SWITCH_WARNING_LIMIT}/${TAB_SWITCH_WARNING_LIMIT}: Repeated tab/app switching detected. Your quiz will now be auto-submitted.`);
        if (autoSubmitOnCheat && onAutoSubmit && !autoSubmittedRef.current) {
          autoSubmittedRef.current = true;
          const delay = getCheatingDelay();
          setTimeout(() => {
            onAutoSubmit();
          }, delay);
        }
        return;
      }

      showWarning(`${count}/${TAB_SWITCH_WARNING_LIMIT}: Switching tabs or using Alt+Tab is not allowed during the quiz.`);
      window.focus();
      if (document.body) {
        (document.body as HTMLElement).focus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reportCheating, showWarning, isLeaving, autoSubmitOnCheat, onAutoSubmit, isMobile]);

  useEffect(() => {
    if (isLeaving || isMobile) return;

    const preventScreenshot = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        e.stopPropagation();
        reportCheating('screenshot');
        showWarning("Screenshots are not allowed. Taking screenshots of quiz content is prohibited.");
        return;
      }

      if (e.altKey && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        e.preventDefault();
        e.stopPropagation();
        reportCheating('screenshot');
        showWarning("Screenshots are not allowed. Alt+Print Screen is disabled during the quiz.");
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === 's' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        reportCheating('screenshot');
        showWarning("Screenshots are not allowed. Snip & Sketch tool is disabled during the quiz.");
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'PrintScreen' || e.keyCode === 44)) {
        e.preventDefault();
        e.stopPropagation();
        reportCheating('screenshot');
        showWarning("Screenshots are not allowed. Saving screenshots is prohibited during the quiz.");
        return;
      }
    };

    window.addEventListener("keydown", preventScreenshot, true);
    window.addEventListener("keyup", preventScreenshot, true);

    return () => {
      window.removeEventListener("keydown", preventScreenshot, true);
      window.removeEventListener("keyup", preventScreenshot, true);
    };
  }, [reportCheating, showWarning, isLeaving, isMobile]);
}
