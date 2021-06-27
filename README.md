# LanguageLab Library DRF

This app allows instructors to create exercises involving audio mimicry.  The
primary use case that I envison is for language lab type activities, but this
could also be used to practice dialect or gender speech, song or even
instrumental music.

There are two parts to the application: the backend *Library*, written in Python
to work with Django, and the frontend *Client*, written in Javascript to work
with React.

## License

Copyright 2021 Angus B. Grieve-Smith

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

## Hosting media

LanguageLab is not a media server.  It presents exercises to the user based on
URLs pointing to media files hosted elsewhere.  For copyright purposes, these
media files can be protected with a .htaccess password.  It is relatively easy
to add media server functionality if desired.

## Serving the client in production

In production, the Javascript client should be served using a separate virtual
directory, or even a separate server.

## Permissions

By default, LanguageLab uses a custom "StaffCanWrite" permission, where users
with `staff` access can write everything, and other users can only read items.
If you would like to give all users write access, change the
DEFAULT_PERMISSION_CLASSES entry in settings.py to
`rest_framework.permissions.IsAuthenticated`.

## Requirements

The full list of Library requirements is in [requirements.txt](requirements.txt),
but the main requirements are Django, the Django Rest Framework and
Django-taggit.  The Client requirements are in
[languagelab/static/package.json](/languagelab/static/package.json)
and include React, React-DOM, Moment.js, Bootstrap (requires jQuery) and the
Open Iconic icon library.

## [Installation](install.md)
## [Roadmap](roadmap.md)
