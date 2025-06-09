import { useMemo } from 'react';
import { User } from '../core/domain/entities/User';

interface PermissionsConfig {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canViewPrivate: boolean;
  canManageContracts: boolean;
}

export const usePermissions = (
  currentUser: User | null,
  resourceOwnerId?: string,
  resourceType?: 'profile' | 'service' | 'portfolio' | 'contract'
): PermissionsConfig => {
  return useMemo(() => {
    if (!currentUser) {
      return {
        canEdit: false,
        canDelete: false,
        canCreate: false,
        canViewPrivate: false,
        canManageContracts: false,
      };
    }

    const isOwner = currentUser.id === resourceOwnerId;

    switch (resourceType) {
      case 'profile':
        return {
          canEdit: isOwner,
          canDelete: isOwner,
          canCreate: isOwner,
          canViewPrivate: isOwner,
          canManageContracts: isOwner,
        };

      case 'service':
        return {
          canEdit: isOwner,
          canDelete: isOwner,
          canCreate: currentUser.role === 'Provider' && isOwner,
          canViewPrivate: isOwner,
          canManageContracts: isOwner || currentUser.role === 'Client',
        };

      case 'portfolio':
        return {
          canEdit: isOwner,
          canDelete: isOwner,
          canCreate: isOwner,
          canViewPrivate: isOwner,
          canManageContracts: false,
        };

      case 'contract':
        // Para contratos, tanto cliente como proveedor pueden tener ciertos permisos
        const isClientOrProvider = currentUser.role === 'Client' || currentUser.role === 'Provider';
        return {
          canEdit: isOwner && isClientOrProvider,
          canDelete: isOwner && currentUser.role === 'Client',
          canCreate: isClientOrProvider,
          canViewPrivate: isOwner,
          canManageContracts: isOwner,
        };

      default:
        return {
          canEdit: isOwner,
          canDelete: isOwner,
          canCreate: isOwner,
          canViewPrivate: isOwner,
          canManageContracts: isOwner,
        };
    }
  }, [currentUser, resourceOwnerId, resourceType]);
};