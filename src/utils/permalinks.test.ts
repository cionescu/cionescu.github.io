import { describe, expect, it } from 'vitest';
import { SITE } from './config';
import { BLOG_BASE, cleanSlug, getAsset, getCanonical, getHomePermalink, getPermalink, trimSlash } from './permalinks';

describe('permalinks', () => {
  it('trimSlash removes leading and trailing slashes', () => {
    expect(trimSlash('/about/')).toBe('about');
    expect(trimSlash('about')).toBe('about');
    expect(trimSlash('///about///')).toBe('about');
  });

  it('cleanSlug slugifies segments but keeps slashes', () => {
    expect(cleanSlug('Hello World')).toBe('hello-world');
    expect(cleanSlug('Hello World/Nested Path')).toBe('hello-world/nested-path');
  });

  it('getPermalink produces stable paths with current site base', () => {
    expect(getHomePermalink()).toBe('/');
    expect(getPermalink('about')).toBe('/about');
    expect(getPermalink('blog', 'page')).toBe('/blog');
    expect(getPermalink('post-slug', 'post')).toBe('/post-slug');
    expect(getPermalink('my-tag', 'tag')).toBe('/tag/my-tag');
  });

  it('getCanonical follows trailingSlash setting', () => {
    const canonical = String(getCanonical('/about/'));
    if (SITE.trailingSlash) {
      expect(canonical.endsWith('/about/')).toBe(true);
    } else {
      expect(canonical.endsWith('/about')).toBe(true);
    }
  });

  it('getAsset prefixes base path once', () => {
    expect(getAsset('images/logo.png')).toBe('/images/logo.png');
    expect(getAsset('/images/logo.png')).toBe('/images/logo.png');
  });

  it('derives BLOG_BASE from config', () => {
    expect(BLOG_BASE).toBe('blog');
  });
});

