import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

export const DismissibleLayer = ({ children, className, onEscapeKeyDown, onPointerDownOutside }) => {
  const layerRef = useRef(null);
  const onEscapeKeyDownHandler = useCallbackRef(onEscapeKeyDown);
  const onPointerDownOutsideHandler = useCallbackRef(onPointerDownOutside);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onEscapeKeyDownHandler(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscapeKeyDownHandler]);

  useEffect(() => {
    const handlePointerDownOutside = (event) => {
      if (layerRef.current && !layerRef.current.contains(event.target)) {
        onPointerDownOutsideHandler();
      }
    };

    document.addEventListener('pointerdown', handlePointerDownOutside);

    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [onPointerDownOutsideHandler]);

  return (
    <div ref={layerRef} className={className}>
      {children}
    </div>
  );
};

DismissibleLayer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onEscapeKeyDown: PropTypes.func.isRequired,
  onPointerDownOutside: PropTypes.func.isRequired,
};

function useCallbackRef(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    () =>
      (...args) =>
        callbackRef.current?.(...args),
    [],
  );
}
