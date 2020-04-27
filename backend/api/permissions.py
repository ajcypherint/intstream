from rest_framework import permissions


class IsAuthandSuperUser(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        else:
            return False


class IsAuthandReadOnlyOrAdminOrIntegrator(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS and
              (request.user.is_integrator or request.user.is_superuser)):
            return True
        else:
            return False


class IsAuthandReadOnlyStaff(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS
              and request.user.is_staff):
            return True
        else:
            return False


class IsAuthandReadOnly(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        else:
            return False


class IsAuthandReadOnlyIntegrator(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS
              and request.user.is_integrator):
            return True
        else:
            return False
