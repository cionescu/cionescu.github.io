---
publishDate: 2020-10-12T00:00:00Z
title: Implicit Declaration of Function is Invalid in C99
excerpt: I ran into this error when installing the thin Ruby Gem on MacOS and found the solution.
tags:
  - rspec
  - ruby-on-rails
  - capybara
category: Today I Learned
emoji: 🛠️
---

## Implicit Declaration of Function is Invalid in C99

If you get the following error when attempting to install the thin gem on MacOS (`gem install thin`):

```bash
Fetching thin-1.7.2.gem
Building native extensions. This could take a while...
ERROR:  Error installing thin:
	ERROR: Failed to build gem native extension.

[Omitted for brevity]

thin.c:374:10: error: implicit declaration of function 'thin_http_parser_is_finished' is invalid in C99 [-Werror,-Wimplicit-function-declaration]
  return thin_http_parser_is_finished(http) ? Qtrue : Qfalse;
         ^
9 errors generated.
make: *** [thin.o] Error 1
```

## The solution:

Install the gem with the following C flags:

```bash
gem install thin -- --with-cflags="-Wno-error=implicit-function-declaration"
```

## Same solution works if you are trying to install `mailcatcher`

```bash
  gem install mailcatcher -- --with-cflags="-Wno-error=implicit-function-declaration"
```

## If you are installing the gem using bundler, then you can change bundler's config to use the C flags

```bash
  bundle config build.thin --with-cflags="-Wno-error=implicit-function-declaration"
```

### Credits for the solution:

[Mike Szyndel on Github](https://github.com/macournoyer/thin/issues/365#issuecomment-692063842)
