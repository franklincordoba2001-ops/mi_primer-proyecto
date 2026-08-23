import { useState, useEffect } from 'react';
import { TarjetaTramite } from './components/TarjetaTramite';
import { ConsultasPage } from './pages/ConsultasPage';
import { DetalleConsultaPage } from './pages/DetalleConsultaPage';
import { Droplets, Trash2, Lightbulb, Building2, Home, FileSearch } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'consultas' | 'detalle'>('consultas');
  const [selectedRadicadoId, setSelectedRadicadoId] = useState<string>('RAD-2026-001');

  // Soporte para URLs directas como /consultas/1 o /consultas/RAD-2026-001
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/consultas/')) {
      const idFromUrl = path.replace('/consultas/', '').trim();
      if (idFromUrl) {
        setSelectedRadicadoId(idFromUrl);
        setActiveTab('detalle');
      }
    }
  }, []);

  const handleSelectRadicado = (id: string) => {
    setSelectedRadicadoId(id);
    setActiveTab('detalle');
    window.history.pushState({}, '', `/consultas/${id}`);
  };

  const handleBackToConsultas = () => {
    setActiveTab('consultas');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="app-page">
      {/* Bar Institucional Superior */}
      <div className="top-bar-institucional">
        <div className="top-bar-container">
          <span>Portal Oficial de Atención Ciudadana</span>
          <span>Línea Gratuita: 01-8000-GOBIERNO</span>
        </div>
      </div>

      {/* Encabezado Principal Institucional */}
      <header className="header-institucional">
        <div className="header-container">
          <div className="brand-institucional">
            <div className="logo-escudo" title="Escudo Institucional">
              <Building2 size={26} />
            </div>
            <div>
              <h1 className="brand-text-title">Gobierno Municipal</h1>
              <p className="brand-text-subtitle">Sistema de Trámites y Servicios Públicos</p>
            </div>
          </div>

          {/* Navegación entre Servicios, PQRS y Ficha */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'consultas' || activeTab === 'detalle' ? 'active' : ''}`}
              onClick={handleBackToConsultas}
            >
              <FileSearch size={18} />
              Consultar PQRS
            </button>
            <button
              className={`nav-tab ${activeTab === 'inicio' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('inicio');
                window.history.pushState({}, '', '/');
              }}
            >
              <Home size={18} />
              Trámites Principales
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal según la vista activa */}
      <main className="main-content">
        {activeTab === 'inicio' && (
          <>
            {/* Encabezado "Respuestas" */}
            <section className="seccion-respuestas-header">
              <div>
                <h2 className="titulo-respuestas">Respuestas</h2>
                <p className="subtitulo-respuestas">
                  Seleccione la categoría correspondiente para consultar información o registrar su reporte ciudadano.
                </p>
              </div>
              <span className="badge-institucional">
                3 Servicios Disponibles
              </span>
            </section>

            {/* Grid de 3 Tarjetas en Columnas */}
            <section className="tarjetas-grid">
              {/* Tarjeta 1: Agua y Alcantarillado */}
              <TarjetaTramite
                titulo="Agua y Alcantarillado"
                descripcion="Reportes y solicitudes de atención para fugas de agua potable, cortes programados o imprevistos de servicio y mantenimiento a la red de alcantarillado."
                categoria="Servicios Básicos"
                icono={<Droplets size={24} />}
                tags={['Fugas', 'Cortes de servicio', 'Alcantarillado']}
              />

              {/* Tarjeta 2: Recolección de Basura */}
              <TarjetaTramite
                titulo="Recolección de Basura"
                descripcion="Información sobre rutas y horarios de recolección de residuos, reporte de acumulación de deshechos en vía pública y atención en puntos críticos."
                categoria="Aseo Urbano"
                icono={<Trash2 size={24} />}
                tags={['Horarios', 'Acumulación', 'Puntos críticos']}
              />

              {/* Tarjeta 3: Alumbrado Público */}
              <TarjetaTramite
                titulo="Alumbrado Público"
                descripcion="Atención oportuna para el reporte de lámparas y luminarias apagadas, postes caídos o dañados, y fallas en el circuito eléctrico de calles y parques."
                categoria="Infraestructura"
                icono={<Lightbulb size={24} />}
                tags={['Lámparas apagadas', 'Postes caídos', 'Circuitos con falla']}
              />
            </section>
          </>
        )}

        {activeTab === 'consultas' && (
          <ConsultasPage onSelectRadicado={handleSelectRadicado} />
        )}

        {activeTab === 'detalle' && (
          <DetalleConsultaPage
            radicadoId={selectedRadicadoId}
            onBack={handleBackToConsultas}
          />
        )}
      </main>

      {/* Pie de Página Institucional */}
      <footer className="footer-institucional">
        <div className="footer-container">
          <div className="footer-brand">
            Gobierno Municipal &bull; Portal de Respuestas Ciudadanas
          </div>
          <p>© {new Date().getFullYear()} Todos los derechos reservados. Desarrollado con React, Vite y TypeScript.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
