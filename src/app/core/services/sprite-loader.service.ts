import { Injectable, signal } from '@angular/core';
import { SpriteSheet, SpriteSheetConfig, SpriteFrame } from '../models/sprite.model';
import { parseMetadata } from '../utils/spritesheet-parser';

/**
 * Configuration for all available spritesheets in the application.
 * Each spritesheet must have a unique ID, image path, metadata path, and metadata type.
 */
export const SPRITE_SHEETS: SpriteSheetConfig[] = [
  {
    id: 'characters',
    imagePath: 'assets/sprites/spritesheet-characters-default.png',
    metadataPath: 'assets/sprites/spritesheet-characters-default.xml',
    metadataType: 'xml',
  },
  {
    id: 'enemies',
    imagePath: 'assets/sprites/spritesheet-enemies-default.png',
    metadataPath: 'assets/sprites/spritesheet-enemies-default.xml',
    metadataType: 'xml',
  },
  {
    id: 'tiles',
    imagePath: 'assets/sprites/spritesheet-tiles-default.png',
    metadataPath: 'assets/sprites/spritesheet-tiles-default.xml',
    metadataType: 'xml',
  },
  {
    id: 'backgrounds',
    imagePath: 'assets/sprites/spritesheet-backgrounds-default.png',
    metadataPath: 'assets/sprites/spritesheet-backgrounds-default.xml',
    metadataType: 'xml',
  },
];

/**
 * Service responsible for loading and managing sprite sheets.
 *
 * Features:
 * - Preloads all sprite sheets on application start
 * - Parses XML and TXT metadata formats
 * - Caches loaded images and sprite frame data
 * - Provides signals for loading state and progress
 */
@Injectable({ providedIn: 'root' })
export class SpriteLoaderService {
  private sheets = new Map<string, SpriteSheet>();
  private loadedImages = new Map<string, HTMLImageElement>();

  readonly isLoading = signal(false);
  readonly loadProgress = signal(0);
  readonly isReady = signal(false);

  /**
   * Preloads all configured sprite sheets.
   * Updates loading progress signal during the process.
   * Sets isReady signal to true when complete.
   */
  async preloadAll(): Promise<void> {
    this.isLoading.set(true);
    this.loadProgress.set(0);

    const total = SPRITE_SHEETS.length;
    let loaded = 0;

    for (const config of SPRITE_SHEETS) {
      await this.loadSpriteSheet(config);
      loaded++;
      this.loadProgress.set(Math.round((loaded / total) * 100));
    }

    this.isLoading.set(false);
    this.isReady.set(true);
  }

  private async loadSpriteSheet(config: SpriteSheetConfig): Promise<void> {
    const [metadataContent, image] = await Promise.all([
      fetch(config.metadataPath).then((r) => r.text()),
      this.loadImage(config.imagePath),
    ]);

    const frames = parseMetadata(metadataContent, config.metadataType);

    const sheet: SpriteSheet = {
      id: config.id,
      imagePath: config.imagePath,
      imageWidth: image.naturalWidth,
      imageHeight: image.naturalHeight,
      frames,
    };

    this.sheets.set(config.id, sheet);
    this.loadedImages.set(config.id, image);
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Retrieves a loaded sprite sheet by ID.
   * @param id - The sprite sheet identifier
   * @returns The sprite sheet data or undefined if not found
   */
  getSheet(id: string): SpriteSheet | undefined {
    return this.sheets.get(id);
  }

  /**
   * Retrieves a specific frame from a sprite sheet.
   * Supports both exact frame names and prefixed names (e.g., 'walk01' or 'p1_walk01').
   * @param sheetId - The sprite sheet identifier
   * @param frameName - The frame name to retrieve
   * @returns The sprite frame data or undefined if not found
   */
  getFrame(sheetId: string, frameName: string): SpriteFrame | undefined {
    const sheet = this.sheets.get(sheetId);
    if (!sheet) return undefined;

    // Try exact match first
    let frame = sheet.frames.get(frameName);
    if (frame) return frame;

    // Try with sheet prefix (e.g., 'walk01' -> 'p1_walk01')
    frame = sheet.frames.get(`${sheetId}_${frameName}`);
    return frame;
  }

  getImage(sheetId: string): HTMLImageElement | undefined {
    return this.loadedImages.get(sheetId);
  }

  getSheetIds(): string[] {
    return Array.from(this.sheets.keys());
  }

  getFrameNames(sheetId: string): string[] {
    const sheet = this.sheets.get(sheetId);
    if (!sheet) return [];
    return Array.from(sheet.frames.keys());
  }
}
