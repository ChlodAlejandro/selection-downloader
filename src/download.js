function getSelectedElements(window, tagName) {
    var sel = window.getSelection(), selectedElements = [];
    var range, elementRange, elements;
    if (sel.getRangeAt && sel.rangeCount) {
        elementRange = window.document.createRange();
        for (var r = 0; r < sel.rangeCount; ++r) {
            range = sel.getRangeAt(r);
            containerEl = range.commonAncestorContainer;
            if (containerEl.nodeType != 1) {
                containerEl = containerEl.parentNode;
            }
            if (containerEl.nodeName.toLowerCase() == tagName) {
                selectedElements.push(containerEl);
            } else {
                elements = containerEl.getElementsByTagName(tagName);
                for (var i = 0; i < elements.length; ++i) {
                    elementRange.selectNodeContents(elements[i]);
                    if (elementRange.compareBoundaryPoints(range.END_TO_START, range) < 1
                            && elementRange.compareBoundaryPoints(range.START_TO_END, range) > -1) {
                        selectedElements.push(elements[i]);
                    }
                }
            }
        }
        elementRange.detach();
    }
    return selectedElements;
}

async function downloadSelection(window, elements) {
    var elements = getSelectedElements(window, "a");
    var hrefs = new Set();
    var promises = [];
    for (var element of elements) {
        var href = element.getAttribute("href");
        if (
            new URL(href, window.location.href).toString().replace(/#.*/g, "")
            !== window.location.href.replace(/#.*/g, "")
        ) {
            promises.push(fetch(new URL(href, window.location.href).toString(), { 
                method: "HEAD"
            }).then((res) => {
                hrefs.add(res.url);
            }));
        }
    }

    await Promise.all(promises);

    return hrefs;
}

downloadSelection(window);