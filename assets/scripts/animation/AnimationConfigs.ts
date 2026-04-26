import { SpriteFrame } from 'cc';

export interface ClipConfig {
  name: string;
  fps: number;
  wrapMode: 'loop' | 'once';
  frames: string[];
}

export const ZAVRIK_ANIMATIONS: ClipConfig[] = [
  {
    name: 'zavrik_idle',
    fps: 6,
    wrapMode: 'loop',
    frames: [
      'characters/zavrik/idle_01/spriteFrame',
      'characters/zavrik/idle_02/spriteFrame',
      'characters/zavrik/idle_03/spriteFrame',
      'characters/zavrik/idle_04/spriteFrame',
    ],
  },
  {
    name: 'zavrik_jump',
    fps: 8,
    wrapMode: 'once',
    frames: [
      'characters/zavrik/jump_01/spriteFrame',
      'characters/zavrik/jump_02/spriteFrame',
      'characters/zavrik/jump_03/spriteFrame',
      'characters/zavrik/jump_04/spriteFrame',
    ],
  },
  {
    name: 'bukvoed_laugh',
    fps: 7,
    wrapMode: 'loop',
    frames: [
      'characters/bukvoed/laugh_01/spriteFrame',
      'characters/bukvoed/laugh_02/spriteFrame',
      'characters/bukvoed/laugh_03/spriteFrame',
      'characters/bukvoed/laugh_04/spriteFrame',
    ],
  },
];

export const ALL_ANIMATION_RESOURCES: ReadonlyArray<string> = ZAVRIK_ANIMATIONS.flatMap((clip) => clip.frames);

export type SpriteFrameMap = Map<string, SpriteFrame>;
