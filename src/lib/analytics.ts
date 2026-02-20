/**
 * Analytics Helper
 * 
 * Simple analytics tracking for user events.
 * Can be connected to Google Analytics, Plausible, or custom solution.
 */

declare global {
    interface Window {
        plausible?: (...args: any[]) => void;
    }
}

export type AnalyticsEvent =
    | { type: 'page_view'; url: string }
    | { type: 'tile_click'; tileId: string; tileTitle: string }
    | { type: 'tile_navigation'; from: string; to: string }
    | { type: 'fullscreen_open'; tileId: string }
    | { type: 'fullscreen_close'; tileId: string; duration: number }
    | { type: 'form_submit'; formName: string }
    | { type: 'form_error'; formName: string; error: string }
    | { type: 'swipe_navigation'; direction: 'left' | 'right' }
    | { type: 'dark_mode_toggle'; enabled: boolean };

class Analytics {
    private startTimes: Map<string, number> = new Map();

    /**
     * Track a custom event
     */
    track(event: AnalyticsEvent) {
        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Analytics]', event);
        }

        // Plausible Analytics (if available) - EU Hosted, Privacy First
        if (window.plausible) {
            window.plausible(event.type, {
                props: event,
            });
        }

        // Could also send to custom backend:
        // this.sendToServer(event);
    }


    /**
     * Track page view
     */
    pageView(url: string) {
        this.track({ type: 'page_view', url });
    }

    /**
     * Track tile interactions
     */
    tileClick(tileId: string, tileTitle: string) {
        this.track({ type: 'tile_click', tileId, tileTitle });
    }

    /**
     * Start tracking duration
     */
    startTimer(key: string) {
        this.startTimes.set(key, Date.now());
    }

    /**
     * End tracking duration and get elapsed time
     */
    endTimer(key: string): number {
        const startTime = this.startTimes.get(key);
        if (!startTime) return 0;

        const duration = Date.now() - startTime;
        this.startTimes.delete(key);
        return duration;
    }

    /**
     * Track fullscreen view with duration
     */
    fullscreenOpen(tileId: string) {
        this.startTimer(`fullscreen-${tileId}`);
        this.track({ type: 'fullscreen_open', tileId });
    }

    fullscreenClose(tileId: string) {
        const duration = this.endTimer(`fullscreen-${tileId}`);
        this.track({ type: 'fullscreen_close', tileId, duration });
    }

    /**
     * Track form submissions
     */
    formSubmit(formName: string) {
        this.track({ type: 'form_submit', formName });
    }

    formError(formName: string, error: string) {
        this.track({ type: 'form_error', formName, error });
    }

    /**
     * Track dark mode toggle
     */
    darkModeToggle(enabled: boolean) {
        this.track({ type: 'dark_mode_toggle', enabled });
    }

    /**
     * Send event to custom server (example)
     */
    /*
    private async sendToServer(event: AnalyticsEvent) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
        } catch (error) {
            // Silently fail - don't break app for analytics
            console.error('Analytics error:', error);
        }
    }
    */

}

// Export singleton instance
export const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
    return analytics;
};
