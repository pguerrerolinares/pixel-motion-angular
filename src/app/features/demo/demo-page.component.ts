import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { SpriteLoaderService } from '../../core/services/sprite-loader.service';
import { PlayerDemoComponent } from './player-demo.component';
import { EnemiesDemoComponent } from './enemies-demo.component';
import { TilesDemoComponent } from './tiles-demo.component';
import { HudDemoComponent } from './hud-demo.component';
import { SceneDemoComponent } from './scene-demo.component';

type TabId = 'scene' | 'player' | 'enemies' | 'tiles' | 'hud';

@Component({
  selector: 'app-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlayerDemoComponent,
    EnemiesDemoComponent,
    TilesDemoComponent,
    HudDemoComponent,
    SceneDemoComponent,
  ],
  template: `
    <div class="demo-page">
      <header>
        <h1>Pixel Motion - Sprite System POC</h1>
        <p>Angular 21 | Zoneless | Signals | OnPush</p>
      </header>

      @if (spriteLoader.isLoading()) {
        <div class="loading">
          <div class="loading-bar">
            <div
              class="loading-progress"
              [style.width.%]="spriteLoader.loadProgress()"
            ></div>
          </div>
          <p>Loading sprites... {{ spriteLoader.loadProgress() }}%</p>
        </div>
      } @else if (spriteLoader.isReady()) {
        <nav class="tabs">
          @for (tab of tabs; track tab.id) {
            <button
              [class.active]="activeTab() === tab.id"
              (click)="setTab(tab.id)"
            >
              {{ tab.label }}
            </button>
          }
        </nav>

        <main class="content">
          @switch (activeTab()) {
            @case ('scene') {
              <app-scene-demo />
            }
            @case ('player') {
              <app-player-demo />
            }
            @case ('enemies') {
              <app-enemies-demo />
            }
            @case ('tiles') {
              <app-tiles-demo />
            }
            @case ('hud') {
              <app-hud-demo />
            }
          }
        </main>
      }

      <footer>
        <p>Assets: Platformer Pack by Kenney.nl</p>
      </footer>
    </div>
  `,
  styles: `
    .demo-page {
      min-height: 100vh;
      background: #0f0f23;
      color: #eee;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    header {
      padding: 40px 20px 20px;
      text-align: center;
      background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
    }

    header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      background: linear-gradient(90deg, #9cc2c8ff, #c27e7eff, #e4c85cff, #83b58aff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    header p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
    }

    .loading-bar {
      width: 300px;
      height: 8px;
      background: #1a1a2e;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .loading-progress {
      height: 100%;
      background: linear-gradient(90deg, #00d9ff, #6bcb77);
      transition: width 0.3s ease;
    }

    .loading p {
      margin: 0;
      color: #666;
    }

    .tabs {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 20px;
      background: #1a1a2e;
      border-bottom: 1px solid #333;
    }

    .tabs button {
      padding: 12px 24px;
      background: transparent;
      border: 2px solid #333;
      color: #888;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      border-radius: 4px;
    }

    .tabs button:hover {
      color: #eee;
      border-color: #555;
    }

    .tabs button.active {
      background: #00d9ff;
      color: #000;
      border-color: #00d9ff;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    footer {
      padding: 20px;
      text-align: center;
      border-top: 1px solid #1a1a2e;
    }

    footer p {
      margin: 0;
      font-size: 12px;
      color: #444;
    }
  `,
})
export class DemoPageComponent implements OnInit {
  spriteLoader = inject(SpriteLoaderService);

  tabs: { id: TabId; label: string }[] = [
    { id: 'scene', label: 'Scene' },
    { id: 'player', label: 'Characters' },
    { id: 'enemies', label: 'Enemies' },
    { id: 'tiles', label: 'Tiles & Items' },
    { id: 'hud', label: 'HUD' },
  ];

  activeTab = signal<TabId>('scene');

  ngOnInit(): void {
    this.spriteLoader.preloadAll();
  }

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }
}
