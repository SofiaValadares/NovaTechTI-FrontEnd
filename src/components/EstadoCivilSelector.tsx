import React from 'react';
import { ESTADOS_CIVIS } from '../constants/formOptions';

interface EstadoCivilSelectorProps {
  value: string;
  onChange: (valor: string) => void;
  id?: string;
}

export function EstadoCivilSelector({
  value,
  onChange,
  id = 'estado-civil',
}: EstadoCivilSelectorProps) {
  return (
    <fieldset className="estado-civil-fieldset">
      <legend id={`${id}-legend`} className="estado-civil-legend">
        Estado civil
      </legend>
      <div
        className="estado-civil-grid"
        role="radiogroup"
        aria-labelledby={`${id}-legend`}
      >
        {ESTADOS_CIVIS.map((opcao) => {
          const selecionado = value === opcao;
          const inputId = `${id}-${opcao.replace(/[^a-z0-9]/gi, '')}`;
          return (
            <label
              key={opcao}
              htmlFor={inputId}
              className={`estado-civil-option${selecionado ? ' is-selected' : ''}`}
            >
              <input
                id={inputId}
                type="radio"
                name={id}
                value={opcao}
                checked={selecionado}
                onChange={() => onChange(opcao)}
              />
              <span className="estado-civil-option__indicator" aria-hidden="true" />
              <span className="estado-civil-option__label">{opcao}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
