import { useState, useEffect } from 'react';
import {
  FileText,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  Share2,
  Building2,
  ShieldCheck,
  MapPin,
  RefreshCw
} from 'lucide-react';
import type { PqrsItem } from './ConsultasPage';

interface DetalleConsultaPageProps {
  radicadoId?: string;
  onBack: () => void;
}

export function DetalleConsultaPage({ radicadoId, onBack }: DetalleConsultaPageProps) {
  const [item, setItem] = useState<PqrsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/pqrs');
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor para obtener el detalle del radicado.');
        }
        const data: PqrsItem[] = await response.json();
        
        // Buscar el radicado por ID exacto o por índice numérico (ej: "1" -> primer elemento o RAD-2026-001)
        let found = data.find(p => p.id.toLowerCase() === radicadoId?.toLowerCase());
        if (!found && radicadoId) {
          const numericIndex = parseInt(radicadoId, 10);
          if (!isNaN(numericIndex) && numericIndex > 0 && numericIndex <= data.length) {
            found = data[numericIndex - 1];
          } else {
            found = data.find(p => p.id.includes(radicadoId));
          }
        }

        if (!found && data.length > 0) {
          // Fallback por defecto si no se especifica ID
          found = data[0];
        }

        if (found) {
          setItem(found);
        } else {
          setError('El radicado solicitado no existe en la base de datos oficial.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la ficha técnica.');
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [radicadoId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/consultas/${item?.id || radicadoId || '1'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="state-box loading-box">
        <div className="spinner"></div>
        <p className="state-title">Cargando Ficha Técnica del Radicado...</p>
        <p className="state-desc">Obteniendo la información oficial de la consulta.</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="state-box error-box">
        <div className="state-icon error-icon">
          <AlertCircle size={36} />
        </div>
        <h3 className="state-title">Radicado No Encontrado</h3>
        <p className="state-desc">{error || 'No se encontró la información del trámite.'}</p>
        <button className="btn-secondary-action" onClick={onBack}>
          <ArrowLeft size={16} /> Volver a Consultas
        </button>
      </div>
    );
  }

  const isResuelto = item.estado === 'Resuelto';

  return (
    <div className="detalle-container">
      {/* Botones de Acción de la Ficha */}
      <div className="detalle-actions-bar">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} /> Volver a Consultas
        </button>

        <button
          className={`btn-copy-link ${copied ? 'btn-copied' : ''}`}
          onClick={handleCopyLink}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
        </button>
      </div>

      {/* Tarjeta Principal de la Ficha Técnica */}
      <article className="ficha-tecnica-card">
        {/* Cabecera Institucional de la Ficha */}
        <div className="ficha-header">
          <div className="ficha-header-top">
            <div className="ficha-brand-badge">
              <Building2 size={20} />
              <span>FICHA TÉCNICA OFICIAL DE TRÁMITE</span>
            </div>
            <span className={`estado-badge ${isResuelto ? 'estado-resuelto' : 'estado-tramite'}`}>
              {isResuelto ? <CheckCircle2 size={16} /> : <RefreshCw size={16} className="spin-icon" />}
              {item.estado}
            </span>
          </div>

          <div className="ficha-title-group">
            <h2 className="ficha-radicado-id">
              <FileText size={28} />
              Radicado N° {item.id}
            </h2>
            <span className="categoria-tag-large">{item.categoria}</span>
          </div>
        </div>

        {/* Cuerpo de la Ficha */}
        <div className="ficha-body">
          {/* Grid de Datos Clave */}
          <div className="ficha-info-grid">
            <div className="info-card-item">
              <span className="info-label">
                <User size={16} /> Solicitante Ciudadano
              </span>
              <strong className="info-value">{item.solicitante}</strong>
            </div>

            <div className="info-card-item">
              <span className="info-label">
                <Calendar size={16} /> Fecha de Radicación
              </span>
              <strong className="info-value">{item.fechaRadicacion}</strong>
            </div>

            <div className="info-card-item">
              <span className="info-label">
                <Clock size={16} /> Plazo Legal de Respuesta
              </span>
              <strong className="info-value">{item.plazoLegal}</strong>
            </div>

            <div className="info-card-item">
              <span className="info-label">
                <MapPin size={16} /> Cobertura Territorial
              </span>
              <strong className="info-value">Jurisdicción Municipal</strong>
            </div>
          </div>

          {/* Descripción Completa del Caso */}
          <div className="ficha-section">
            <h3 className="ficha-section-title">
              <FileText size={18} /> Descripción Completa del Solicitante
            </h3>
            <div className="ficha-text-box">
              <p>{item.descripcion}</p>
            </div>
          </div>

          {/* Respuesta Oficial Institucional */}
          <div className="ficha-section">
            <h3 className="ficha-section-title">
              <ShieldCheck size={18} color="var(--azul-institucional)" /> Respuesta Oficial Emitida
            </h3>
            <div className={`respuesta-oficial-card ${isResuelto ? 'resuelto' : 'tramite'}`}>
              <div className="respuesta-card-header">
                <span className="respuesta-entidad">Entidad Responsable: Administración Municipal</span>
                <span className="respuesta-fecha">Estado: {item.estado}</span>
              </div>
              <p className="respuesta-contenido">{item.respuestaOficial}</p>
            </div>
          </div>

          {/* Historial de Trazabilidad (Timeline) */}
          <div className="ficha-section">
            <h3 className="ficha-section-title">
              <Share2 size={18} /> Trazabilidad y Línea de Tiempo del Trámite
            </h3>
            <div className="timeline-container">
              <div className="timeline-step completed">
                <div className="step-icon"><CheckCircle2 size={16} /></div>
                <div className="step-content">
                  <strong>Radicación de la PQRS</strong>
                  <p>Registrado en el portal institucional el {item.fechaRadicacion}.</p>
                </div>
              </div>

              <div className="timeline-step completed">
                <div className="step-icon"><CheckCircle2 size={16} /></div>
                <div className="step-content">
                  <strong>Asignación Técnica</strong>
                  <p>Caso transferido a la Secretaría competente de {item.categoria}.</p>
                </div>
              </div>

              <div className={`timeline-step ${isResuelto ? 'completed' : 'active'}`}>
                <div className="step-icon">
                  {isResuelto ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                </div>
                <div className="step-content">
                  <strong>{isResuelto ? 'Trámite Concluido y Resuelto' : 'En Inspección y Atención'}</strong>
                  <p>{item.respuestaOficial}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de la Ficha */}
        <div className="ficha-footer">
          <div className="verificacion-stamp">
            <ShieldCheck size={18} color="#10b981" /> Documento Auténtico y Verificado por el Gobierno Municipal
          </div>
          <button className="btn-secondary-action" onClick={onBack}>
            <ArrowLeft size={16} /> Volver a la Lista de Consultas
          </button>
        </div>
      </article>
    </div>
  );
}

export default DetalleConsultaPage;
