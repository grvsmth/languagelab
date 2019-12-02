const config = {
    "dateTimeFormat": "MMM D, YYYY h:mm a",
    "timeFormat": "HH:mm:ss.S",
    "tagSplitRE": /[,;]+/,
    "api": {
        "baseUrl": "https://languagelab-dev.grieve-smith.com/api/0.2",
        "endpoint": {
            "Media": "media",
            "Exercises": "exercises",
            "Lessons": "lessons",
            "Queue": "queueItems",
            "Languages": "languages"
        }
    },
    "formatName": {
        "au": "audio",
        "vi": "video"
    },
    "audio": {
        "options": {
            "audioBitsPerSecond": 128000,
            "sampleRate": 48000
        }
    },
    "queueButton": {
        "up": {
            "icon": "oi-caret-top",
            "color": "success"
        },
        "down": {
            "icon": "oi-caret-bottom",
            "color": "success"
        },
        "remove": {
            "icon": "oi-circle-x",
            "color": "danger"
        },
        "previous": {
            "icon": "oi-caret-left",
            "color": "success"
        },
        "next": {
            "icon": "oi-caret-right",
            "color": "success"
        }
    }
};

export default config;