/**
 * Configuration for a sprite animation.
 * Defines the sequence of frames, playback speed, and looping behavior.
 */
export interface AnimationConfig {
  /** Animation name identifier */
  name: string;
  /** Array of frame names in the animation sequence */
  frames: string[];
  /** Frames per second (playback speed) */
  fps: number;
  /** Whether the animation should loop */
  loop: boolean;
}

/** Available character colors */
export type CharacterColor = 'beige' | 'green' | 'pink' | 'purple' | 'yellow';

/** Array of all available character colors */
export const CHARACTER_COLORS: CharacterColor[] = ['beige', 'green', 'pink', 'purple', 'yellow'];

/**
 * Factory function to create character animations with a specific color.
 * Generates all animation configurations for a character (idle, walk, jump, duck, hit, climb, front).
 * @param color - The character color
 * @returns Record of animation configurations
 */
export function createCharacterAnimations(color: CharacterColor): Record<string, AnimationConfig> {
  const prefix = `character_${color}`;
  return {
    idle: {
      name: 'idle',
      frames: [`${prefix}_idle`],
      fps: 1,
      loop: true,
    },
    walk: {
      name: 'walk',
      frames: [`${prefix}_walk_a`, `${prefix}_walk_b`],
      fps: 8,
      loop: true,
    },
    jump: {
      name: 'jump',
      frames: [
        `${prefix}_walk_a`, `${prefix}_walk_b`,
        `${prefix}_jump`, `${prefix}_jump`, `${prefix}_jump`,
        `${prefix}_duck`,
        `${prefix}_walk_a`, `${prefix}_walk_b`,
      ],
      fps: 10,
      loop: true,
    },
    duck: {
      name: 'duck',
      frames: [`${prefix}_idle`, `${prefix}_duck`, `${prefix}_duck`, `${prefix}_duck`],
      fps: 4,
      loop: true,
    },
    hit: {
      name: 'hit',
      frames: [`${prefix}_hit`, `${prefix}_hit`, `${prefix}_idle`],
      fps: 3,
      loop: true,
    },
    climb: {
      name: 'climb',
      frames: [`${prefix}_climb_a`, `${prefix}_climb_b`],
      fps: 6,
      loop: true,
    },
    front: {
      name: 'front',
      frames: [`${prefix}_front`],
      fps: 1,
      loop: true,
    },
  };
}

// Pre-built animations for each character color
export const CHARACTER_ANIMATIONS: Record<CharacterColor, Record<string, AnimationConfig>> = {
  beige: createCharacterAnimations('beige'),
  green: createCharacterAnimations('green'),
  pink: createCharacterAnimations('pink'),
  purple: createCharacterAnimations('purple'),
  yellow: createCharacterAnimations('yellow'),
};

export const ENEMY_ANIMATIONS: Record<string, AnimationConfig> = {
  // Barnacle
  barnacle_attack: {
    name: 'barnacle_attack',
    frames: ['barnacle_attack_a', 'barnacle_attack_b'],
    fps: 4,
    loop: true,
  },
  barnacle_rest: {
    name: 'barnacle_rest',
    frames: ['barnacle_attack_rest'],
    fps: 1,
    loop: true,
  },
  // Bee
  bee_fly: {
    name: 'bee_fly',
    frames: ['bee_a', 'bee_b'],
    fps: 12,
    loop: true,
  },
  bee_rest: {
    name: 'bee_rest',
    frames: ['bee_rest'],
    fps: 1,
    loop: true,
  },
  // Block
  block_idle: {
    name: 'block_idle',
    frames: ['block_idle'],
    fps: 1,
    loop: true,
  },
  block_fall: {
    name: 'block_fall',
    frames: ['block_fall'],
    fps: 1,
    loop: true,
  },
  // Fish Blue
  fish_blue_swim: {
    name: 'fish_blue_swim',
    frames: ['fish_blue_swim_a', 'fish_blue_swim_b'],
    fps: 8,
    loop: true,
  },
  // Fish Yellow
  fish_yellow_swim: {
    name: 'fish_yellow_swim',
    frames: ['fish_yellow_swim_a', 'fish_yellow_swim_b'],
    fps: 8,
    loop: true,
  },
  // Fish Purple
  fish_purple_jump: {
    name: 'fish_purple_jump',
    frames: ['fish_purple_up', 'fish_purple_down'],
    fps: 4,
    loop: true,
  },
  // Fly
  fly_fly: {
    name: 'fly_fly',
    frames: ['fly_a', 'fly_b'],
    fps: 12,
    loop: true,
  },
  fly_rest: {
    name: 'fly_rest',
    frames: ['fly_rest'],
    fps: 1,
    loop: true,
  },
  // Frog
  frog_idle: {
    name: 'frog_idle',
    frames: ['frog_idle'],
    fps: 1,
    loop: true,
  },
  frog_jump: {
    name: 'frog_jump',
    frames: ['frog_idle', 'frog_jump', 'frog_jump', 'frog_idle'],
    fps: 6,
    loop: true,
  },
  // Ladybug
  ladybug_walk: {
    name: 'ladybug_walk',
    frames: ['ladybug_walk_a', 'ladybug_walk_b'],
    fps: 6,
    loop: true,
  },
  ladybug_fly: {
    name: 'ladybug_fly',
    frames: ['ladybug_fly'],
    fps: 1,
    loop: true,
  },
  // Mouse
  mouse_walk: {
    name: 'mouse_walk',
    frames: ['mouse_walk_a', 'mouse_walk_b'],
    fps: 8,
    loop: true,
  },
  mouse_rest: {
    name: 'mouse_rest',
    frames: ['mouse_rest'],
    fps: 1,
    loop: true,
  },
  // Saw
  saw_spin: {
    name: 'saw_spin',
    frames: ['saw_a', 'saw_b'],
    fps: 12,
    loop: true,
  },
  // Slime Normal
  slime_normal_walk: {
    name: 'slime_normal_walk',
    frames: ['slime_normal_walk_a', 'slime_normal_walk_b'],
    fps: 6,
    loop: true,
  },
  slime_normal_flat: {
    name: 'slime_normal_flat',
    frames: ['slime_normal_flat'],
    fps: 1,
    loop: true,
  },
  // Slime Fire
  slime_fire_walk: {
    name: 'slime_fire_walk',
    frames: ['slime_fire_walk_a', 'slime_fire_walk_b'],
    fps: 6,
    loop: true,
  },
  // Slime Spike
  slime_spike_walk: {
    name: 'slime_spike_walk',
    frames: ['slime_spike_walk_a', 'slime_spike_walk_b'],
    fps: 6,
    loop: true,
  },
  // Slime Block
  slime_block_walk: {
    name: 'slime_block_walk',
    frames: ['slime_block_walk_a', 'slime_block_walk_b'],
    fps: 6,
    loop: true,
  },
  slime_block_jump: {
    name: 'slime_block_jump',
    frames: ['slime_block_walk_a', 'slime_block_jump', 'slime_block_jump', 'slime_block_walk_b'],
    fps: 6,
    loop: true,
  },
  // Snail
  snail_walk: {
    name: 'snail_walk',
    frames: ['snail_walk_a', 'snail_walk_b'],
    fps: 4,
    loop: true,
  },
  snail_shell: {
    name: 'snail_shell',
    frames: ['snail_shell'],
    fps: 1,
    loop: true,
  },
  // Worm Normal
  worm_normal_move: {
    name: 'worm_normal_move',
    frames: ['worm_normal_move_a', 'worm_normal_move_b'],
    fps: 4,
    loop: true,
  },
  // Worm Ring
  worm_ring_move: {
    name: 'worm_ring_move',
    frames: ['worm_ring_move_a', 'worm_ring_move_b'],
    fps: 4,
    loop: true,
  },
};
