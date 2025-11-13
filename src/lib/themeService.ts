/**
 * Theme Service
 * Powerful light/dark theme management with smooth transitions
 */

export type Theme = 'light' | 'dark' | 'system';

class ThemeService {
  private currentTheme: Theme = 'system';
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('novacare_theme') as Theme;
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      this.currentTheme = 'system';
    }

    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  /**
   * Get current theme
   */
  public getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get effective theme (resolves 'system' to 'light' or 'dark')
   */
  public getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }

  /**
   * Set theme
   */
  public setTheme(theme: Theme): void {
    this.currentTheme = theme;
    localStorage.setItem('novacare_theme', theme);
    this.applyTheme(theme);
    this.notifyListeners(theme);
  }

  /**
   * Toggle between light and dark
   */
  public toggleTheme(): void {
    const effectiveTheme = this.getEffectiveTheme();
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(effectiveTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        effectiveTheme === 'dark' ? '#0A1628' : '#F7EFE6'
      );
    }
  }

  /**
   * Setup system theme change listener
   */
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system');
        this.notifyListeners('system');
      }
    });
  }

  /**
   * Subscribe to theme changes
   */
  public subscribe(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(callback => callback(theme));
  }

  /**
   * Get theme colors for current theme
   */
  public getThemeColors(): {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
  } {
    const effectiveTheme = this.getEffectiveTheme();
    
    if (effectiveTheme === 'dark') {
      return {
        background: '#0A1628',
        foreground: '#F8F6F0',
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#D4AF37',
        muted: '#1A2B45',
        border: '#2A3B55'
      };
    } else {
      return {
        background: '#FFFFFF',
        foreground: '#0A1628',
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#D4AF37',
        muted: '#F8F6F0',
        border: '#E5E4E2'
      };
    }
  }

  /**
   * Check if dark mode is active
   */
  public isDarkMode(): boolean {
    return this.getEffectiveTheme() === 'dark';
  }

  /**
   * Preload theme assets
   */
  public preloadThemeAssets(): void {
    // Preload any theme-specific assets here
    console.log('Theme assets preloaded');
  }
}

// Export singleton instance
export const themeService = new ThemeService();

export default themeService;
