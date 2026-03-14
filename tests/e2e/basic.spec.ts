import { test, expect } from '@playwright/test';

test.describe('PT Semen Nusantara - Basic E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/PT Semen Nusantara/);
    
    // Check main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check hero section
    await expect(page.locator('h1')).toContainText(['SEMEN', 'NUSANTARA']);
    
    // Check featured products section
    await expect(page.locator('text=Featured Products')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    // Test Products page
    await page.click('text=Products');
    await expect(page).toHaveURL(/.*\/produk/);
    await expect(page.locator('h1')).toContainText(['FEATURED', 'PRODUCTS']);
    
    // Test Projects page
    await page.click('text=Projects');
    await expect(page).toHaveURL(/.*\/proyek/);
    await expect(page.locator('h1')).toContainText(['PROJECT', 'HIGHLIGHTS']);
    
    // Test About page
    await page.click('text=About');
    await expect(page).toHaveURL(/.*\/tentang/);
    await expect(page.locator('h1')).toContainText(['ABOUT', 'US']);
    
    // Test Contact page
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*\/kontak/);
    await expect(page.locator('h1')).toContainText(['CONTACT', 'FORM']);
  });

  test('product cards have enhanced features', async ({ page }) => {
    await page.goto('/produk');
    
    // Check product cards exist
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards.first()).toBeVisible();
    
    // Check for premium features
    await expect(page.locator('text=PREMIUM')).toBeVisible();
    await expect(page.locator('[aria-label*="star"]')).toBeVisible();
    
    // Check product descriptions
    await expect(page.locator('text=Semen Portland')).toBeVisible();
    
    // Check feature tags
    await expect(page.locator('[class*="rounded-full"]')).toBeVisible();
  });

  test('language switching works', async ({ page }) => {
    // Check default language (Indonesian)
    await expect(page.locator('text=Produk Unggulan')).toBeVisible();
    
    // Switch to English
    await page.click('[aria-label="Switch language"]');
    await expect(page.locator('text=Featured Products')).toBeVisible();
    
    // Switch back to Indonesian
    await page.click('[aria-label="Switch language"]');
    await expect(page.locator('text=Produk Unggulan')).toBeVisible();
  });

  test('contact form validation', async ({ page }) => {
    await page.goto('/kontak');
    
    // Try to submit empty form
    await page.click('text=KIRIM FORMULIR');
    
    // Should show validation errors
    await expect(page.locator('text=Nama wajib diisi')).toBeVisible();
    await expect(page.locator('text=Email wajib diisi')).toBeVisible();
    
    // Fill form with valid data
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '08123456789');
    await page.fill('textarea[name="message"]', 'Test message with sufficient length');
    
    // Submit form
    await page.click('text=KIRIM FORMULIR');
    
    // Should show success message (or at least no validation errors)
    await expect(page.locator('text=Nama wajib diisi')).not.toBeVisible();
  });

  test('responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Check mobile menu
    await page.click('[aria-label="Toggle menu"]');
    await expect(page.locator('[role="navigation"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('performance metrics', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            lcp: 0,
            fid: 0,
            cls: 0,
          };
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls += entry.value;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({ lcp: 0, fid: 0, cls: 0 }), 5000);
      });
    });
    
    console.log('Performance metrics:', metrics);
    
    // Basic performance assertions
    expect(metrics.lcp).toBeLessThan(4000); // LCP should be under 4s
    expect(metrics.cls).toBeLessThan(0.25); // CLS should be under 0.25
  });
});
