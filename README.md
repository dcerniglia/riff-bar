# RiffBar Chrome Extension

RiffBar is a Chrome extension that adds a floating, draggable control bar to YouTube pages for enhanced guitar practice and video control.

## Features

- 🎯 **Draggable Control Bar**: Move the control bar anywhere on the page
- ⏯️ **Play/Pause**: Quick video playback control
- ⏪⏩ **Skip Controls**: Jump forward/backward 10 seconds
- 🏃 **Speed Control**: Cycle through playback speeds (0.25x to 2x)
- ⛶ **Fullscreen Toggle**: Enter/exit fullscreen mode
- 🎭 **Theater Mode**: Toggle YouTube's theater mode
- 💾 **Position Memory**: Remembers control bar position between sessions
- 📱 **Responsive Design**: Works on different screen sizes

## Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project folder
5. The extension should now appear in your extensions list

### Icons Setup

The extension requires icon files in the `icons/` directory. You can:

1. Add your own PNG icon files (16x16, 32x32, 48x48, 128x128 pixels)
2. Or use any PNG images and rename them to:
   - `icon16.png`
   - `icon32.png` 
   - `icon48.png`
   - `icon128.png`

## Usage

1. Navigate to any YouTube video page
2. The floating control bar will automatically appear in the top-right corner
3. **Drag** the control bar by clicking and holding the header
4. **Minimize** the control bar by clicking the "-" button
5. Use the **popup** (click the extension icon) to:
   - Toggle the extension on/off
   - Reset the control bar position
   - Refresh the current page

## Controls

| Button | Function |
|--------|----------|
| ⏯️ | Play/Pause video |
| ⏪ | Skip backward 10 seconds |
| ⏩ | Skip forward 10 seconds |
| 1x | Cycle playback speed |
| ⛶ | Toggle fullscreen |
| 🎭 | Toggle theater mode |

## Technical Details

- **Manifest Version**: 3
- **Permissions**: `activeTab`, `storage`
- **Host Permissions**: `youtube.com` and `www.youtube.com`
- **Content Script**: Injects on YouTube pages
- **Background Script**: Service worker for extension management

## File Structure

```
riffbar/
├── manifest.json          # Extension manifest
├── content.js             # Main content script
├── styles.css             # Control bar styles
├── background.js          # Background service worker
├── popup.html             # Extension popup interface
├── popup.css              # Popup styles
├── popup.js               # Popup functionality
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload any YouTube pages to see changes

## Browser Compatibility

- Chrome (Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

## License

This project is open source and available under the MIT License. 