# Neon Tetris Pro

A modern, mobile-responsive implementation of the classic Tetris game with a cyberpunk neon aesthetic. Built with vanilla JavaScript, HTML5 Canvas, and CSS3.

## About

Neon Tetris Pro is a fully-featured Tetris game that brings the timeless puzzle experience to both desktop and mobile devices. The game features smooth animations, particle effects, ghost piece preview, and an immersive neon-themed visual design.

Created by **Sagar Dey**  
© 2024 All Rights Reserved

## Features

### Core Gameplay
- Classic Tetris mechanics with all seven tetromino pieces (T, O, L, J, I, S, Z)
- Progressive difficulty system with increasing speed as levels advance
- Ghost piece showing where the current piece will land
- Next piece preview display
- Persistent high score tracking using browser localStorage
- Real-time score and level display

### Visual & Audio
- Cyberpunk neon aesthetic with glowing effects
- Particle effects when clearing lines
- Screen flash effect on hard drops
- Background music during gameplay
- Sound effects for movements, rotations, line clears, and game over

### Controls

**Desktop (Keyboard):**
- Arrow Left/Right: Move piece horizontally
- Arrow Up: Rotate piece clockwise
- Arrow Down: Soft drop (move piece down faster)
- Spacebar: Hard drop (instantly drop piece to bottom)
- P Key: Pause/Resume game

**Mobile (Touch):**
- On-screen button controls for all movements
- Touch-optimized interface with larger tap targets
- Responsive layout that adapts to different screen sizes

### Responsive Design
- Fully playable on mobile devices (phones and tablets)
- Adaptive layout that reorganizes for smaller screens
- Touch controls automatically appear on mobile devices
- Optimized canvas scaling for different screen sizes
- Maintains playability across all device types

## Technical Details

### Game Mechanics
- 12×20 game grid (standard Tetris dimensions)
- Collision detection with wall kick system for smooth rotation
- Line clearing with combo scoring
- Drop speed increases with each level
- Seven-bag randomization for piece generation

### Built With
- HTML5 Canvas for game rendering
- Vanilla JavaScript (ES6+) for game logic
- CSS3 for styling and animations
- Web Audio API for sound management

### Browser Support
Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS3 animations and transforms
- localStorage API

## Project Structure

```
neon-tetris-pro/
├── index.html          # Main HTML structure
├── script.js           # Game logic and mechanics
├── style.css           # Styling and responsive design
├── sounds/             # Audio assets
│   ├── bg-music.mp3    # Background music
│   ├── drop.wav        # Piece drop sound
│   ├── line-clear.wav  # Line clear sound
│   ├── rotate.wav      # Rotation sound
│   └── game-over.wav   # Game over sound
└── README.md           # Project documentation
```

## How to Play

1. Open `index.html` in a web browser
2. Click "START GAME" to begin
3. Use keyboard controls (desktop) or on-screen buttons (mobile) to play
4. Clear horizontal lines by filling them completely with blocks
5. Game ends when pieces stack to the top of the grid
6. Try to beat your high score

## Scoring System

- Each completed line awards 10 points
- Multiple lines cleared simultaneously award multiplied points
- Level increases every 30 points
- Drop speed increases with each level

## Game States

- **Start Screen**: Initial welcome screen with game controls
- **Playing**: Active gameplay with all controls enabled
- **Paused**: Game temporarily stopped (press P to resume)
- **Game Over**: Final score display with option to play again

## Performance

The game uses `requestAnimationFrame` for smooth 60 FPS rendering and efficient canvas drawing techniques. Particle effects are optimized to maintain performance even during intensive line clearing sequences.

## Future Enhancements

Potential features for future versions:
- Hold piece mechanic
- Combo and T-spin detection
- Multiple difficulty modes
- Online leaderboards
- Custom themes and color schemes
- Customizable controls

## License

© 2024 Sagar Dey. All Rights Reserved.

This project is a personal portfolio piece. Please contact the creator for usage permissions.

## Contact

For questions, suggestions, or collaboration opportunities, please reach out to the creator.

---

Enjoy playing Neon Tetris Pro!
