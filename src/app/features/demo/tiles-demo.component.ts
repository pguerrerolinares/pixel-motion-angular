import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SpriteComponent } from '../sprite/sprite.component';
import { SpriteLoaderService } from '../../core/services/sprite-loader.service';

@Component({
  selector: 'app-tiles-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpriteComponent],
  template: `
    <div class="tiles-demo">
      <h2>Tiles & Items</h2>

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

        <div class="control-group">
          <label>Category:</label>
          <div class="button-group">
            @for (cat of categories; track cat) {
              <button
                [class.active]="selectedCategory() === cat"
                (click)="setCategory(cat)"
              >
                {{ cat }}
              </button>
            }
          </div>
        </div>
      </div>

      <div class="tiles-grid">
        @if (spriteLoader.isReady()) {
          @for (tile of filteredTiles(); track $index) {
            <div class="tile-card" [title]="tile">
              <app-sprite
                sheet="tiles"
                [frame]="tile"
                [scale]="scale()"
              />
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .tiles-demo {
      padding: 20px;
      background: #1a1a2e;
      border-radius: 8px;
      color: #eee;
    }

    h2 {
      margin: 0 0 20px;
      color: #6bcb77;
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
      padding: 6px 12px;
      border: 2px solid #333;
      background: #222;
      color: #eee;
      cursor: pointer;
      font-family: inherit;
      font-size: 11px;
      transition: all 0.2s;
      text-transform: capitalize;
    }

    button:hover {
      border-color: #6bcb77;
    }

    button.active {
      background: #6bcb77;
      color: #000;
      border-color: #6bcb77;
    }

    input[type="range"] {
      width: 150px;
    }

    .tiles-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      max-height: 400px;
      overflow-y: auto;
      background: #0f0f23;
      padding: 8px;
      border-radius: 4px;
    }

    .tile-card {
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 4px;
      transition: border-color 0.1s;
    }

    .tile-card:hover {
      border-color: #6bcb77;
    }
  `,
})
export class TilesDemoComponent {
  spriteLoader = inject(SpriteLoaderService);

  scale = signal(1);
  selectedCategory = signal('all');

  categories = ['all', 'grass', 'dirt', 'sand', 'snow', 'stone', 'purple', 'blocks', 'items', 'props'];

  filteredTiles = signal<string[]>([]);

  constructor() {
    this.updateFilteredTiles();
  }

  private updateFilteredTiles(): void {
    const allTiles = this.spriteLoader.getFrameNames('tiles');
    const category = this.selectedCategory();

    if (category === 'all') {
      this.filteredTiles.set(allTiles);
      return;
    }

    const categoryMap: Record<string, string[]> = {
      grass: ['terrain_grass'],
      dirt: ['terrain_dirt'],
      sand: ['terrain_sand'],
      snow: ['terrain_snow'],
      stone: ['terrain_stone'],
      purple: ['terrain_purple'],
      blocks: ['block_', 'brick'],
      items: ['coin', 'gem', 'key', 'heart', 'star', 'bomb'],
      props: ['door', 'ladder', 'lever', 'lock', 'sign', 'flag', 'torch', 'fence', 'bridge', 'chain', 'rope', 'spring', 'switch'],
    };

    const prefixes = categoryMap[category] || [];
    this.filteredTiles.set(
      allTiles.filter((tile) =>
        prefixes.some((prefix) => tile.toLowerCase().startsWith(prefix))
      )
    );
  }

  onScaleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.scale.set(parseInt(target.value, 10));
  }

  setCategory(category: string): void {
    this.selectedCategory.set(category);
    this.updateFilteredTiles();
  }
}
