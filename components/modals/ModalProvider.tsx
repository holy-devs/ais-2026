'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { SpeakerDTO, PastEventDTO } from '@/lib/map';
import SpeakerProfileModal from './SpeakerProfileModal';
import PastEventModal from './PastEventModal';

type ModalState =
  | { kind: 'speaker'; data: SpeakerDTO }
  | { kind: 'pastEvent'; data: PastEventDTO }
  | null;

interface ModalApi {
  openSpeaker: (d: SpeakerDTO) => void;
  openPastEvent: (d: PastEventDTO) => void;
  close: () => void;
}

const Ctx = createContext<ModalApi | null>(null);

export function useModal(): ModalApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useModal must be used within <ModalProvider>');
  return ctx;
}

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>(null);

  const openSpeaker = useCallback((data: SpeakerDTO) => setState({ kind: 'speaker', data }), []);
  const openPastEvent = useCallback((data: PastEventDTO) => setState({ kind: 'pastEvent', data }), []);
  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = state ? 'hidden' : '';
    return () => document.removeEventListener('keydown', onKey);
  }, [state, close]);

  return (
    <Ctx.Provider value={{ openSpeaker, openPastEvent, close }}>
      {children}
      {state?.kind === 'speaker' && <SpeakerProfileModal data={state.data} onClose={close} />}
      {state?.kind === 'pastEvent' && <PastEventModal data={state.data} onClose={close} />}
    </Ctx.Provider>
  );
}
