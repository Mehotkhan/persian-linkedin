'use strict';

// WebExtensions compatibilty
// See here: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Chrome_incompatibilities
if (!chrome) {
  const chrome = browser;
}

const manifestData = chrome.runtime.getManifest();
const urlPatterns = manifestData.content_scripts[0].matches;
const version = manifestData.version;

document.querySelector('#version').innerHTML = version;

const selectFontElement = document.querySelector('#persian-linkedin-font');
const currentFont = localStorage.getItem('persian-linkedin-font') || 'default';
selectFontElement.value = currentFont;


const links = document.querySelectorAll('a');
for (const link of links) {
  link.addEventListener('click', e => {
    e.preventDefault();

    chrome.tabs.create({
      url: link.href
    });
  });
}

selectFontElement.addEventListener('change', handleChanges);

function handleChanges() {
  const font = selectFontElement.value;
  localStorage.setItem('persian-linkedin-font', font);

  chrome.tabs.query({url: urlPatterns}, function (tabs) {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, {
        changeFont: {
          font
        }
      });
    }
  });
}