from rest_framework.permissions import BasePermission, SAFE_METHODS

class StaffCanWrite(BasePermission):
    """
    Allow write access only to users with is_staff set
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True;

        return request.user and request.user.is_staff