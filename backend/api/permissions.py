from rest_framework import permissions
from api import models
from django.conf import settings


class AllUsers(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class SourcePermissions(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        freemium = request.user.organization.freemium
        if request.method not in permissions.SAFE_METHODS:
            if freemium:
                sources = models.Source.objects.filter(organization=request.user.organization)
                if sources.count() + 1 > settings.MAX_SOURCES:
                    return False
            return True
        else:
            return True


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
                object = models.TrainingScript.objects.get(id=view.kwargs["pk"])
                if object.organization == request.user.organization:
                    return True
                return False
            return True
        else:
            return False


class IsAuthandSuperUser(permissions.BasePermission):
    """
    if Admin allow all methods
    """
    def has_permission(self, request, view):
        if request.user.is_superuser and request.user.is_authenticated:
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
    if authenticated user allow safe methods if is_staff allow  unsafe
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS
              and request.user.is_staff and request.user.is_authenticated):
            return True
        else:
            return False


class IsAuthor(permissions.BasePermission):
    """
    only specific user has access to the view
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        else:
            return False

class IsAuthandReadOnly(permissions.BasePermission):
    """
    if authenticated user allow safe methods
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        else:
            return False


class IsAuthandReadOnlyIntegrator(permissions.BasePermission):
    """
    if authenticated user allow safe methods if integrator
    """
    def has_permission(self, request, view):
        if (request.method in permissions.SAFE_METHODS and
                request.user.is_authenticated):
            return True
        elif (request.method not in permissions.SAFE_METHODS
              and request.user.is_integrator and request.user.is_authenticated):
            return True
        else:
            return False
