## Permissions

LanguageLab has two available permission models.  By default it uses a custom
"StaffCanWrite" permission, where users with `staff` access can write
everything, and other users can only read items.

If you would like to give all users write access, change the
DEFAULT_PERMISSION_CLASSES entry in settings.py to
`rest_framework.permissions.IsAuthenticated`.

Following the [roadmap](roadmap.md), version 1.0 will have a full permissions
model, authorizing access to exercises and lessons based on the group(s) that
the user belongs to, and whether the user is the creator of these items.