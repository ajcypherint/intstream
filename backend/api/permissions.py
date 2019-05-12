from rest_framework import permissions

class IsAuthandReadOnlyOrAdminOrIntegrator(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        else:
            return False
