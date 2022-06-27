import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import debounce from 'lodash.debounce';
import styles from './CircleDrawer.module.css';

//Performance not found

const DEFAULT_DIAMETER = 24;
interface Circle {
  x: number;
  y: number;
  diameter: number;
  hovered: boolean;
}

function createCircle(x: number, y: number, diameter: number): Circle {
  return {
    x,
    y,
    diameter,
    hovered: false,
  };
}

interface Position {
  x: number;
  y: number;
}

function getDistanceBetweenPoints(point1: Position, point2: Position) {
  const x = (point2.x - point1.x) ** 2;
  const y = (point2.y - point1.y) ** 2;
  return Math.sqrt(x + y);
}

interface InitialStateType {
  circles: Circle[];
  undoState: Circle[][];
  redoState: Circle[][];
}

const initialState: InitialStateType = {
  circles: [],
  undoState: [[]],
  redoState: [],
};

type ACTIONTYPE =
  | { type: 'Add circle'; payload: Circle }
  | { type: 'Change diameter'; payload: number }
  | { type: 'Undo' }
  | { type: 'Redo' }
  | { type: 'Hover circle'; payload: { x: number; y: number } };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'Add circle': {
      const updatedCircles = [...state.circles, action.payload];
      return {
        ...state,
        circles: updatedCircles,
        undoState: [...state.undoState, [...updatedCircles]],
        redoState: [],
      };
    }

    case 'Undo': {
      let prevIndex = state.undoState.length - 2;
      if (prevIndex < 0) {
        prevIndex = 0;
      }

      const prevState = [...state.undoState[prevIndex]];
      return {
        ...state,
        circles: prevState,
        undoState: state.undoState.slice(0, state.undoState.length - 1),
        redoState: [...state.redoState, [...state.circles]],
      };
    }

    case 'Redo': {
      const prevIndex = state.redoState.length - 1;

      let prevState: Circle[] = state.redoState[0];
      if (state.redoState.length > 1) {
        prevState = [...state.redoState[prevIndex]];
      }
      return {
        ...state,
        circles: prevState,
        undoState: [...state.undoState, [...prevState]],
        redoState: state.redoState.slice(0, state.redoState.length - 1),
      };
    }

    case 'Change diameter': {
      return {
        ...state,
        circles: state.circles.map(circle =>
          circle.hovered
            ? { ...circle, diameter: action.payload }
            : { ...circle },
        ),
        undoState: [...state.undoState, [...state.circles]],
      };
    }

    case 'Hover circle': {
      const filteredCircles = state.circles
        .filter(({ x, y, diameter }) => {
          const distance = getDistanceBetweenPoints(
            { x: action.payload.x, y: action.payload.y },
            { x, y },
          );
          if (distance <= diameter / 2) {
            return true;
          }

          return false;
        })
        .sort((a, b) => a.diameter - b.diameter);

      const closestCircle = filteredCircles[0];
      if (!closestCircle) {
        return {
          ...state,
          circles: state.circles.map(circle => ({ ...circle, hovered: false })),
        };
      }

      return {
        ...state,
        circles: state.circles.map(circle =>
          circle.x === closestCircle.x && circle.y === closestCircle.y
            ? { ...circle, hovered: true }
            : { ...circle, hovered: false },
        ),
      };
    }
    default:
      throw new Error();
  }
}

//TODO: use USEREDUCER
export default function CircleDrawer(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentDiameter, setCurrentDiameter] = useState(DEFAULT_DIAMETER);
  const { circles, undoState, redoState } = state;

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });

  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const isHovered = state.circles.find(({ hovered }) => hovered === true);

  function handleContextClick(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    const { nativeEvent } = e;
    nativeEvent.preventDefault();

    if (isHovered) {
      setIsContextMenuOpen(true);
      setAnchorPoint({ x: nativeEvent.offsetX, y: nativeEvent.offsetY });
      setCurrentDiameter(
        circles.find(circle => circle.hovered)?.diameter || DEFAULT_DIAMETER,
      );
    }
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    canvasRef.current!.width = canvasWrapperRef!.current!.clientWidth;

    const context = canvas!.getContext('2d');
    contextRef.current = context;
  }, []);

  useEffect(() => {
    redraw();
  }, [circles]);

  function handleUndo() {
    dispatch({ type: 'Undo' });
  }

  function handleRedo() {
    dispatch({ type: 'Redo' });
  }

  function handleAddCircle({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const { offsetX, offsetY } = nativeEvent;

    if (!contextRef.current) {
      return;
    }

    if (isContextMenuOpen) {
      setIsContextMenuOpen(false);
      return;
    }

    if (isHovered) {
      return;
    }

    const { x, y, diameter, hovered } = createCircle(
      offsetX,
      offsetY,
      DEFAULT_DIAMETER,
    );

    contextRef.current.beginPath();
    contextRef.current.arc(x, y, diameter / 2, 0, Math.PI * 2, true);
    contextRef.current.stroke();
    dispatch({ type: 'Add circle', payload: { x, y, diameter, hovered } });
  }

  function handleCanvasHover(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    const { clientX, clientY } = e;
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect || circles.length === 0 || isContextMenuOpen) {
      return;
    }
    dispatch({
      type: 'Hover circle',
      payload: { x: clientX - rect.left, y: clientY - rect.top },
    });
  }

  function redraw() {
    contextRef.current?.clearRect(
      0,
      0,
      canvasRef.current?.width as number,
      canvasRef.current?.height as number,
    );

    circles.forEach(({ x, y, diameter, hovered }) => {
      contextRef.current?.beginPath();
      contextRef.current?.arc(x, y, diameter / 2, 0, Math.PI * 2, true);
      if (hovered) {
        contextRef.current!.fillStyle = 'grey';
        contextRef.current?.fill();
      }

      contextRef.current!.stroke();
    });
  }

  function handleDiameterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    setCurrentDiameter(value);
    debouncedDiameterChange(value);
  }

  const debouncedDiameterChange = useCallback(
    debounce((value: number) => {
      dispatch({ type: 'Change diameter', payload: value });
    }, 50),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedDiameterChange.cancel();
    };
  }, []);

  const contextMenuStyles = `${styles.contextMenu} ${
    isContextMenuOpen ? styles.contextMenuOpen : ''
  }`;

  return (
    <div>
      <h3>Circle Drawer</h3>
      <div>
        <button
          onClick={handleUndo}
          disabled={isContextMenuOpen || undoState.length === 1}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={isContextMenuOpen || redoState.length === 0}
        >
          Redo
        </button>
      </div>
      <div ref={canvasWrapperRef} className={styles.canvas}>
        <canvas
          ref={canvasRef}
          onClick={handleAddCircle}
          onMouseMove={handleCanvasHover}
          onContextMenu={handleContextClick}
          data-testid="canvas"
        ></canvas>
        <div
          className={contextMenuStyles}
          style={{ top: anchorPoint.y, left: anchorPoint.x }}
        >
          <label htmlFor="diameter">Adjust Diameter</label>
          <input
            id="diameter"
            value={currentDiameter}
            onChange={handleDiameterChange}
            type="range"
            min={8}
            max={100}
          ></input>
        </div>
      </div>
    </div>
  );
}
