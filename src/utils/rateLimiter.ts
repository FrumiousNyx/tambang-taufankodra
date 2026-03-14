// @ts-nocheck
export class RateLimiter {
  private submissions: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userSubmissions = this.submissions.get(identifier) || [];
    
    // Filter submissions within the window
    const recentSubmissions = userSubmissions.filter(time => now - time < this.windowMs);
    
    // Update the submissions list
    this.submissions.set(identifier, recentSubmissions);
    
    // Check if under the limit
    if (recentSubmissions.length < this.maxRequests) {
      recentSubmissions.push(now);
      return true;
    }
    
    return false;
  }

  getRemainingTime(identifier: string): number {
    const userSubmissions = this.submissions.get(identifier) || [];
    if (userSubmissions.length === 0) {
      return 0;
    }
    
    const oldestSubmission = Math.min(...userSubmissions);
    const now = Date.now();
    return Math.ceil((oldestSubmission + this.windowMs - now) / 1000);
  }

  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.submissions.entries());
    
    for (let i = 0; i < entries.length; i++) {
      const [key, submissions] = entries[i];
      const recentSubmissions = submissions.filter(time => now - time < this.windowMs);
      if (recentSubmissions.length === 0) {
        this.submissions.delete(key);
      } else {
        this.submissions.set(key, recentSubmissions);
      }
    }
  }

  reset(): void {
    this.submissions.clear();
  }
}

export const rateLimiter = new RateLimiter(15 * 60 * 1000, 10); // 15 minutes, 10 requests
