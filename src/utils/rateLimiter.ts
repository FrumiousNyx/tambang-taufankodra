// Simple rate limiter for form submissions
class RateLimiter {
  private submissions: Map<string, number[]> = new Map();
  private readonly maxSubmissions = 3; // Max 3 submissions
  private readonly windowMs = 60 * 1000; // Per 1 minute

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const submissions = this.submissions.get(identifier) || [];
    
    // Filter out old submissions outside the window
    const recentSubmissions = submissions.filter(time => now - time < this.windowMs);
    
    if (recentSubmissions.length >= this.maxSubmissions) {
      return false;
    }
    
    // Add current submission
    recentSubmissions.push(now);
    this.submissions.set(identifier, recentSubmissions);
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const now = Date.now();
    const submissions = this.submissions.get(identifier) || [];
    const recentSubmissions = submissions.filter(time => now - time < this.windowMs);
    
    if (recentSubmissions.length < this.maxSubmissions) {
      return 0;
    }
    
    const oldestSubmission = Math.min(...recentSubmissions);
    return Math.ceil((oldestSubmission + this.windowMs - now) / 1000);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, submissions] of this.submissions.entries()) {
      const recentSubmissions = submissions.filter(time => now - time < this.windowMs);
      if (recentSubmissions.length === 0) {
        this.submissions.delete(key);
      } else {
        this.submissions.set(key, recentSubmissions);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
