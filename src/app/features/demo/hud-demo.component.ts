import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SpriteComponent } from '../sprite/sprite.component';
import { SpriteLoaderService } from '../../core/services/sprite-loader.service';

@Component({
  selector: 'app-hud-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpriteComponent],
  template: `
    <div class="hud-demo">
      <h2>HUD Elements</h2>

      <div class="controls">
        <div class="control-group">
          <label>Scale: {{ scale() }}x</label>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            [value]="scale()"
            (input)="onScaleChange($event)"
          />
        </div>
      </div>

      @if (spriteLoader.isReady()) {
        <div class="hud-sections">
          <div class="hud-section">
            <h3>Health</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="hud_heart" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_heart" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_heart_half" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_heart_empty" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_heart_empty" [scale]="scale()" />
            </div>
          </div>

          <div class="hud-section">
            <h3>Score</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="hud_coin" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_character_multiply" [scale]="scale()" />
              @for (digit of scoreDigits; track $index) {
                <app-sprite sheet="tiles" [frame]="'hud_character_' + digit" [scale]="scale()" />
              }
            </div>
          </div>

          <div class="hud-section">
            <h3>Keys</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="hud_key_blue" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_key_green" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_key_red" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_key_yellow" [scale]="scale()" />
            </div>
          </div>

          <div class="hud-section">
            <h3>Player Icons</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="hud_player_beige" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_green" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_pink" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_purple" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_yellow" [scale]="scale()" />
            </div>
          </div>

          <div class="hud-section">
            <h3>Player Helmets</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="hud_player_helmet_beige" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_helmet_green" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_helmet_pink" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_helmet_purple" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="hud_player_helmet_yellow" [scale]="scale()" />
            </div>
          </div>

          <div class="hud-section">
            <h3>Numbers</h3>
            <div class="hud-row">
              @for (num of numbers; track $index) {
                <app-sprite sheet="tiles" [frame]="'hud_character_' + num" [scale]="scale()" />
              }
            </div>
          </div>

          <div class="hud-section">
            <h3>Gems</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="gem_blue" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="gem_green" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="gem_red" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="gem_yellow" [scale]="scale()" />
            </div>
          </div>

          <div class="hud-section">
            <h3>Coins</h3>
            <div class="hud-row">
              <app-sprite sheet="tiles" frame="coin_bronze" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="coin_silver" [scale]="scale()" />
              <app-sprite sheet="tiles" frame="coin_gold" [scale]="scale()" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .hud-demo {
      padding: 20px;
      background: #1a1a2e;
      border-radius: 8px;
      color: #eee;
    }

    h2 {
      margin: 0 0 20px;
      color: #ff9f43;
    }

    h3 {
      margin: 0 0 12px;
      font-size: 14px;
      color: #888;
    }

    .controls {
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

    input[type="range"] {
      width: 150px;
    }

    .hud-sections {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .hud-section {
      background: #0f0f23;
      padding: 16px;
      border-radius: 8px;
      border: 2px solid #333;
    }

    .hud-row {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }
  `,
})
export class HudDemoComponent {
  spriteLoader = inject(SpriteLoaderService);

  scale = signal(2);
  scoreDigits = ['1', '2', '3', '4'];
  numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  onScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.scale.set(parseInt(target.value, 10));
  }
}
