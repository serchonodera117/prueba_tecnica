import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import "../myStyles/component.css";


const Component = ({
    updateMoveable,
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    setSelected,
    isSelected = false,
    updateEnd,
  }) => {
    const ref = useRef();
  
    const [nodoReferencia, setNodoReferencia] = useState({
      top,
      left,
      width,
      height,
      index,
      color,
      id,
    });
  
    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();
    
    const onResize = async (e) => {
      // ACTUALIZAR ALTO Y ANCHO
      let newWidth = e.width;
      let newHeight = e.height;
  
      const positionMaxTop = top + newHeight;
      const positionMaxLeft = left + newWidth;
  
      if (positionMaxTop > parentBounds?.height)
        newHeight = parentBounds?.height - top;
      if (positionMaxLeft > parentBounds?.width)
        newWidth = parentBounds?.width - left;
  
      updateMoveable(id, {
        top,
        left,
        width: newWidth,
        height: newHeight,
        color,
      });
  
      // ACTUALIZAR NODO REFERENCIA
      const beforeTranslate = e.drag.beforeTranslate;
  
      ref.current.style.width = `${e.width}px`;
      ref.current.style.height = `${e.height}px`;
  
      let translateX = beforeTranslate[0];
      let translateY = beforeTranslate[1];
  
      ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
  
      setNodoReferencia({
        ...nodoReferencia,
        translateX,
        translateY,
        top: top + translateY < 0 ? 0 : top + translateY,
        left: left + translateX < 0 ? 0 : left + translateX,
      });
    };
  
    const onResizeEnd = async (e) => {
      let newWidth = e.lastEvent?.width;
      let newHeight = e.lastEvent?.height;
  
      const positionMaxTop = top + newHeight;
      const positionMaxLeft = left + newWidth;
  
      if (positionMaxTop > parentBounds?.height)
        newHeight = parentBounds?.height - top;
      if (positionMaxLeft > parentBounds?.width)
        newWidth = parentBounds?.width - left;
  
      const { lastEvent } = e;
      const { drag } = lastEvent;
      const { beforeTranslate } = drag;
  
      const absoluteTop = top + beforeTranslate[1];
      const absoluteLeft = left + beforeTranslate[0];
  
      updateMoveable(
        id,
        {
          top: absoluteTop,
          left: absoluteLeft,
          width: newWidth,
          height: newHeight,
          color,
        },
        true
      );
    };
  
    return (
      <>
        <div
          ref={ref}
          className="draggable"
          id={"component-" + id}
          style={{
            position: "absolute",
            top: top,
            left: left,
            width: width,
            height: height,
            background: color,
          }}
          onClick={() => setSelected(id)}
        />
  
        <Moveable
          target={isSelected && ref.current}
          resizable
          draggable
          onDrag={(e) => {
            updateMoveable(id, {
              top: e.top,
              left: e.left,
              width,
              height,
              color,
            });
          }}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          keepRatio={false}
          throttleResize={1}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          edge={false}
          zoom={1}
          origin={false}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        />
      </>
    );
  };

  export default Component;