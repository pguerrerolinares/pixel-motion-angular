import { Injectable, DestroyRef, inject } from '@angular/core';
import { AnimationConfig } from '../models/animation.model';

/**
 * Represents a running animation instance.
 */
export interface AnimationInstance {
  id: string;
  sheetId: string;
  config: AnimationConfig;
  currentFrame: number;
  isPlaying: boolean;
  elapsedTime: number;
  onFrameChange?: (frameName: string) => void;
}

let instanceIdCounter = 0;

/**
 * Service that manages sprite animations using a single global requestAnimationFrame loop.
 *
 * Features:
 * - Single animation loop for all sprite animations (performance optimization)
 * - Frame-based animation timing using FPS configuration
 * - Support for looping and non-looping animations
 * - Callback system for frame changes
 * - Automatic cleanup on service destroy
 */
@Injectable({ providedIn: 'root' })
export class AnimationControllerService {
  private instances = new Map<string, AnimationInstance>();
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.startLoop();
    this.destroyRef.onDestroy(() => this.stopLoop());
  }

  /**
   * Creates a new animation instance.
   * @param sheetId - The sprite sheet identifier
   * @param config - Animation configuration (frames, fps, loop)
   * @param onFrameChange - Optional callback invoked when the current frame changes
   * @returns Animation instance ID for controlling the animation
   */
  createAnimation(
    sheetId: string,
    config: AnimationConfig,
    onFrameChange?: (frameName: string) => void
  ): string {
    const id = `anim_${++instanceIdCounter}`;

    const instance: AnimationInstance = {
      id,
      sheetId,
      config,
      currentFrame: 0,
      isPlaying: false,
      elapsedTime: 0,
      onFrameChange,
    };

    this.instances.set(id, instance);

    // Notify initial frame
    if (onFrameChange && config.frames.length > 0) {
      onFrameChange(config.frames[0]);
    }

    return id;
  }

  /**
   * Starts playing an animation.
   * @param id - The animation instance ID
   */
  play(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.isPlaying = true;
    }
  }

  /**
   * Pauses an animation without resetting its current frame.
   * @param id - The animation instance ID
   */
  pause(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.isPlaying = false;
    }
  }

  /**
   * Stops an animation and resets it to the first frame.
   * @param id - The animation instance ID
   */
  stop(id: string): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.isPlaying = false;
      instance.currentFrame = 0;
      instance.elapsedTime = 0;
      if (instance.onFrameChange && instance.config.frames.length > 0) {
        instance.onFrameChange(instance.config.frames[0]);
      }
    }
  }

  setAnimation(id: string, config: AnimationConfig): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.config = config;
      instance.currentFrame = 0;
      instance.elapsedTime = 0;
      if (instance.onFrameChange && config.frames.length > 0) {
        instance.onFrameChange(config.frames[0]);
      }
    }
  }

  /**
   * Destroys an animation instance and removes it from the controller.
   * Should be called when the animation is no longer needed to free resources.
   * @param id - The animation instance ID
   */
  destroy(id: string): void {
    this.instances.delete(id);
  }

  getCurrentFrame(id: string): string | null {
    const instance = this.instances.get(id);
    if (!instance) return null;
    return instance.config.frames[instance.currentFrame] || null;
  }

  private startLoop(): void {
    const loop = (time: number) => {
      const deltaTime = time - this.lastTime;
      this.lastTime = time;

      this.updateAnimations(deltaTime);
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  private stopLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updateAnimations(deltaTime: number): void {
    this.instances.forEach((instance) => {
      if (!instance.isPlaying) return;

      const { config } = instance;
      const frameDuration = 1000 / config.fps;

      instance.elapsedTime += deltaTime;

      if (instance.elapsedTime >= frameDuration) {
        instance.elapsedTime -= frameDuration;
        const prevFrame = instance.currentFrame;
        instance.currentFrame++;

        if (instance.currentFrame >= config.frames.length) {
          if (config.loop) {
            instance.currentFrame = 0;
          } else {
            instance.currentFrame = config.frames.length - 1;
            instance.isPlaying = false;
          }
        }

        // Only notify if frame actually changed
        if (instance.currentFrame !== prevFrame && instance.onFrameChange) {
          instance.onFrameChange(config.frames[instance.currentFrame]);
        }
      }
    });
  }
}
