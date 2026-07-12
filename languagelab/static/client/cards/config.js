const config = {
    "dateTimeFormat": "MMM D, YYYY h:mm a",
    "timeFormat": "HH:mm:ss.S",
    "tagSplitRE": /\s*[,;]+\s*/,
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
    "doButton": {
        "previous": {
            "icon": "oi-caret-left",
            "color": "info"
        },
        "next": {
            "icon": "oi-caret-right",
            "color": "info"
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
        }
    },
    "message": {
        "lessonQueue": "If you add lessons, you can add this exercise to a lesson"
    },
    "hideIsAvailablePublic": true,
    "exerciseNameLimit": 10,
    "playStatuses": [
        "playModelFirst",
        "playModelSecond",
        "playModelOnly",
        "playMimic"
    ],
    "statusColor": {
        "error": "danger",
        "warning": "warning",
        "playMimic": "success",
        "playModelOnly": "info",
        "playModelFirst": "success",
        "playModelSecond": "success",
        "ready": "info",
        "recording": "danger"
    }
};

config.playableStatuses = config.playStatuses + ["ready"];
config.activeStatuses = config.playStatuses + ["recording"];

export default config;