import type { ReactNode, FC } from 'react';

export interface TarjetaTramiteProps {
  titulo: string;
  descripcion: string;
  categoria: string;
  icono?: ReactNode;
  tags?: string[];
}

export const TarjetaTramite: FC<TarjetaTramiteProps> = ({
  titulo,
  descripcion,
  categoria,
  icono,
  tags
}) => {
  return (
    <article className="tarjeta-tramite">
      <div className="tarjeta-header">
        <span className="tarjeta-categoria">{categoria}</span>
        {icono && <div className="tarjeta-icono">{icono}</div>}
      </div>

      <h3 className="tarjeta-titulo">{titulo}</h3>
      <p className="tarjeta-descripcion">{descripcion}</p>

      {tags && tags.length > 0 && (
        <div className="tarjeta-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="tarjeta-tag-item">
              • {tag}
            </span>
          ))}
        </div>
      )}

      <div className="tarjeta-footer">
        <button className="btn-tramite" type="button">
          Ver información / Trámite &rarr;
        </button>
      </div>
    </article>
  );
};

export default TarjetaTramite;
