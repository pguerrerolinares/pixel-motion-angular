import {
  Component,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SpriteComponent } from '../sprite/sprite.component';
import { AnimatedSpriteComponent } from '../sprite/animated-sprite.component';
import { SpriteLoaderService } from '../../core/services/sprite-loader.service';
import { CHARACTER_ANIMATIONS, ENEMY_ANIMATIONS } from '../../core/models/animation.model';

type BackgroundType = 'hills' | 'desert' | 'mushrooms' | 'trees' | 'clouds';

@Component({
  selector: 'app-scene-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpriteComponent, AnimatedSpriteComponent],
  template: `
    <div class="scene-demo">
      <h2>Game Scene Preview</h2>

      <div class="controls">
        <div class="control-group">
          <label>Background:</label>
          <div class="button-group">
            @for (bg of backgrounds; track bg) {
              <button
                [class.active]="selectedBackground() === bg"
                (click)="setBackground(bg)"
              >
                {{ bg }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (spriteLoader.isReady()) {
        <div class="game-scene">
          <!-- Background layer (tiled) -->
          <div class="background-layer">
            @for (row of bgRows; track $index) {
              <div class="bg-row">
                @for (col of bgCols; track $index) {
                  <app-sprite
                    sheet="backgrounds"
                    [frame]="backgroundFrame()"
                    [scale]="2"
                  />
                }
              </div>
            }
          </div>

          <!-- HUD Layer -->
          <div class="hud-layer">
            <div class="hud-left">
              <app-sprite sheet="tiles" frame="hud_player_beige" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_character_multiply" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_character_3" [scale]="1" />
            </div>
            <div class="hud-center">
              <app-sprite sheet="tiles" frame="hud_heart" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_heart" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_heart_half" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_heart_empty" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_heart_empty" [scale]="1" />
            </div>
            <div class="hud-right">
              <app-sprite sheet="tiles" frame="hud_coin" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_character_multiply" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_character_4" [scale]="1" />
              <app-sprite sheet="tiles" frame="hud_character_2" [scale]="1" />
            </div>
          </div>

          <!-- Game Layer -->
          <div class="game-layer">
            <!-- Decorations -->
            <div class="decoration" style="left: 32px; bottom: 64px;">
              <app-sprite sheet="tiles" frame="bush" [scale]="1" />
            </div>
            <div class="decoration" style="left: 600px; bottom: 64px;">
              <app-sprite sheet="tiles" frame="mushroom_brown" [scale]="1" />
            </div>
            <div class="decoration" style="left: 680px; bottom: 64px;">
              <app-sprite sheet="tiles" frame="mushroom_red" [scale]="1" />
            </div>

            <!-- Floating platform -->
            <div class="platform" style="left: 280px; bottom: 180px;">
              <app-sprite sheet="tiles" frame="terrain_grass_horizontal_left" [scale]="1" />
              <app-sprite sheet="tiles" frame="terrain_grass_horizontal_middle" [scale]="1" />
              <app-sprite sheet="tiles" frame="terrain_grass_horizontal_right" [scale]="1" />
            </div>

            <!-- Items on platform -->
            <div class="item" style="left: 310px; bottom: 244px;">
              <app-sprite sheet="tiles" frame="coin_gold" [scale]="1" />
            </div>
            <div class="item" style="left: 374px; bottom: 244px;">
              <app-sprite sheet="tiles" frame="gem_blue" [scale]="1" />
            </div>

            <!-- Player -->
            <div class="player" style="left: 100px; bottom: 64px;">
              <app-sprite
                sheet="characters"
                frame="character_beige_idle"
                [scale]="1"
              />
            </div>

            <!-- Enemies -->
            <div class="enemy" style="left: 400px; bottom: 64px;">
              <app-animated-sprite
                sheet="enemies"
                [animation]="ENEMY_ANIMATIONS['slime_normal_walk']"
                [scale]="1"
              />
            </div>
            <div class="enemy" style="left: 500px; bottom: 150px;">
              <app-animated-sprite
                sheet="enemies"
                [animation]="ENEMY_ANIMATIONS['bee_fly']"
                [scale]="1"
                [flipX]="true"
              />
            </div>

            <!-- Ground tiles -->
            <div class="ground">
              @for (i of groundTiles; track $index) {
                <div class="ground-tile">
                  @if ($index === 0) {
                    <app-sprite sheet="tiles" [frame]="getGroundFrame('left')" [scale]="1" />
                  } @else if ($index === groundTiles.length - 1) {
                    <app-sprite sheet="tiles" [frame]="getGroundFrame('right')" [scale]="1" />
                  } @else {
                    <app-sprite sheet="tiles" [frame]="getGroundFrame('middle')" [scale]="1" />
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .scene-demo {
      padding: 20px;
      background: #1a1a2e;
      border-radius: 8px;
      color: #eee;
    }

    h2 {
      margin: 0 0 20px;
      color: #9b59b6;
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
      border-color: #9b59b6;
    }

    button.active {
      background: #9b59b6;
      color: #fff;
      border-color: #9b59b6;
    }

    .game-scene {
      position: relative;
      width: 100%;
      max-width: 768px;
      height: 480px;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      border: 4px solid #333;
    }

    .background-layer {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .bg-row {
      display: flex;
      flex-shrink: 0;
    }

    .hud-layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
      z-index: 10;
    }

    .hud-left,
    .hud-center,
    .hud-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .game-layer {
      position: absolute;
      inset: 0;
    }

    .ground {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
    }

    .ground-tile {
      flex-shrink: 0;
    }

    .player,
    .enemy,
    .item,
    .decoration,
    .platform {
      position: absolute;
    }

    .platform {
      display: flex;
    }
  `,
})
export class SceneDemoComponent {
  spriteLoader = inject(SpriteLoaderService);

  CHARACTER_ANIMATIONS = CHARACTER_ANIMATIONS;
  ENEMY_ANIMATIONS = ENEMY_ANIMATIONS;

  backgrounds: BackgroundType[] = ['hills', 'desert', 'mushrooms', 'trees', 'clouds'];
  selectedBackground = signal<BackgroundType>('hills');

  groundTiles = Array(12).fill(0);
  bgRows = Array(2).fill(0);
  bgCols = Array(2).fill(0);

  backgroundFrame = computed(() => {
    const bg = this.selectedBackground();
    if (bg === 'clouds') {
      return 'background_clouds';
    }
    return `background_color_${bg}`;
  });

  getGroundFrame(position: 'left' | 'middle' | 'right'): string {
    const bg = this.selectedBackground();
    const terrain = bg === 'desert' ? 'sand' : bg === 'mushrooms' ? 'purple' : 'grass';
    return `terrain_${terrain}_block_top${position === 'middle' ? '' : '_' + position}`;
  }

  setBackground(bg: BackgroundType): void {
    this.selectedBackground.set(bg);
  }
}
