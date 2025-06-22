// RiffBar Content Script
// Prevent multiple instances
if (window.RiffBarInstance) {
  console.log('RiffBar already loaded, skipping initialization');
} else {

class YouTubeControlBar {
  constructor() {
    this.controlBar = null;
    this.isDragging = false;
    this.isResizing = false;
    this.dragOffset = { x: 0, y: 0 };
    this.resizeOffset = { x: 0, y: 0 };
    this.minWidth = 240;
    this.minHeight = 120;
    this.init();
  }

  init() {
    // Wait for the page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createControlBar());
    } else {
      this.createControlBar();
    }

    // Listen for navigation changes (YouTube is a SPA)
    this.observePageChanges();
  }

  createControlBar() {
    // Remove existing control bar if it exists
    if (this.controlBar) {
      this.controlBar.remove();
    }

    // Create the floating control bar
    this.controlBar = document.createElement('div');
    this.controlBar.id = 'youtube-control-bar';
    this.controlBar.className = 'youtube-control-bar';

    // Add control buttons
    this.controlBar.innerHTML = `
      <div class="control-bar-header">
        <span class="control-bar-title">RIFFBAR</span>
        <button class="control-bar-minimize" title="Minimize">−</button>
      </div>
      <div class="control-bar-content">
        <button class="control-btn play-btn" id="play-pause-btn" title="Play/Pause">
          <div class="control-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
          <div class="control-btn-label">PLAY</div>
        </button>
        <button class="control-btn" id="skip-back-btn" title="Skip Back 10s">
          <div class="control-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 11.25 8.689v8.122Z" />
            </svg>
          </div>
          <div class="control-btn-label">-10S</div>
        </button>
        <button class="control-btn" id="skip-forward-btn" title="Skip Forward 10s">
          <div class="control-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
            </svg>
          </div>
          <div class="control-btn-label">+10S</div>
        </button>
        <button class="control-btn speed-btn" id="speed-btn" title="Playback Speed">
          <div class="control-btn-icon">
            <span class="speed-display">1.0×</span>
          </div>
          <div class="control-btn-label">SPEED</div>
        </button>
        <button class="control-btn" id="fullscreen-btn" title="Toggle Fullscreen">
          <div class="control-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
          <div class="control-btn-label">FULL</div>
        </button>
        <button class="control-btn" id="theater-btn" title="Theater Mode">
          <div class="control-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div class="control-btn-label">THEATER</div>
        </button>
        <button class="control-btn guitar-btn" id="guitar-btn-1" title="Guitar Practice Button 1">
          <div class="guitar-button-number">1</div>
          <div class="guitar-button-layout">
            <div class="guitar-button-arrow">
              <svg class="value-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 11.25 8.689v8.122Z" />
              </svg>
            </div>
            <div class="guitar-button-values">
              <div class="value-row jump-row">
                <span class="value-number">30</span>
                <span class="value-unit">sec</span>
              </div>
              <div class="value-row speed-row">
                <span class="value-number">1.0</span>
                <span class="value-unit">x</span>
              </div>
            </div>
          </div>
        </button>
        <button class="control-btn guitar-btn" id="guitar-btn-2" title="Guitar Practice Button 2">
          <div class="guitar-button-number">2</div>
          <div class="guitar-button-layout">
            <div class="guitar-button-arrow">
              <svg class="value-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 11.25 8.689v8.122Z" />
              </svg>
            </div>
            <div class="guitar-button-values">
              <div class="value-row jump-row">
                <span class="value-number">30</span>
                <span class="value-unit">sec</span>
              </div>
              <div class="value-row speed-row">
                <span class="value-number">0.5</span>
                <span class="value-unit">x</span>
              </div>
            </div>
          </div>
        </button>
      </div>
      <div class="control-bar-resize-handle" title="Drag to resize">⋰</div>
    `;

    // Add event listeners
    this.addEventListeners();

    // Append to body
    document.body.appendChild(this.controlBar);

    // Load saved position
    this.loadPosition();
    
    // Initialize layout with default size if no saved size exists
    setTimeout(() => {
      const rect = this.controlBar.getBoundingClientRect();
      this.updateLayout(rect.width, rect.height);
    }, 100);
    
    // Update guitar button titles and labels with current settings
    this.updateGuitarButtonTitles();
  }

  addEventListeners() {
    // Dragging functionality - make entire control bar draggable
    this.controlBar.addEventListener('mousedown', this.startDragging.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDragging.bind(this));
    
    // Resize functionality
    const resizeHandle = this.controlBar.querySelector('.control-bar-resize-handle');
    resizeHandle.addEventListener('mousedown', this.startResizing.bind(this));
    document.addEventListener('mousemove', this.resize.bind(this));
    document.addEventListener('mouseup', this.stopResizing.bind(this));

    // Minimize functionality
    const minimizeBtn = this.controlBar.querySelector('.control-bar-minimize');
    minimizeBtn.addEventListener('click', this.toggleMinimize.bind(this));

    // Control button functionality
    this.controlBar.querySelector('#play-pause-btn').addEventListener('click', this.togglePlayPause.bind(this));
    this.controlBar.querySelector('#skip-back-btn').addEventListener('click', () => this.skipTime(-10));
    this.controlBar.querySelector('#skip-forward-btn').addEventListener('click', () => this.skipTime(10));
    this.controlBar.querySelector('#speed-btn').addEventListener('click', this.toggleSpeed.bind(this));
    this.controlBar.querySelector('#fullscreen-btn').addEventListener('click', this.toggleFullscreen.bind(this));
    this.controlBar.querySelector('#theater-btn').addEventListener('click', this.toggleTheaterMode.bind(this));
    this.controlBar.querySelector('#guitar-btn-1').addEventListener('click', () => this.guitarPracticeJump(1));
    this.controlBar.querySelector('#guitar-btn-2').addEventListener('click', () => this.guitarPracticeJump(2));
  }

  startDragging(e) {
    // Don't start dragging if clicking on a button, interactive element, or resize handle
    if (e.target.closest('.control-btn') || 
        e.target.closest('.control-bar-minimize') || 
        e.target.closest('.control-bar-resize-handle')) {
      return;
    }
    
    this.isDragging = true;
    const rect = this.controlBar.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
    this.controlBar.style.cursor = 'grabbing';
    e.preventDefault();
  }

  drag(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - this.controlBar.offsetWidth;
    const maxY = window.innerHeight - this.controlBar.offsetHeight;

    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));

    this.controlBar.style.left = boundedX + 'px';
    this.controlBar.style.top = boundedY + 'px';
  }

  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false;
      this.controlBar.style.cursor = 'grab';
      this.savePosition();
    }
  }

  startResizing(e) {
    this.isResizing = true;
    const rect = this.controlBar.getBoundingClientRect();
    this.resizeOffset.x = e.clientX - rect.right;
    this.resizeOffset.y = e.clientY - rect.bottom;
    document.body.style.cursor = 'nw-resize';
    e.preventDefault();
    e.stopPropagation();
  }

  resize(e) {
    if (!this.isResizing) return;

    const rect = this.controlBar.getBoundingClientRect();
    const newWidth = Math.max(this.minWidth, e.clientX - rect.left - this.resizeOffset.x);
    const newHeight = Math.max(this.minHeight, e.clientY - rect.top - this.resizeOffset.y);

    // Keep within viewport bounds
    const maxWidth = window.innerWidth - rect.left;
    const maxHeight = window.innerHeight - rect.top;

    const boundedWidth = Math.min(newWidth, maxWidth);
    const boundedHeight = Math.min(newHeight, maxHeight);

    this.controlBar.style.width = boundedWidth + 'px';
    this.controlBar.style.height = boundedHeight + 'px';

    this.updateLayout(boundedWidth, boundedHeight);
  }

  updateLayout(width, height) {
    const content = this.controlBar.querySelector('.control-bar-content');
    
    // Calculate responsive sizing based on container size
    const baseWidth = 280; // Original design width
    const scaleFactor = width / baseWidth;
    
    // Adjust grid layout based on width and height
    const buttonWidth = 60 * scaleFactor;
    const padding = 32 * scaleFactor;
    const availableWidth = width - padding;
    const availableHeight = height - 60; // Account for header height
    
    // Calculate optimal grid layout
    const totalButtons = 8;
    let columns, rows;
    
    if (availableWidth < 200) {
      columns = 2;
    } else if (availableWidth < 300) {
      columns = 3;
    } else {
      columns = 4;
    }
    
    rows = Math.ceil(totalButtons / columns);
    
    // Set grid template
    content.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    content.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    // Ensure content fills available height
    const contentHeight = availableHeight - (padding * 2);
    content.style.minHeight = Math.max(120, contentHeight) + 'px';
    
    // Set CSS custom properties for responsive sizing
    this.controlBar.style.setProperty('--scale-factor', scaleFactor);
    this.controlBar.style.setProperty('--container-width', width + 'px');
    this.controlBar.style.setProperty('--container-height', height + 'px');
    
    // Update dynamic sizing
    const buttons = this.controlBar.querySelectorAll('.control-btn');
    buttons.forEach(button => {
      // Remove fixed height to let buttons fill available space
      button.style.height = '';
      
      // Scale SVG icons and text
      const icon = button.querySelector('.control-btn-icon');
      const label = button.querySelector('.control-btn-label');
      
      if (icon) {
        const baseIconSize = 16;
        const newIconSize = Math.max(12, Math.min(28, baseIconSize * scaleFactor));
        icon.style.fontSize = newIconSize + 'px';
        
        // Handle guitar button dual icons
        if (button.classList.contains('guitar-btn')) {
          const guitarIcon = button.querySelector('.guitar-icon');
          const backIcon = button.querySelector('.back-icon');
          if (guitarIcon) {
            guitarIcon.style.width = (newIconSize * 0.9) + 'px';
            guitarIcon.style.height = (newIconSize * 0.9) + 'px';
          }
          if (backIcon) {
            backIcon.style.width = (newIconSize * 0.7) + 'px';
            backIcon.style.height = (newIconSize * 0.7) + 'px';
          }
        }
        
        // Handle speed button text
        if (button.id === 'speed-btn') {
          const speedText = button.querySelector('.speed-text');
          if (speedText) {
            speedText.style.fontSize = (newIconSize * 0.6) + 'px';
          }
        }
      }
      
      if (label) {
        const baseLabelSize = 9;
        const newLabelSize = Math.max(7, Math.min(14, baseLabelSize * scaleFactor));
        label.style.fontSize = newLabelSize + 'px';
      }
      
      // Scale padding proportionally but keep it reasonable
      const basePadding = 12;
      const newPadding = Math.max(8, Math.min(20, basePadding * scaleFactor));
      button.style.padding = `${newPadding}px ${newPadding * 0.7}px`;
      
      // Scale border radius
      const baseBorderRadius = 10;
      const newBorderRadius = Math.max(6, Math.min(16, baseBorderRadius * scaleFactor));
      button.style.borderRadius = newBorderRadius + 'px';
    });
    
    // Scale gap and padding
    const baseGap = 8;
    const basePadding = 16;
    const newGap = Math.max(4, Math.min(12, baseGap * scaleFactor));
    const newPadding = Math.max(8, Math.min(24, basePadding * scaleFactor));
    
    content.style.gap = newGap + 'px';
    content.style.padding = newPadding + 'px';
  }

  stopResizing() {
    if (this.isResizing) {
      this.isResizing = false;
      document.body.style.cursor = '';
      this.savePosition();
    }
  }

  toggleMinimize() {
    const content = this.controlBar.querySelector('.control-bar-content');
    const isMinimized = content.style.display === 'none';
    
    content.style.display = isMinimized ? 'flex' : 'none';
    this.controlBar.querySelector('.control-bar-minimize').textContent = isMinimized ? '−' : '+';
  }

  getVideoElement() {
    return document.querySelector('video');
  }

  togglePlayPause() {
    const video = this.getVideoElement();
    const playPauseBtn = this.controlBar.querySelector('#play-pause-btn');
    
    if (video) {
      if (video.paused) {
        video.play();
        const svg = playPauseBtn.querySelector('.control-btn-icon svg');
        const label = playPauseBtn.querySelector('.control-btn-label');
        if (svg) {
          svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />';
        }
        if (label) label.textContent = 'PAUSE';
      } else {
        video.pause();
        const svg = playPauseBtn.querySelector('.control-btn-icon svg');
        const label = playPauseBtn.querySelector('.control-btn-label');
        if (svg) {
          svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />';
        }
        if (label) label.textContent = 'PLAY';
      }
    }
  }

  skipTime(seconds) {
    const video = this.getVideoElement();
    if (video) {
      video.currentTime += seconds;
    }
  }

  toggleSpeed() {
    const video = this.getVideoElement();
    const speedBtn = this.controlBar.querySelector('#speed-btn');
    
    if (video) {
      const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      const currentSpeed = video.playbackRate;
      const currentIndex = speeds.indexOf(currentSpeed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      
      video.playbackRate = speeds[nextIndex];
      const speedDisplay = speedBtn.querySelector('.speed-display');
      if (speedDisplay) {
        speedDisplay.textContent = speeds[nextIndex] + '×';
      }
    }
  }

  toggleFullscreen() {
    const video = this.getVideoElement();
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
    }
  }

  toggleTheaterMode() {
    // Click the theater mode button if it exists
    const theaterBtn = document.querySelector('button.ytp-size-button');
    if (theaterBtn) {
      theaterBtn.click();
    }
  }

  guitarPracticeJump(buttonNumber) {
    chrome.storage.local.get(['guitarSettings'], (result) => {
      const defaultSettings = {
        jumpInterval1: 30,
        button1Speed: 1,
        jumpInterval2: 30,
        button2Speed: 0.5
      };
      
      const settings = result.guitarSettings || defaultSettings;
      const video = this.getVideoElement();
      
      if (video) {
        // Jump back by the specified interval for this button
        const jumpInterval = buttonNumber === 1 ? settings.jumpInterval1 : settings.jumpInterval2;
        video.currentTime = Math.max(0, video.currentTime - jumpInterval);
        
        // Set the speed based on which button was pressed
        const speed = buttonNumber === 1 ? settings.button1Speed : settings.button2Speed;
        video.playbackRate = speed;
        
        // Update the speed button display
        const speedBtn = this.controlBar.querySelector('#speed-btn');
        if (speedBtn) {
          const speedDisplay = speedBtn.querySelector('.speed-display');
          if (speedDisplay) {
            speedDisplay.textContent = speed + '×';
          }
        }
      }
    });
  }

  updateGuitarButtonTitles() {
    chrome.storage.local.get(['guitarSettings'], (result) => {
      const defaultSettings = {
        jumpInterval1: 30,
        button1Speed: 1,
        jumpInterval2: 30,
        button2Speed: 0.5
      };
      
      const settings = result.guitarSettings || defaultSettings;
      
      const btn1 = this.controlBar.querySelector('#guitar-btn-1');
      const btn2 = this.controlBar.querySelector('#guitar-btn-2');
      
      if (btn1) {
        btn1.title = `Guitar Practice: Jump back ${settings.jumpInterval1}s at ${settings.button1Speed}x`;
        const jumpValue1 = btn1.querySelector('.jump-row .value-number');
        const speedValue1 = btn1.querySelector('.speed-row .value-number');
        if (jumpValue1) jumpValue1.textContent = settings.jumpInterval1;
        if (speedValue1) speedValue1.textContent = settings.button1Speed;
      }
      if (btn2) {
        btn2.title = `Guitar Practice: Jump back ${settings.jumpInterval2}s at ${settings.button2Speed}x`;
        const jumpValue2 = btn2.querySelector('.jump-row .value-number');
        const speedValue2 = btn2.querySelector('.speed-row .value-number');
        if (jumpValue2) jumpValue2.textContent = settings.jumpInterval2;
        if (speedValue2) speedValue2.textContent = settings.button2Speed;
      }
    });
  }

  savePosition() {
    const rect = this.controlBar.getBoundingClientRect();
    const position = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
    chrome.storage.local.set({ controlBarPosition: position });
  }

  loadPosition() {
    chrome.storage.local.get(['controlBarPosition'], (result) => {
      if (result.controlBarPosition) {
        const { left, top, width, height } = result.controlBarPosition;
        this.controlBar.style.left = left + 'px';
        this.controlBar.style.top = top + 'px';
        
        if (width && height) {
          this.controlBar.style.width = width + 'px';
          this.controlBar.style.height = height + 'px';
          
          // Update layout with saved dimensions
          this.updateLayout(width, height);
        }
      }
    });
  }

  observePageChanges() {
    // YouTube is a single-page application, so we need to watch for navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        // Recreate control bar on navigation
        setTimeout(() => this.createControlBar(), 1000);
      }
    }).observe(document, { subtree: true, childList: true });
  }
}

// Initialize the control bar when the script loads
const controlBar = new YouTubeControlBar();
window.RiffBarInstance = controlBar;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'updateGuitarSettings':
      controlBar.updateGuitarButtonTitles();
      sendResponse({ success: true });
      break;
    case 'toggleControlBar':
      if (request.enabled) {
        controlBar.createControlBar();
      } else {
        if (controlBar.controlBar) {
          controlBar.controlBar.remove();
        }
      }
      sendResponse({ success: true });
      break;
    case 'resetPosition':
      if (controlBar.controlBar) {
        controlBar.controlBar.style.left = request.position.left + 'px';
        controlBar.controlBar.style.top = request.position.top + 'px';
      }
      sendResponse({ success: true });
      break;
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

} // End of RiffBar initialization check 