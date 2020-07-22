from rest_framework import permissions
from api import models


class IsAuthandReadOnlyOrIsAdminIntegratorSameOrg(permissions.BasePermission):
    """
    special permissions for scripts
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS and
              (request.user.is_integrator or request.user.is_superuser)):
            if (view.action == "update") and request.data == {}:
                return True
            if view.action == "update":
                object =  models.TrainingScript.objects.get(id=view.kwargs["pk"])
                if object.organization == request.user.organization:
                    return True
                return False
            return True
        else:
            return False


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

class IsAuthorStaff(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator or Admin allow all methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS
              and request.user.is_staff or request.user.is_authenticated):
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
