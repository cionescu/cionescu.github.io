---
publishDate: 2021-09-06T00:00:00Z
title: How to fix 'Too many open files' error in RSpec & Capybara?
excerpt: I will walk you through installing Ruby on Rails for development on macOS 10.15 Catalina.
tags:
  - rspec
  - ruby-on-rails
  - capybara
category: Today I Learned
emoji: 📂
---

## Failed to open TCP connection to [..] (Too many open files)

```bash
Errno::EMFILE:
       Failed to open TCP connection to 127.0.0.1:9515 (Too many open files - socket(2) for "127.0.0.1" port 9515)
```

After running `ulimit -Sn 10240` in bash, the underlying error becomes visible. For me, this was:

```bash
 Failure/Error: expect(page).to have_content 'Some text'
       expected to find text "Some text" in "Some other text"
```

---

### Credits for the solution:
* https://stackoverflow.com/a/61892983
* https://wilsonmar.github.io/maximum-limits/
