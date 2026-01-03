import {
  Component,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AnimatedSpriteComponent } from '../sprite/animated-sprite.component';
import { AnimationConfig, ENEMY_ANIMATIONS } from '../../core/models/animation.model';
import { SpriteLoaderService } from '../../core/services/sprite-loader.service';

interface EnemyType {
  id: string;
  name: string;
  animations: string[];
}

const ENEMIES: EnemyType[] = [
  {
    id: 'barnacle',
    name: 'Barnacle',
    animations: ['barnacle_attack', 'barnacle_rest'],
  },
  {
    id: 'bee',
    name: 'Bee',
    animations: ['bee_fly', 'bee_rest'],
  },
  {
    id: 'block',
    name: 'Block',
    animations: ['block_idle', 'block_fall'],
  },
  {
    id: 'fish_blue',
    name: 'Fish (Blue)',
    animations: ['fish_blue_swim'],
  },
  {
    id: 'fish_yellow',
    name: 'Fish (Yellow)',
    animations: ['fish_yellow_swim'],
  },
  {
    id: 'fish_purple',
    name: 'Fish (Purple)',
    animations: ['fish_purple_jump'],
  },
  {
    id: 'fly',
    name: 'Fly',
    animations: ['fly_fly', 'fly_rest'],
  },
  {
    id: 'frog',
    name: 'Frog',
    animations: ['frog_idle', 'frog_jump'],
  },
  {
    id: 'ladybug',
    name: 'Ladybug',
    animations: ['ladybug_walk', 'ladybug_fly'],
  },
  {
    id: 'mouse',
    name: 'Mouse',
    animations: ['mouse_walk', 'mouse_rest'],
  },
  {
    id: 'saw',
    name: 'Saw',
    animations: ['saw_spin'],
  },
  {
    id: 'slime_normal',
    name: 'Slime',
    animations: ['slime_normal_walk', 'slime_normal_flat'],
  },
  {
    id: 'slime_fire',
    name: 'Slime (Fire)',
    animations: ['slime_fire_walk'],
  },
  {
    id: 'slime_spike',
    name: 'Slime (Spike)',
    animations: ['slime_spike_walk'],
  },
  {
    id: 'slime_block',
    name: 'Slime (Block)',
    animations: ['slime_block_walk', 'slime_block_jump'],
  },
  {
    id: 'snail',
    name: 'Snail',
    animations: ['snail_walk', 'snail_shell'],
  },
  {
    id: 'worm_normal',
    name: 'Worm',
    animations: ['worm_normal_move'],
  },
  {
    id: 'worm_ring',
    name: 'Worm (Ring)',
    animations: ['worm_ring_move'],
  },
];

@Component({
  selector: 'app-enemies-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedSpriteComponent],
  template: `
    <div class="enemies-demo">
      <h2>Enemy Animations</h2>

      <div class="controls">
        <div class="control-group">
          <label>Enemy:</label>
          <div class="button-group">
            @for (enemy of enemies; track enemy.id) {
              <button
                [class.active]="currentEnemy().id === enemy.id"
                (click)="setEnemy(enemy)"
              >
                {{ enemy.name }}
              </button>
            }
          </div>
        </div>

        <div class="control-group">
          <label>Animation:</label>
          <div class="button-group">
            @for (anim of animationNames(); track anim) {
              <button
                [class.active]="currentAnimation() === anim"
                (click)="setAnimation(anim)"
              >
                {{ formatAnimName(anim) }}
              </button>
            }
          </div>
        </div>

        <div class="control-group">
          <label>Scale: {{ scale() }}x</label>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            [value]="scale()"
            (input)="onScaleChange($event)"
          />
        </div>

        <div class="control-group">
          <label>
            <input
              type="checkbox"
              [checked]="flipX()"
              (change)="toggleFlip()"
            />
            Flip Horizontal
          </label>
        </div>
      </div>

      <div class="preview">
        @if (spriteLoader.isReady()) {
          <app-animated-sprite
            sheet="enemies"
            [animation]="currentAnimConfig()"
            [scale]="scale()"
            [flipX]="flipX()"
          />
        }
      </div>

      <div class="info">
        <p>Enemy: {{ currentEnemy().name }}</p>
        <p>Animation: {{ formatAnimName(currentAnimation()) }}</p>
        <p>Frames: {{ currentAnimConfig().frames.length }}</p>
        <p>FPS: {{ currentAnimConfig().fps }}</p>
      </div>
    </div>
  `,
  styles: `
    .enemies-demo {
      padding: 20px;
      background: #1a1a2e;
      border-radius: 8px;
      color: #eee;
    }

    h2 {
      margin: 0 0 20px;
      color: #ff6b6b;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .control-group label {
      font-size: 12px;
      text-transform: uppercase;
      color: #888;
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    button {
      padding: 8px 16px;
      border: 2px solid #333;
      background: #222;
      color: #eee;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    button:hover {
      border-color: #ff6b6b;
    }

    button.active {
      background: #ff6b6b;
      color: #000;
      border-color: #ff6b6b;
    }

    input[type="range"] {
      width: 150px;
    }

    input[type="checkbox"] {
      margin-right: 8px;
    }

    .preview {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
      background: #0f0f23;
      border: 2px dashed #333;
      border-radius: 4px;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .info {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: #666;
    }

    .info p {
      margin: 0;
    }
  `,
})
export class EnemiesDemoComponent {
  spriteLoader = inject(SpriteLoaderService);

  enemies = ENEMIES;
  currentEnemy = signal<EnemyType>(ENEMIES[0]);
  currentAnimation = signal<string>('');
  scale = signal(3);
  flipX = signal(false);

  animationNames = computed(() => {
    return this.currentEnemy().animations;
  });

  currentAnimConfig = computed((): AnimationConfig => {
    const animName = this.currentAnimation();
    return ENEMY_ANIMATIONS[animName] || ENEMY_ANIMATIONS[this.currentEnemy().animations[0]];
  });

  constructor() {
    this.currentAnimation.set(ENEMIES[0].animations[0]);
  }

  formatAnimName(name: string): string {
    const parts = name.split('_');
    return parts[parts.length - 1];
  }

  setEnemy(enemy: EnemyType): void {
    this.currentEnemy.set(enemy);
    this.currentAnimation.set(enemy.animations[0]);
  }

  setAnimation(anim: string): void {
    this.currentAnimation.set(anim);
  }

  onScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.scale.set(parseInt(target.value, 10));
  }

  toggleFlip(): void {
    this.flipX.set(!this.flipX());
  }
}
