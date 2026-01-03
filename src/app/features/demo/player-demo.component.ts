import {
  Component,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AnimatedSpriteComponent } from '../sprite/animated-sprite.component';
import {
  CHARACTER_ANIMATIONS,
  CHARACTER_COLORS,
  CharacterColor,
  AnimationConfig,
} from '../../core/models/animation.model';
import { SpriteLoaderService } from '../../core/services/sprite-loader.service';

type CharacterAnimationType = 'idle' | 'walk' | 'jump' | 'duck' | 'hit' | 'climb' | 'front';

@Component({
  selector: 'app-player-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedSpriteComponent],
  template: `
    <div class="player-demo">
      <h2>Character Animations</h2>

      <div class="controls">
        <div class="control-group">
          <label>Character:</label>
          <div class="button-group">
            @for (color of characters; track color) {
              <button
                [class.active]="currentCharacter() === color"
                [style.--accent-color]="getColorHex(color)"
                (click)="setCharacter(color)"
              >
                {{ color }}
              </button>
            }
          </div>
        </div>

        <div class="control-group">
          <label>Animation:</label>
          <div class="button-group">
            @for (anim of animationNames; track anim) {
              <button
                [class.active]="currentAnimation() === anim"
                (click)="setAnimation(anim)"
              >
                {{ anim }}
              </button>
            }
          </div>
        </div>

        <div class="control-group">
          <label>Scale: {{ scale() }}x</label>
          <input
            type="range"
            min="1"
            max="4"
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
            sheet="characters"
            [animation]="currentAnimConfig()"
            [scale]="scale()"
            [flipX]="flipX()"
          />
        }
      </div>

      <div class="info">
        <p>Character: {{ currentCharacter() }}</p>
        <p>Animation: {{ currentAnimation() }}</p>
        <p>Frames: {{ currentAnimConfig().frames.length }}</p>
        <p>FPS: {{ currentAnimConfig().fps }}</p>
      </div>
    </div>
  `,
  styles: `
    .player-demo {
      padding: 20px;
      background: #1a1a2e;
      border-radius: 8px;
      color: #eee;
    }

    h2 {
      margin: 0 0 20px;
      color: #00d9ff;
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
      text-transform: capitalize;
    }

    button:hover {
      border-color: var(--accent-color, #00d9ff);
    }

    button.active {
      background: var(--accent-color, #00d9ff);
      color: #000;
      border-color: var(--accent-color, #00d9ff);
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
export class PlayerDemoComponent {
  spriteLoader = inject(SpriteLoaderService);

  characters: CharacterColor[] = CHARACTER_COLORS;
  animationNames: CharacterAnimationType[] = ['idle', 'walk', 'jump', 'duck', 'hit', 'climb', 'front'];

  currentCharacter = signal<CharacterColor>('beige');
  currentAnimation = signal<CharacterAnimationType>('walk');
  scale = signal(2);
  flipX = signal(false);

  currentAnimConfig = computed((): AnimationConfig => {
    return CHARACTER_ANIMATIONS[this.currentCharacter()][this.currentAnimation()];
  });

  getColorHex(color: CharacterColor): string {
    const colors: Record<CharacterColor, string> = {
      beige: '#f5deb3',
      green: '#6bcb77',
      pink: '#ff6b9d',
      purple: '#9b59b6',
      yellow: '#f1c40f',
    };
    return colors[color];
  }

  setCharacter(color: CharacterColor): void {
    this.currentCharacter.set(color);
  }

  setAnimation(anim: CharacterAnimationType): void {
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
