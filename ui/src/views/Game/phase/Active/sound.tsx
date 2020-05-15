import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useGameSelector, useActionDispatch } from "../../../../redux";
import { selectActivePlayer } from "@fishbowl/common";

type SoundEvent = "pause" | "unpause" | "plusOne" | "minusOne";

interface SoundContext {
  isMuted: boolean;
  setMute: (isMuted: boolean) => void;
  play: (event: SoundEvent) => void;
}

const Context = React.createContext<SoundContext>({
  isMuted: true,
  setMute: () => {},
  play: () => {},
});

const STORE_KEY = "MUTED";

export const SoundContextProvider: React.FC = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(
    localStorage.getItem(STORE_KEY) === "true"
  );
  const setMute = useCallback(
    (isMuted) => {
      if (isMuted) {
        localStorage.setItem(STORE_KEY, "true");
      } else {
        localStorage.setItem(STORE_KEY, "false");
      }
      setIsMuted(isMuted);
    },
    [setIsMuted]
  );

  const sounds = useMemo<Record<SoundEvent, HTMLAudioElement>>(() => {
    return {
      pause: new Audio(
        "https://www.noiseforfun.com/waves/interface-and-media/NFF-trill.wav"
      ),
      unpause: new Audio(
        "https://www.noiseforfun.com/waves/interface-and-media/NFF-good-tip-low.wav"
      ),
      plusOne: new Audio(
        "https://www.noiseforfun.com/waves/interface-and-media/NFF-tiny-select-02.wav"
      ),
      minusOne: new Audio(
        "https://www.noiseforfun.com/waves/interface-and-media/NFF-tiny-select-03.wav"
      ),
    };
  }, []);

  const play = useCallback(
    (event: SoundEvent) => {
      if (isMuted) {
        return;
      }
      sounds[event]?.play();
    },
    [isMuted]
  );

  const soundContext = useMemo<SoundContext>(
    () => ({
      isMuted,
      setMute,
      play,
    }),
    [isMuted, setMute, play]
  );

  return <Context.Provider value={soundContext}>{children}</Context.Provider>;
};

export const useSoundContext = () => useContext(Context);
