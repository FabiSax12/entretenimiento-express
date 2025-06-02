// src/hooks/useMockData.ts

import { useState, useEffect, useCallback } from 'react';
import { mockAppService } from '@/core/infrastructure/repositories/MockProviderRepository';
import { Provider } from '@/core/domain/entities/Provider';
import { Contract } from '@/core/domain/entities/Contract';
import type { SearchFilters } from '@/core/application/ports/IProviderRepository';

// =============================================
// Hook principal para manejo de datos mock
// =============================================

export function useMockData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    executeWithLoading,

    // Provider operations
    getProvider: (id: string) =>
      executeWithLoading(() => mockAppService.getProvider(id)),

    searchProviders: (query: string, filters?: SearchFilters) =>
      executeWithLoading(() => mockAppService.searchProviders(query, filters)),

    getProvidersByCategory: (category: string) =>
      executeWithLoading(() => mockAppService.getProvidersByCategory(category)),

    // Client operations
    getClient: (id: string) =>
      executeWithLoading(() => mockAppService.getClient(id)),

    getClientContracts: (clientId: string) =>
      executeWithLoading(() => mockAppService.getClientContracts(clientId)),

    // Contract operations
    createContractRequest: (
      clientId: string,
      providerId: string,
      serviceId: string,
      eventDate: Date,
      eventLocation: string,
      eventType: string,
      eventTime?: string,
      clientMessage?: string
    ) => executeWithLoading(() =>
      mockAppService.createContractRequest(
        clientId, providerId, serviceId, eventDate,
        eventLocation, eventType, eventTime, clientMessage
      )
    ),

    respondToContractRequest: (
      requestId: string,
      response: 'Accepted' | 'Rejected',
      message?: string
    ) => executeWithLoading(() =>
      mockAppService.respondToContractRequest(requestId, response, message)
    ),

    createContractFromRequest: (requestId: string, agreedPrice: number) =>
      executeWithLoading(() =>
        mockAppService.createContractFromRequest(requestId, agreedPrice)
      ),

    // Review operations
    createReview: (
      clientId: string,
      contractId: string,
      rating: number,
      comment: string,
      providerId?: string,
      serviceId?: string
    ) => executeWithLoading(() =>
      mockAppService.createReview(
        clientId, contractId, rating, comment, providerId, serviceId
      )
    ),

    // Utility
    getStatistics: () => mockAppService.getAppStatistics(),
    resetData: () => mockAppService.resetData(),
  };
}

// =============================================
// Hook específico para proveedores
// =============================================

export function useProvider(providerId: string) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await mockAppService.getProvider(providerId);
        setProvider(result || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading provider');
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      loadProvider();
    }
  }, [providerId]);

  return { provider, loading, error };
}

// =============================================
// Hook para búsqueda de proveedores
// =============================================

export function useProviderSearch() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const results = await mockAppService.searchProviders(query, filters);
      setProviders(results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await mockAppService.getProvidersByCategory(category);
      setProviders(results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error');
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    providers,
    loading,
    error,
    search,
    searchByCategory,
    clearResults: () => setProviders([])
  };
}

// =============================================
// Hook para contratos de cliente
// =============================================

export function useClientContracts(clientId: string) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await mockAppService.getClientContracts(clientId);
        setContracts(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading contracts');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadContracts();
    }
  }, [clientId]);

  const refreshContracts = useCallback(async () => {
    if (clientId) {
      try {
        setError(null);
        const result = await mockAppService.getClientContracts(clientId);
        setContracts(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error refreshing contracts');
      }
    }
  }, [clientId]);

  return { contracts, loading, error, refreshContracts };
}

// =============================================
// EJEMPLOS DE USO EN COMPONENTES REACT
// =============================================

/*

// Ejemplo 1: Componente de búsqueda de proveedores
import React, { useState } from 'react';
import { useProviderSearch } from '@/hooks/useMockData';

export function ProviderSearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { providers, loading, error, search, searchByCategory } = useProviderSearch();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const handleCategorySearch = (category: string) => {
    searchByCategory(category);
  };

  if (loading) return <div>Buscando proveedores...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar proveedores..."
      />
      <button onClick={handleSearch}>Buscar</button>

      <div>
        <button onClick={() => handleCategorySearch('DJ')}>DJ</button>
        <button onClick={() => handleCategorySearch('Música en vivo')}>Música en vivo</button>
        <button onClick={() => handleCategorySearch('Rock')}>Rock</button>
      </div>

      <div>
        {providers.map(provider => (
          <div key={provider.id}>
            <h3>{provider.artisticName}</h3>
            <p>{provider.biography}</p>
            <p>Categorías: {provider.categories.join(', ')}</p>
            <p>Ubicación: {provider.generalLocation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ejemplo 2: Perfil de proveedor
import React from 'react';
import { useProvider } from '@/hooks/useMockData';

export function ProviderProfile({ providerId }: { providerId: string }) {
  const { provider, loading, error } = useProvider(providerId);

  if (loading) return <div>Cargando proveedor...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!provider) return <div>Proveedor no encontrado</div>;

  return (
    <div>
      <h1>{provider.artisticName}</h1>
      <img src={provider.avatarUrl} alt={provider.artisticName} />
      <p>{provider.biography}</p>

      <h2>Información de contacto</h2>
      <p>Email: {provider.publicContact.email}</p>
      <p>Teléfono: {provider.publicContact.phone}</p>

      <h2>Servicios</h2>
      {provider.services.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <p>Precio: ₡{service.basePrice.toLocaleString()} ({service.priceType})</p>
          <p>Duración: {service.estimatedDuration}</p>
        </div>
      ))}

      <h2>Portfolio</h2>
      {provider.portfolio.items.map(item => (
        <div key={item.id}>
          <h4>{item.title}</h4>
          <p>{item.description}</p>
          <p>Tipo: {item.type}</p>
          {item.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
              Ver archivo
            </a>
          )}
        </div>
      ))}

      <h2>Reseñas</h2>
      {provider.reviews.map(review => (
        <div key={review.id}>
          <p>Calificación: {review.rating}/5</p>
          <p>{review.comment}</p>
          <p>Fecha: {review.reviewedAt.toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

// Ejemplo 3: Crear solicitud de contrato
import React, { useState } from 'react';
import { useMockData } from '@/hooks/useMockData';

export function CreateContractRequestForm({
  clientId,
  providerId,
  serviceId
}: {
  clientId: string;
  providerId: string;
  serviceId: string;
}) {
  const { createContractRequest, isLoading, error } = useMockData();
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventType: '',
    clientMessage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createContractRequest(
      clientId,
      providerId,
      serviceId,
      new Date(formData.eventDate),
      formData.eventLocation,
      formData.eventType,
      formData.eventTime,
      formData.clientMessage
    );

    if (result) {
      alert('Solicitud enviada exitosamente');
      // Reset form or redirect
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={formData.eventDate}
        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
        required
      />

      <input
        type="time"
        value={formData.eventTime}
        onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
      />

      <input
        type="text"
        placeholder="Ubicación del evento"
        value={formData.eventLocation}
        onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
        required
      />

      <input
        type="text"
        placeholder="Tipo de evento"
        value={formData.eventType}
        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
        required
      />

      <textarea
        placeholder="Mensaje adicional"
        value={formData.clientMessage}
        onChange={(e) => setFormData({...formData, clientMessage: e.target.value})}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
      </button>

      {error && <div style={{color: 'red'}}>Error: {error}</div>}
    </form>
  );
}

// Ejemplo 4: Panel de administración con estadísticas
import React, { useState, useEffect } from 'react';
import { useMockData } from '@/hooks/useMockData';

export function AdminDashboard() {
  const { getStatistics, resetData } = useMockData();
  const [stats, setStats] = useState(getStatistics());

  useEffect(() => {
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(() => {
      setStats(getStatistics());
    }, 30000);

    return () => clearInterval(interval);
  }, [getStatistics]);

  const handleResetData = () => {
    if (confirm('¿Estás seguro de que quieres resetear todos los datos?')) {
      resetData();
      setStats(getStatistics());
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div>
          <h3>Proveedores</h3>
          <p>Total: {stats.totalProviders}</p>
          <p>Activos: {stats.activeProviders}</p>
        </div>

        <div>
          <h3>Clientes</h3>
          <p>Total: {stats.totalClients}</p>
        </div>

        <div>
          <h3>Servicios</h3>
          <p>Total: {stats.totalServices}</p>
        </div>

        <div>
          <h3>Contratos</h3>
          <p>Total: {stats.totalContracts}</p>
          <p>Completados: {stats.completedContracts}</p>
        </div>

        <div>
          <h3>Solicitudes</h3>
          <p>Pendientes: {stats.pendingRequests}</p>
        </div>
      </div>

      <button onClick={handleResetData} style={{ marginTop: '2rem' }}>
        Resetear Datos
      </button>
    </div>
  );
}

*/