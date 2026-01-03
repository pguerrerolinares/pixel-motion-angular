# Pixel Portfolio - Angular Sprite System

A modern sprite animation system built with Angular 21, showcasing pixel-perfect rendering, smooth animations, and a complete game scene composition system.

## Features

- **Angular 21 Zoneless Architecture** - Leverages the latest Angular features with zoneless change detection
- **Signal-Based State Management** - Reactive state using Angular signals
- **OnPush Change Detection** - Optimized performance with OnPush strategy
- **Pixel-Perfect Rendering** - CSS-based sprite rendering with `image-rendering: pixelated`
- **Global Animation Loop** - Single `requestAnimationFrame` loop for all animations
- **XML/TXT Metadata Parsing** - Support for both XML and TXT spritesheet formats
- **Dynamic Background System** - Tiled backgrounds with multiple themes
- **Spritesheet Management** - Efficient loading and caching system
- **HUD Components** - Complete heads-up display elements

## Demo Sections

### 1. Scene Preview
Full game scene composition featuring:
- Tiled backgrounds (5 themes: hills, desert, mushrooms, trees, clouds)
- Character with idle pose
- Animated enemies (slime, bee)
- Interactive HUD overlay
- Platform tiles and decorations
- Collectible items (coins, gems)

### 2. Characters
- 5 character colors (beige, green, pink, purple, yellow)
- 7 animations per character: idle, walk, jump, duck, hit, climb, front
- Scale control (1x-4x)
- Horizontal flip option

### 3. Enemies
- 18 enemy types with unique animations
- Enemies include: barnacle, bee, block, fish (3 variants), fly, frog, ladybug, mouse, saw, slime (4 variants), snail, worm (2 variants)
- Scale control (1x-6x)
- Horizontal flip option

### 4. Tiles & Items
- 316+ tiles and items
- Categories: grass, dirt, sand, snow, stone, purple terrain, blocks, items, props
- Terrain tiles with proper edge/corner pieces
- Interactive items (coins, gems, keys, hearts)
- Props (doors, ladders, signs, flags, etc.)

### 5. HUD Elements
- Health hearts (full, half, empty)
- Character icons and helmets
- Keys (4 colors)
- Gems (4 colors)
- Coins (bronze, silver, gold)
- Numbers and special characters

## Technical Architecture

### Core Services

#### SpriteLoaderService
```typescript
// Loads and caches spritesheets with metadata parsing
preloadAll(): Promise<void>
getFrame(sheetId: string, frameName: string): SpriteFrame | undefined
getSheet(id: string): SpriteSheet | undefined
```

#### AnimationControllerService
```typescript
// Global animation loop managing all sprite animations
createAnimation(sheetId: string, config: AnimationConfig, onFrameChange?: Callback): string
play(animationId: string): void
pause(animationId: string): void
stop(animationId: string): void
destroy(animationId: string): void
```

### Components

#### SpriteComponent
Static sprite rendering with CSS background positioning.
```typescript
@Input() sheet: string;       // Spritesheet ID
@Input() frame: string;       // Frame name
@Input() scale: number = 1;   // Scaling factor
```

#### AnimatedSpriteComponent
Animated sprite with automatic frame cycling.
```typescript
@Input() sheet: string;
@Input() animation: AnimationConfig;
@Input() scale: number = 1;
@Input() flipX: boolean = false;
@Input() autoPlay: boolean = true;
@Output() animationEnd: EventEmitter<void>;
```

### Models

#### AnimationConfig
```typescript
interface AnimationConfig {
  name: string;
  frames: string[];  // Array of frame names
  fps: number;       // Frames per second
  loop: boolean;     // Loop animation
}
```

#### SpriteFrame
```typescript
interface SpriteFrame {
  name: string;
  x: number;        // X position in spritesheet
  y: number;        // Y position in spritesheet
  width: number;    // Frame width
  height: number;   // Frame height
}
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   ├── animation.model.ts       # Animation configurations
│   │   │   └── sprite.model.ts          # Sprite frame definitions
│   │   ├── services/
│   │   │   ├── animation-controller.service.ts  # Global animation loop
│   │   │   └── sprite-loader.service.ts         # Spritesheet loading
│   │   └── utils/
│   │       └── spritesheet-parser.ts    # XML/TXT metadata parser
│   │
│   ├── features/
│   │   ├── sprite/
│   │   │   ├── sprite.component.ts              # Static sprite
│   │   │   └── animated-sprite.component.ts     # Animated sprite
│   │   └── demo/
│   │       ├── demo-page.component.ts           # Main demo container
│   │       ├── scene-demo.component.ts          # Game scene preview
│   │       ├── player-demo.component.ts         # Character showcase
│   │       ├── enemies-demo.component.ts        # Enemy showcase
│   │       ├── tiles-demo.component.ts          # Tiles & items gallery
│   │       └── hud-demo.component.ts            # HUD elements
│   │
│   └── app.component.ts
│
└── assets/
    └── sprites/
        ├── spritesheet-characters-default.png/xml
        ├── spritesheet-enemies-default.png/xml
        ├── spritesheet-tiles-default.png/xml
        └── spritesheet-backgrounds-default.png/xml
```

## Installation

```bash
# Clone the repository
git clone https://github.com/pguerrerolinares/pixel-portfolio.git
cd pixel-portfolio

# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build
```

## Technology Stack

- **Angular 21** - Latest Angular with zoneless change detection
- **TypeScript 5.7** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS3** - Pixel-perfect rendering with modern CSS

## Performance Optimizations

1. **Single Animation Loop** - One `requestAnimationFrame` for all animations
2. **OnPush Change Detection** - Minimizes change detection cycles
3. **Signal-Based Reactivity** - Efficient reactive updates
4. **Preloaded Assets** - All spritesheets loaded on startup
5. **CSS Background Positioning** - No DOM manipulation for frame changes
6. **Max Dimension Calculation** - Prevents container resizing during animation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Assets Credits

Sprite assets from **Platformer Pack** by [Kenney.nl](https://kenney.nl)
- License: CC0 1.0 Universal (Public Domain)

## Development

### Adding New Spritesheets

1. Add PNG and XML/TXT files to `src/assets/sprites/`
2. Register in `sprite-loader.service.ts`:

```typescript
export const SPRITE_SHEETS: SpriteSheetConfig[] = [
  {
    id: 'your-sheet',
    imagePath: 'assets/sprites/your-sheet.png',
    metadataPath: 'assets/sprites/your-sheet.xml',
    metadataType: 'xml',
  },
];
```

### Creating Animations

Define animations in `animation.model.ts`:

```typescript
export const YOUR_ANIMATIONS: Record<string, AnimationConfig> = {
  walk: {
    name: 'walk',
    frames: ['walk_1', 'walk_2', 'walk_3'],
    fps: 12,
    loop: true,
  },
};
```

## License

MIT License - Feel free to use this project as a reference or starting point for your own work.

## Author

Built with Angular 21 and modern web technologies.
