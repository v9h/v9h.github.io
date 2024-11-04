// ==UserScript==
// @name         Item Notifier
// @include      http://www.strrev.com/
// @namespace    http://www.strrev.com/
// @version      1.2.6
// @description  Notifies user when new items are available with sound
// @author       goth
// @match        *://www.strrev.com/*
// @icon         https://www.strrev.com/img/logo_R.svg
// @grant        none
// @updateURL    https://v9h.github.io/stratusitemnotifier.js
// @downloadURL  https://v9h.github.io/stratusitemnotifier.js
// ==/UserScript==

(function() {
    'use strict';

    const categoryApiUrl = 'https://www.strrev.com/apisite/catalog/v1/search/items?category=Featured&limit=28&sortType=0';
    const notificationSoundUrl = 'https://v9h.github.io/notify.mp3';

    function getLastSeenItemId() {
        return localStorage.getItem('lastSeenItemId');
    }

    function setLastSeenItemId(itemId) {
        localStorage.setItem('lastSeenItemId', itemId);
    }

    function getCsrfToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : null;
    }

    async function fetchItems() {
        try {
            const csrfToken = getCsrfToken();
            const headers = {
                'Content-Type': 'application/json'
            };
            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }

            const response = await fetch(categoryApiUrl, {
                method: 'GET',
                headers: headers
            });
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            if (data.data && data.data.length > 0) {
                checkForNewItems(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }
    }

    function checkForNewItems(items) {
        const mostRecentItem = items[0];
        const lastSeenItemId = getLastSeenItemId();
        if (!lastSeenItemId || mostRecentItem.id > lastSeenItemId) {
            setLastSeenItemId(mostRecentItem.id);
            notifyUser(mostRecentItem.id);
        }
    }

    async function fetchItemName(itemId) {
        try {
            const response = await fetch(`https://www.strrev.com/catalog/${itemId}/Notify`);
            if (!response.ok) throw new Error('Network response was not ok');

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const itemName = doc.querySelector('.title-0-2-181').textContent;
            return itemName;
        } catch (error) {
            console.error('Failed to fetch item name:', error);
            return 'Unknown Item';
        }
    }

    function playNotificationSound() {
        const audio = new Audio(notificationSoundUrl);
        audio.play();
    }

    async function notifyUser(itemId) {
        const itemName = await fetchItemName(itemId);
        const notification = new Notification("New Item Available!", {
            body: `Press this notification to be redirected to ${itemName}.`
        });

        notification.onclick = () => {
            window.open(`https://www.strrev.com/catalog/${itemId}/Notify`);
        };

        playNotificationSound();
    }

    function requestNotificationPermission() {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    function init() {
        requestNotificationPermission();
        setInterval(fetchItems, 5000); // 5 seconds
    }

    init();
})();
