import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  User,
  Info
} from 'lucide-react';

export interface PqrsItem {
  id: string;
  solicitante: string;
  categoria: string;
  descripcion: string;
  estado: 'En trámite' | 'Resuelto' | string;
  fechaRadicacion: string;
  plazoLegal: string;
  respuestaOficial: string;
}

export function ConsultasPage() {
  const [items, setItems] = useState<PqrsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const fetchPqrs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pqrs');
      if (!response.ok) {
        throw new Error(`Error en el servidor: HTTP status ${response.status}`);
      }
      const data: PqrsItem[] = await response.json();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo establecer comunicación con el servidor de trámites.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPqrs();
  }, []);

  // Filtrado dinámico en tiempo real
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory =
        selectedCategory === 'Todas' || item.categoria === selectedCategory;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.id.toLowerCase().includes(term) ||
        item.solicitante.toLowerCase().includes(term) ||
        item.descripcion.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term) ||
        item.estado.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [items, searchTerm, selectedCategory]);

  const categories = ['Todas', 'Agua y Alcantarillado', 'Recolección de Basura', 'Alumbrado Público'];

  return (
    <div className="consultas-container">
      {/* Encabezado de la Sección */}
      <section className="consultas-header">
        <div>
          <h2 className="consultas-title">Consulta de Trámites y PQRS</h2>
          <p className="consultas-subtitle">
            Consulte en tiempo real el estado de su radicado y la respuesta oficial institucional.
          </p>
        </div>
        <button
          className="btn-refresh"
          onClick={fetchPqrs}
          disabled={loading}
          title="Actualizar datos"
        >
          <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
          <span>Actualizar</span>
        </button>
      </section>

      {/* Bar de Búsqueda y Filtros por Categoría */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por N° Radicado (ej: RAD-2026-001), Solicitante o palabra clave..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>

        <div className="category-pills">
          <span className="filter-label">
            <Filter size={14} /> Categoría:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ESTADO 1: CARGANDO */}
      {loading && (
        <div className="state-box loading-box">
          <div className="spinner"></div>
          <p className="state-title">Cargando solicitudes de PQRS...</p>
          <p className="state-desc">Consultando la base de datos institucional en tiempo real.</p>
        </div>
      )}

      {/* ESTADO 2: ERROR DE CONEXIÓN */}
      {!loading && error && (
        <div className="state-box error-box">
          <div className="state-icon error-icon">
            <AlertTriangle size={36} />
          </div>
          <h3 className="state-title">Error al consultar los trámites</h3>
          <p className="state-desc">{error}</p>
          <button className="btn-retry" onClick={fetchPqrs}>
            <RefreshCw size={16} /> Reintentar Conexión
          </button>
        </div>
      )}

      {/* ESTADO 3: VACÍO (NO HAY RESULTADOS) */}
      {!loading && !error && filteredItems.length === 0 && (
        <div className="state-box empty-box">
          <div className="state-icon empty-icon">
            <FileText size={36} />
          </div>
          <h3 className="state-title">No se encontraron trámites</h3>
          <p className="state-desc">
            No existen radicados que coincidan con la búsqueda "{searchTerm}"{' '}
            {selectedCategory !== 'Todas' ? `en la categoría "${selectedCategory}"` : ''}.
          </p>
          <button
            className="btn-secondary-action"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todas');
            }}
          >
            Limpiar Filtros de Búsqueda
          </button>
        </div>
      )}

      {/* ESTADO 4: LISTA CON DATOS */}
      {!loading && !error && filteredItems.length > 0 && (
        <div className="pqrs-results-section">
          <div className="results-count">
            Mostrando <strong>{filteredItems.length}</strong> de {items.length} radicados encontrados
          </div>

          <div className="pqrs-cards-grid">
            {filteredItems.map(item => {
              const isResuelto = item.estado === 'Resuelto';
              return (
                <article key={item.id} className="pqrs-card">
                  {/* Tarjeta Top / Header */}
                  <div className="pqrs-card-header">
                    <div className="radicado-badge">
                      <FileText size={16} />
                      <span>{item.id}</span>
                    </div>

                    <span className={`estado-badge ${isResuelto ? 'estado-resuelto' : 'estado-tramite'}`}>
                      {isResuelto ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {item.estado}
                    </span>
                  </div>

                  {/* Cuerpo */}
                  <div className="pqrs-card-body">
                    <span className="categoria-tag">{item.categoria}</span>
                    <h3 className="pqrs-solicitante">
                      <User size={16} color="var(--azul-institucional)" />
                      {item.solicitante}
                    </h3>
                    <p className="pqrs-descripcion">{item.descripcion}</p>

                    <div className="pqrs-metadata-row">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>Radicado: <strong>{item.fechaRadicacion}</strong></span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>Plazo: <strong>{item.plazoLegal}</strong></span>
                      </div>
                    </div>

                    {/* Respuesta Oficial */}
                    <div className={`respuesta-oficial-box ${isResuelto ? 'respuesta-exito' : 'respuesta-proceso'}`}>
                      <div className="respuesta-header">
                        <Info size={16} />
                        <span>Respuesta Oficial Institucional</span>
                      </div>
                      <p className="respuesta-texto">{item.respuestaOficial}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultasPage;
