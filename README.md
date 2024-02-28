# Memefy This

![app-logo](/docs/logo.png)

The ultimate meme machine in form of a chrome extension for making instant memes online.

**Current version:** 0.1.7

[Download](https://chrome.google.com/webstore/detail/memefy-this/iohemjpgjkgkfgfpiglpfpcclogkelcf) and [View Demo](https://ashbardhan.github.io/memefy-this/)

If you find this application much useful, show your support by all means

- Share this app on all social platforms as much as possible.
- Follow [@MemefyThis](https://twitter.com/MemefyThis) on Twitter for more updates and share your memes created from my app.
- Send feedbacks/suggestions with :heart: or :skull: by tweeting to [@CreativeBakchod](https://twitter.com/CreativeBakchod) a.k.a **The Savior Meme-Maker**.

## Contributing

### Setup

- [Fork this repo](https://help.github.com/articles/fork-a-repo) and clone it on your system.
- Make sure that you're using node version **v18.7.0** for this application. Use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) for switching to this node versions.
- Install all the required dependencies by running `yarn install`.
- Create a new branch out off `master` for your fix/feature by running `git checkout -b new-feature`.
- Build this project by running the following commands
  - `grunt dev` - This creates `dist` folder containing unminified files for the chrome extension and a watcher task.
  - `grunt build` - This creates `dist` folder containing minified files for the chrome extension and its compressed `.zip` file (only for admin purpose).
- Install in your chrome by loading the generated `dist` folder as an [unpacked extension](http://techapple.net/2015/09/how-to-install-load-unpacked-extension-in-google-chrome-browser-os-chromebooks/).

### Things to remember

- Do not fix multiple issues in a single commit. Keep them one thing per commit so that they can be picked easily in case only few commits require to be merged.
- Before submitting a patch, rebase your branch on upstream `master` to make life easier for the merger.
- Make sure to disable the original downloaded `Memefy This` extension while testing the local unpacked version.

### License

MIT Licensed

Featured on [Product Hunt](https://www.producthunt.com/posts/memefy-this) and [Hacker News](https://news.ycombinator.com/item?id=15618018)

Copyright (c) 2024 Ashish Bardhan, [ashbardhan.github.io](https://ashbardhan.github.io)
