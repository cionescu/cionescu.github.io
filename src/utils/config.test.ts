import { describe, expect, it } from 'vitest';
import { APP_BLOG, I18N, METADATA, SITE } from './config';

describe('config', () => {
  it('loads site + i18n config from YAML', () => {
    expect(SITE.name).toBeTruthy();
    expect(SITE.site).toMatch(/^https?:\/\//);
    expect(typeof SITE.trailingSlash).toBe('boolean');

    expect(I18N.language).toBeTruthy();
    expect(I18N.textDirection).toMatch(/^(ltr|rtl)$/);
    expect(I18N.dateFormatter).toBeInstanceOf(Intl.DateTimeFormat);
  });

  it('exposes metadata defaults and overrides', () => {
    expect(METADATA.title?.default).toBeTruthy();
    expect(METADATA.title?.template).toBeTruthy();
    expect(METADATA.robots).toBeTruthy();
  });

  it('exposes blog config', () => {
    expect(typeof APP_BLOG.isEnabled).toBe('boolean');
    expect(APP_BLOG.postsPerPage).toBeGreaterThan(0);
    expect(APP_BLOG.post.permalink).toContain('%');
  });
});

