browser.contextMenus.create({
    id: "sdContextMenuMain",
    title: browser.i18n.getMessage("sdContextMenuMain"),
    contexts: ["selection"]
}, () => {
    browser.contextMenus.onClicked.addListener(function(info, tab) {
        switch (info.menuItemId) {
            case "sdContextMenuMain":
                browser.tabs.executeScript({
                    file: "/src/download.js"
                }).then((windows) => {
                    for (var window of windows) {
                        if (!!window) {
                            for (var href of window) {
                                browser.downloads.download({
                                    cookieStoreId: tab.cookieStoreId,
                                    url: href
                                });
                            }
                        }
                    }
                });
                break;
        }
    });
});