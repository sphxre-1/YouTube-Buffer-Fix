# Auto-Updating YouTube Fake Buffering Fix

This is a dynamic fetcher script for userscript managers (like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)). It bypasses YouTube's "experiencing interruptions" anti-adblock mechanism by silently pulling the latest raw JavaScript fixes straight from the official AdGuard Filters GitHub repository.

Because YouTube updates its detection frequently, this script caches the fix locally for zero-latency loading and checks for updates in the background every 24 hours.

## Installation

You must have a userscript manager extension installed in your browser.

👉 **[Click here to install the script directly](https://github.com/sphxre-1/YouTube-Buffer-Fix/raw/main/youtube-fix.user.js)**

*Note: The first time you load YouTube, your userscript manager may prompt you to allow the script to connect to `raw.githubusercontent.com`. Click "Always Allow".*

## How it works
1. Instantly runs the locally cached AdGuard scriptlet.
2. Checks if 24 hours have passed since the last background fetch.
3. If yes, it fetches the massive `specific.txt` filter file from AdGuard's repository.
4. It uses a Regular Expression to find and extract the exact JavaScript block responsible for the fake buffering fix.
5. Saves the new fix to your local cache for the next time you load a video.
