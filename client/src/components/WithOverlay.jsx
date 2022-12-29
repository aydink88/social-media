import { useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

export default function WithOverlay({ tooltip = '', placement = 'left', children, ...rest }) {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const toggle = () => setShow((prev) => !prev);

  return (
    <>
      <div ref={target} onMouseEnter={toggle} onMouseLeave={toggle} {...rest}>
        {children}
      </div>
      <Overlay target={target.current} show={show} placement={placement}>
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            {tooltip}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}
