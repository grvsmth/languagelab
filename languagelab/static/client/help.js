const exports = {
    "about": {
        "title": "About",
        "description": `LanguageLab is a server and web client for learning
        languages, including singing and transgender speech practice.  It
        allows you to replicate the repetition exercises used in language
        labs around the world.  It has been developed by Angus "Andrea"
        Grieve-Smith since 2015.`,
        "a": {
            "href": "https://grieve-smith.com/blog/2021/02/a-free-open-source-language-lab-app/",
            "target": "_blank",
            "html": "More info"
        }
    },
    "source": {
        "title": "Source",
        "description": `LanguageLab is free and open source.  See the README for
        information on how to set up your own server and web client.`,
        "a": {
            "href": "https://bitbucket.org/grvsmth/languagelab-library-drf",
            "target": "_blank",
            "html": "Get the source"
        }
    },
    "media": {
        "title": "Media",
        "description": `A media item is based on a URL for an externally hosted
        media file, along with metadata (language, type, description, tags).
        Once you've added a media item, you can create exercises based on it.`
    },
    "exercises": {
        "title": "Exercises",
        "description": `An exercise is based on a segment of a media item.  Once
        you've added a media item, you can come here and create exercises based
        on that media item and add them to a lesson.`
    },
    "lessons": {
        "title": "Lessons",
        "description": `A lesson contains a queue of exercises and some
        descriptive metadata.  Once you've created a lesson, you can go to the
        Exercises tab and add your exercises to that lesson.`
    },
    "languages": {
        "title": "Languages",
        "description": `This is just a simple mapping of languages with ISO-639
        codes.  Once you have added a language, you can specify it in the media
        metadata.`
    }
};

export default exports;
