# VOICEPRINT Audio Recording Slots

Place your real recorded audio files in this directory:

- `siddharth-intro.mp3` -> Played by the Hero section's **"Listen to My Story"** AudioStoryPlayer.
  - Duration: ~1 minute 18 seconds (78 seconds).
  - Synchronized transcript is configured in `src/data/portfolioData.ts` under `PERSONAL_INTRO_AUDIO`.
  - When this file is placed here, the player automatically detects it, plays your authentic recorded voice, and displays the **CUSTOM AUDIO RECORDING** badge.
  - When no audio file is uploaded yet, VOICEPRINT transparently uses real-time Web Speech Synthesis preview with synchronized transcript highlighting, clearly marked to recruiters so there is zero confusion or fake AI cloning.

- Additional chapter audios (optional):
  - Place any chapter-specific recordings here if you wish to link them directly into `ORIGIN_SECTIONS` in `src/data/portfolioData.ts`.
