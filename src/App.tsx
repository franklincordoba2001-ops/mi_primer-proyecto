import React from 'react';
import { TarjetaTramite } from './components/TarjetaTramite';
import { Droplets, Trash2, Lightbulb, Building2, PhoneCall, ShieldCheck, Search } from 'lucide-react';

export function App() {
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Canal Oficial Verificado
            </span>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Encabezado "Respuestas" requerido por el usuario */}
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
