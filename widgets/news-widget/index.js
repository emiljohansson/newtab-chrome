(function() {
    'use strict';

    var feedUrl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=https%3A%2F%2Fnews.google.com%2Fnews%2Ffeeds%3Fned%3Dus%26output%3Drss%26topic%3D";

    var element = Object.create(HTMLDivElement.prototype);

    element.createdCallback = function() {
        this.titleEl = document.createElement('h2');
        this.entriesListEl = document.createElement('div');
        this.appendChild(this.titleEl);
        this.appendChild(this.entriesListEl);

        var url = feedUrl + (this.getAttribute('topic') || '');
        this.ajax(url, function(data) {
            var feed = data.feed;
            this.titleEl.innerHTML = feed.title;
            this.filldEntriesList(feed.entries);
        }.bind(this));
    };

    element.filldEntriesList = function(entries) {
        var listFragment = document.createDocumentFragment();
        entries.forEach(this.createEntry.bind(listFragment));
        this.entriesListEl.appendChild(listFragment);
    };

    element.createEntry = function(entry) {
        var entryEl = document.createElement('div');
        var entryContent = entry.content.replace('src="//', 'src="http://');
        entryEl.innerHTML = entryContent;
        this.appendChild(entryEl);
    };

    element.ajax = function(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(data) {
            if (xmlhttp.readyState===4 && xmlhttp.status===200) {
                callback(JSON.parse(data.target.response).responseData);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    document.registerElement('news-widget', {
        prototype: element,
        extends: 'div'
    });
}());
