import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Announcement from './Announcement';
import getProvider from './providers/getProvider';
import Provider from './providers/Provider';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { log } from './utils/logger';

(function() {
    log('Content script has loaded and is running.');

    // Initialize OUFR icons.
    initializeIcons();

    setTimeout(() => {
        const header = document.getElementById('FIFAHeader');
        const updateAnchor = document.createElement('div');
        updateAnchor.id = 'updateAnchor';
        header.appendChild(updateAnchor);

        ReactDOM.render(
            <Announcement />,
            document.getElementById('updateAnchor')
        );
    }, 5000);

    // Update badge with current status.
    chrome.storage.sync.get('isActive', data => {
        // Make extension active on first run.
        if (data.isActive === undefined) {
            chrome.storage.sync.set({ isActive: true }, () => {
                chrome.runtime.sendMessage({ isActive: true });
            });
            return;
        }

        chrome.runtime.sendMessage({ isActive: data.isActive });
    });

    // Get provider that performs hotkey actions for correct version of web app.
    const provider = getProvider();

    // Sets up listeners for non-configurable shortcuts.
    window.addEventListener('keydown', ev => {
        const keyCode = ev.keyCode;

        chrome.storage.sync.get('isActive', data => {
            // Update badge with current status.
            const isActive = data.isActive;
            chrome.runtime.sendMessage({ isActive: isActive });

            /**
             * Because people got so used to the original shortcuts, I got
             * lots of people complaining to me about bringing them back...
             * so I did. Check here if native shortcuts are enabled and
             * act accordingly.
             */
            chrome.storage.sync.get('isNativeShortcuts', isNativeShortcuts => {
                if (isNativeShortcuts.isNativeShortcuts === false) {
                    if (ev.altKey && keyCode === 32 /* Alt + Space */) {
                        chrome.storage.sync.set(
                            { isActive: !isActive },
                            function() {
                                chrome.runtime.sendMessage({
                                    isActive: !isActive
                                });
                            }
                        );
                        return;
                    }

                    // If extension "isn't active", don't process hotkeys.
                    if (!isActive) {
                        return;
                    }

                    switch (keyCode) {
                        case 67 /* c */:
                            provider.comparePrice();
                            break;
                        case 77 /* m */:
                            provider.listMinBin();
                            break;
                        case 83 /* s */:
                            if (ev.altKey) {
                                provider.storeAllInClub();
                            } else {
                                provider.storeInClub();
                            }
                            break;
                        case 84 /* t */:
                            provider.sendToTransferList();
                            break;
                        case 81 /* q */:
                            if (ev.altKey) {
                                provider.quickSellAll();
                            } else {
                                provider.quickSell();
                            }
                            break;
                        case 40 /* down arrow */:
                            provider.move('down');
                            break;
                        case 38 /* up arrow */:
                            provider.move('up');
                            break;
                        case 8 /* backspace */:
                            provider.back();
                            break;
                        case 66 /* b */:
                            provider.buyBronzePack();
                            break;
                        case 78 /* n */:
                        case 220 /* \ */:
                            provider.buyNow();
                            break;
                        case 87 /* w */:
                            provider.watch();
                            break;
                        case 76 /* l */:
                            provider.list();
                            break;
                        case 70 /* f */:
                            provider.futbin();
                            break;
                        case 37 /* left arrow */:
                            provider.pagePrevious();
                            break;
                        case 39 /* right arrow */:
                            provider.pageNext();
                            break;
                        case 68 /* d */:
                            provider.makeBid();
                            break;
                        default:
                            break;
                    }
                } else {
                    // If extension "isn't active", don't handle any commands.
                    if (!isActive) {
                        log(
                            'Extension is currently not active, so ignoring hotkey.'
                        );
                        return;
                    }

                    switch (keyCode) {
                        case 8 /* backspace */:
                            provider.back();
                            break;
                        case 38 /* up arrow */:
                            provider.move('up');
                            break;
                        case 40 /* down arrow */:
                            provider.move('down');
                            break;
                        case 37 /* left arrow */:
                            provider.pagePrevious();
                            break;
                        case 39 /* right arrow */:
                            provider.pageNext();
                            break;
                    }
                }
            });
        });
    });

    // Sets up listeners for configurable shortcuts.
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        chrome.storage.sync.get('isActive', data => {
            const isActive = data.isActive;
            chrome.runtime.sendMessage({ isActive: isActive });

            // Ignore all commands if native shortcuts aren't enabled.
            chrome.storage.sync.get('isNativeShortcuts', isNativeShortcuts => {
                if (
                    isNativeShortcuts.isNativeShortcuts ||
                    isNativeShortcuts.isNativeShortcuts === undefined
                ) {
                    /**
                     * This shortcut is checked prior to checking if extension "is active"
                     * because this one always gets handled.
                     */
                    if (request.toggleExtension) {
                        logHotkeyReceived('toggleExtension');

                        chrome.storage.sync.set({ isActive: !isActive }, () => {
                            log(
                                `Extension is now ${
                                    !isActive ? 'active' : 'inactive'
                                }.`
                            );
                            chrome.runtime.sendMessage({ isActive: !isActive });
                        });

                        // Hotkey handled, so return.
                        return;
                    }

                    // If extension "isn't active", don't handle any commands.
                    if (!isActive) {
                        log(
                            'Extension is currently not active, so ignoring hotkey.'
                        );
                        return;
                    }

                    if (request.futbin) {
                        logHotkeyReceived('futbin');
                        provider.futbin();
                    } else if (request.storeInClub) {
                        logHotkeyReceived('storeInClub');
                        provider.storeInClub();
                    } else if (request.buyNow) {
                        logHotkeyReceived('buyNow');
                        provider.buyNow();
                    } else if (request.comparePrice) {
                        logHotkeyReceived('comparePrice');
                        provider.comparePrice();
                    } else if (request.quickSell) {
                        logHotkeyReceived('quickSell');
                        provider.quickSell();
                    } else if (request.sendToTransferList) {
                        logHotkeyReceived('sendToTransferList');
                        provider.sendToTransferList();
                    } else if (request.listMinBin) {
                        logHotkeyReceived('listMinBin');
                        provider.listMinBin();
                    } else if (request.list) {
                        logHotkeyReceived('list');
                        provider.list();
                    } else if (request.buyBronzePack) {
                        logHotkeyReceived('buyBronzePack');
                        provider.buyBronzePack();
                    } else if (request.quickSellAll) {
                        logHotkeyReceived('quickSellAll');
                        provider.quickSellAll();
                    } else if (request.storeAllInClub) {
                        logHotkeyReceived('storeAllInClub');
                        provider.storeAllInClub();
                    } else if (request.watch) {
                        logHotkeyReceived('watch');
                        provider.watch();
                    } else if (request.makeBid) {
                        logHotkeyReceived('makeBid');
                        provider.makeBid();
                    }
                }
            });
        });
    });

    function logHotkeyReceived(hotkeyName: string) {
        log(`${hotkeyName} shortfut received in content script.`);
    }
})();