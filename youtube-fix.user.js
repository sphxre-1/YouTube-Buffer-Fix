// ==UserScript==
// @name         Auto-Updating AdGuard YouTube Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Silently fetches the latest fake buffering fix from AdGuard's GitHub daily and injects it
// @match        *://*.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';
    
    const CACHE_KEY = 'adguard_yt_fix_code';
    const TIME_KEY = 'adguard_yt_fix_time';
    const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    function injectScript(code) {
        // Inject the code safely into the page's execution environment
        const script = document.createElement('script');
        script.textContent = code;
        document.documentElement.appendChild(script);
        script.remove();
    }

    const cachedCode = GM_getValue(CACHE_KEY);
    const lastFetch = GM_getValue(TIME_KEY, 0);

    // 1. Immediately inject the cached code so there is no delay when YouTube loads
    if (cachedCode) {
        injectScript(cachedCode);
    }

    // 2. In the background, check if 24 hours have passed to fetch an update
    if (Date.now() - lastFetch > UPDATE_INTERVAL || !cachedCode) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/BaseFilter/sections/specific.txt',
            onload: function(response) {
                if (response.status === 200) {
                    // Search the raw text file for the specific comment and extract the raw JavaScript underneath it
                    const match = response.responseText.match(/!\s*Fix fake buffering on the initial load\s*\r?\n.*?#%#(\(\(\)=>\{.*\}\)\(\);)/);
                    
                    if (match && match[1]) {
                        const latestCode = match[1];
                        
                        // Save the newest code and reset the 24-hour timer
                        GM_setValue(CACHE_KEY, latestCode);
                        GM_setValue(TIME_KEY, Date.now());
                        
                        // If it's the very first time running, we inject it immediately
                        if (!cachedCode) {
                            injectScript(latestCode);
                        }
                    }
                }
            }
        });
    }
})();
