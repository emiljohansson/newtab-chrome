(function() {
    'use strict';

    var element = Object.create(HTMLDivElement.prototype);

    element.createdCallback = function() {
        this.titleEl = document.createElement('h2');
        this.timeEl = document.createElement('span');
        this.appendChild(this.titleEl);
        this.appendChild(this.timeEl);

        var settings = this._getSettings();
        this.titleEl.innerHTML = settings.title;
        this.timeEl.innerHTML = settings.hours + ":" + settings.minutes;
    };

    element._getSettings = function() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (this.getAttribute('utc')) {
            hours = date.getUTCHours() + (parseInt(this.getAttribute('utc'), 10));
        }
        if (isDaylightSavingsTime(date)) {
            hours += 1;
        }
        return {
            minutes: minutes < 10 ? "0" + minutes : minutes,
            hours: fixHours(hours),
            title: (this.getAttribute('title') || 'Local')
        };
    };

    function fixHours(hours) {
        if (hours < 10) {
            return "0" + hours;
        }
        if (hours >= 24) {
            return hours - 24;
        }
        return hours;
    }

    function isDaylightSavingsTime(date) {
        var jan = new Date(date.getFullYear(), 0, 1);
        var jul = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        return date.getTimezoneOffset() < stdTimezoneOffset;
    }

    document.registerElement('time-widget', {
        prototype: element,
        extends: 'div'
    });
}());
