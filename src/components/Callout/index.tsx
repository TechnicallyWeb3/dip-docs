import React, { PropsWithChildren } from 'react';

export type CalloutProps = PropsWithChildren<{
  type?: 'info' | 'success' | 'warning' | 'danger' | 'note';
  title?: string;
  className?: string;
}>;

export default function Callout({ type = 'info', title, className, children }: CalloutProps) {
  const baseClass = 'alert';
  const typeClass = `alert--${type}`;
  const combinedClassName = [baseClass, typeClass, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} role="alert">
      {title ? <div className="alert__heading">{title}</div> : null}
      <div>{children}</div>
    </div>
  );
} 