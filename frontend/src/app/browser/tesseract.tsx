import { useEffect, useRef, useState } from "react";
import { Tesseract, autoMouse } from "../../browser/util/tesseract";
import { checkPos } from "../../browser/canvas";

type Rectangle = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export const UseOCR: React.FC<{canvas: HTMLCanvasElement}> = ({canvas}) => {
    return (
        <>
            <CheckMousePosition />
            <details>
                <summary>test OCR</summary>
                <UseTesseract id={"test"} canvas={canvas} rectangle={{left: 0, top: 0, width: canvas.width, height: canvas.height}}/>
            </details>
            <details>
                <summary>bid OCR</summary>
                <UseTesseractTick id={"bid"} canvas={canvas}/>
            </details>
            <details>
                <summary>bid2 OCR</summary>
                <UseTesseractTick2 id={"bid2"} canvas={canvas}/>
            </details>
            {/* <details>
                <summary>tickall OCR</summary>
                <UseTesseractTickAll id={"tick"} canvas={canvas}/>
            </details> */}
            <details>
                <summary>auto control</summary>
                <AutoControl canvas={canvas} />
            </details>
        </>
        
    );
};

const CheckMousePosition: React.FC = () => {
    const [isCheckState, setIsCheckState] = useState(false);
    useEffect(() => {
        checkPos(isCheckState);
        // console.log(`check Position: ${isCheckState}`);
    }, [isCheckState]);

    return(
        <div>
            {`${isCheckState}`}:&nbsp;
            <button className="btn btn-sm btn-outline text-base btn-warning" ref={
                    c => {if(c){c.onclick = () => {setIsCheckState(!isCheckState);}}}
            }>check Mouse Position</button>
        </div>
    );
};

const UseTesseract: React.FC<{id: string, canvas: HTMLCanvasElement, rectangle: Rectangle}> = ({id, canvas, rectangle}) => {
    const topRef = useRef<HTMLInputElement>(null);
    const leftRef = useRef<HTMLInputElement>(null);
    const widthRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);

    let ocr: Tesseract|undefined;
    
    return (
        <>
            <div>
                left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftRef} type="number" min={1} defaultValue={rectangle.left} />
                &nbsp;
                top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topRef} type="number" min={1} defaultValue={rectangle.top} />
                &nbsp;
                width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthRef} type="number" min={1} defaultValue={rectangle.width} />
                &nbsp;
                height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightRef} type="number" min={1} defaultValue={rectangle.height} />
                &nbsp;
                <button className="btn btn-sm btn-outline text-base btn-accent" ref={
                    c => {
                        if(c){
                            c.onclick = async () => {
                                const top = topRef.current?.value;
                                const left = leftRef.current?.value;
                                const width = widthRef.current?.value;
                                const height = heightRef.current?.value;

                                if(!(top && left && width && height))
                                    return;

                                const rectangle = {
                                    top: parseInt(top),
                                    left: parseInt(left),
                                    width: parseInt(width)-parseInt(left),
                                    height: parseInt(height)-parseInt(top)
                                };

                                const callback = (text: string) => {
                                    console.log(`${id}: ${text}`);
                                };

                                if(ocr){
                                    ocr.clear().then(() => {
                                        ocr?.detectRT(callback, rectangle);
                                    });
                                }else{
                                    ocr = new Tesseract(canvas);
                                    ocr.detectRT(callback, rectangle);
                                }
                            }
                        }
                    }
                }>ocr:{id}</button>
                &nbsp;
                <button className="btn btn-sm btn-outline text-base btn-warning" ref={
                    c => {if(c){c.onclick = () => {if(ocr) ocr.clear();}}}
                }>stop</button>
            </div>
        </>
    );
};

export const UseTesseractTick: React.FC<{id: string, canvas: HTMLCanvasElement}> = ({id, canvas}) => {
    const r1 = {left: 67, top:660, width: 152, height: 718};
    const r2 = {left: 163, top:660, width: 205, height: 718};
    const r3 = {left: 203, top:660, width: 238, height: 718};
    const r4 = {left: 238, top:656, width: 271, height: 698};
    const rs = {left: 471, top: 551, width: 522, height: 580};
    
    const top1Ref = useRef<HTMLInputElement>(null);
    const left1Ref = useRef<HTMLInputElement>(null);
    const width1Ref = useRef<HTMLInputElement>(null);
    const height1Ref = useRef<HTMLInputElement>(null);

    const top2Ref = useRef<HTMLInputElement>(null);
    const left2Ref = useRef<HTMLInputElement>(null);
    const width2Ref = useRef<HTMLInputElement>(null);
    const height2Ref = useRef<HTMLInputElement>(null);

    const top3Ref = useRef<HTMLInputElement>(null);
    const left3Ref = useRef<HTMLInputElement>(null);
    const width3Ref = useRef<HTMLInputElement>(null);
    const height3Ref = useRef<HTMLInputElement>(null);
   
    const top4Ref = useRef<HTMLInputElement>(null);
    const left4Ref = useRef<HTMLInputElement>(null);
    const width4Ref = useRef<HTMLInputElement>(null);
    const height4Ref = useRef<HTMLInputElement>(null);

    const topsRef = useRef<HTMLInputElement>(null);
    const leftsRef = useRef<HTMLInputElement>(null);
    const widthsRef = useRef<HTMLInputElement>(null);
    const heightsRef = useRef<HTMLInputElement>(null);

    let ocr: Tesseract|undefined;
    
    return (
        <>
            <div>
                <div>
                    rect1
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left1Ref} type="number" min={1} defaultValue={r1.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top1Ref} type="number" min={1} defaultValue={r1.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width1Ref} type="number" min={1} defaultValue={r1.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height1Ref} type="number" min={1} defaultValue={r1.height} />
                </div>
                <div>
                    rect2
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left2Ref} type="number" min={1} defaultValue={r2.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top2Ref} type="number" min={1} defaultValue={r2.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width2Ref} type="number" min={1} defaultValue={r2.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height2Ref} type="number" min={1} defaultValue={r2.height} />
                </div>
                <div>
                    rect3
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left3Ref} type="number" min={1} defaultValue={r3.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top3Ref} type="number" min={1} defaultValue={r3.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width3Ref} type="number" min={1} defaultValue={r3.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height3Ref} type="number" min={1} defaultValue={r3.height} />
                </div>
                <div>
                    rect4
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left4Ref} type="number" min={1} defaultValue={r4.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top4Ref} type="number" min={1} defaultValue={r4.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width4Ref} type="number" min={1} defaultValue={r4.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height4Ref} type="number" min={1} defaultValue={r4.height} />
                </div>
                <div>
                    rects
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftsRef} type="number" min={1} defaultValue={rs.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topsRef} type="number" min={1} defaultValue={rs.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthsRef} type="number" min={1} defaultValue={rs.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightsRef} type="number" min={1} defaultValue={rs.height} />
                </div>
                <button className="btn btn-sm btn-outline text-base btn-accent" ref={
                    c => {
                        if(c){
                            c.onclick = async () => {
                                const top1 = top1Ref.current?.value;
                                const left1 = left1Ref.current?.value;
                                const width1 = width1Ref.current?.value;
                                const height1 = height1Ref.current?.value;

                                const top2 = top2Ref.current?.value;
                                const left2 = left2Ref.current?.value;
                                const width2 = width2Ref.current?.value;
                                const height2 = height2Ref.current?.value;

                                const top3 = top3Ref.current?.value;
                                const left3 = left3Ref.current?.value;
                                const width3 = width3Ref.current?.value;
                                const height3 = height3Ref.current?.value;

                                const top4 = top4Ref.current?.value;
                                const left4 = left4Ref.current?.value;
                                const width4 = width4Ref.current?.value;
                                const height4 = height4Ref.current?.value;

                                const tops = topsRef.current?.value;
                                const lefts = leftsRef.current?.value;
                                const widths = widthsRef.current?.value;
                                const heights = heightsRef.current?.value;

                                if(
                                    !((top1 && left1 && width1 && height1) && 
                                    (top2 && left2 && width2 && height2) && 
                                    (top3 && left3 && width3 && height3) &&
                                    (top4 && left4 && width4 && height4))
                                )   return;



                                const rect1 = {
                                    top: parseInt(top1),
                                    left: parseInt(left1),
                                    width: parseInt(width1)-parseInt(left1),
                                    height: parseInt(height1)-parseInt(top1)
                                };

                                const rect2 = {
                                    top: parseInt(top2),
                                    left: parseInt(left2),
                                    width: parseInt(width2)-parseInt(left2),
                                    height: parseInt(height2)-parseInt(top2)
                                };

                                const rect3 = {
                                    top: parseInt(top3),
                                    left: parseInt(left3),
                                    width: parseInt(width3)-parseInt(left3),
                                    height: parseInt(height3)-parseInt(top3)
                                };

                                const rect4 = {
                                    top: parseInt(top4),
                                    left: parseInt(left4),
                                    width: parseInt(width4)-parseInt(left4),
                                    height: parseInt(height4)-parseInt(top4)
                                };

                                const rects = tops && lefts && widths && heights ? 
                                {
                                    top: parseInt(tops),
                                    left: parseInt(lefts),
                                    width: parseInt(widths)-parseInt(lefts),
                                    height: parseInt(heights)-parseInt(tops)
                                } : undefined;

                                const callback = (tick: number, sp?: number) => {
                                    bid = tick;
                                    
                                    if(sp){
                                        spread = sp;
                                        console.log(`${id} | bid: ${bid.toFixed(3)} | sp: ${spread}`);
                                    }else{
                                        console.log(`${id} | bid: ${bid.toFixed(3)}`);
                                    }
                                };

                                if(ocr){
                                    ocr.clear().then(() => {
                                        ocr?.detectTick(callback, rect1, rect2, rect3, rect4, rects);
                                    });
                                }else{
                                    ocr = new Tesseract(canvas);
                                    ocr.detectTick(callback, rect1, rect2, rect3, rect4, rects);
                                }
                            }
                        }
                    }
                }>ocr:{id}</button>
                &nbsp;
                <button className="btn btn-sm btn-outline text-base btn-warning" ref={
                    c => {if(c){c.onclick = () => {if(ocr) ocr.clear();}}}
                }>stop</button>
            </div>
        </>
    );
};

export const UseTesseractTick2: React.FC<{id: string, canvas: HTMLCanvasElement}> = ({id, canvas}) => {
    const r1 = {left: 39, top: 335, width: 80, height: 365};
    const r2 = {left: 84, top: 335, width: 122, height: 365};
    const r3 = {left: 122, top: 334, width: 137, height: 354};
    const rs = {left: 237, top: 279, width: 267, height: 296};
    
    const top1Ref = useRef<HTMLInputElement>(null);
    const left1Ref = useRef<HTMLInputElement>(null);
    const width1Ref = useRef<HTMLInputElement>(null);
    const height1Ref = useRef<HTMLInputElement>(null);

    const top2Ref = useRef<HTMLInputElement>(null);
    const left2Ref = useRef<HTMLInputElement>(null);
    const width2Ref = useRef<HTMLInputElement>(null);
    const height2Ref = useRef<HTMLInputElement>(null);

    const top3Ref = useRef<HTMLInputElement>(null);
    const left3Ref = useRef<HTMLInputElement>(null);
    const width3Ref = useRef<HTMLInputElement>(null);
    const height3Ref = useRef<HTMLInputElement>(null);

    const topsRef = useRef<HTMLInputElement>(null);
    const leftsRef = useRef<HTMLInputElement>(null);
    const widthsRef = useRef<HTMLInputElement>(null);
    const heightsRef = useRef<HTMLInputElement>(null);

    let ocr: Tesseract|undefined;
    
    return (
        <>
            <div>
                <div>
                    rect1
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left1Ref} type="number" min={1} defaultValue={r1.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top1Ref} type="number" min={1} defaultValue={r1.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width1Ref} type="number" min={1} defaultValue={r1.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height1Ref} type="number" min={1} defaultValue={r1.height} />
                </div>
                <div>
                    rect2
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left2Ref} type="number" min={1} defaultValue={r2.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top2Ref} type="number" min={1} defaultValue={r2.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width2Ref} type="number" min={1} defaultValue={r2.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height2Ref} type="number" min={1} defaultValue={r2.height} />
                </div>
                <div>
                    rect3
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={left3Ref} type="number" min={1} defaultValue={r3.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={top3Ref} type="number" min={1} defaultValue={r3.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={width3Ref} type="number" min={1} defaultValue={r3.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={height3Ref} type="number" min={1} defaultValue={r3.height} />
                </div>
                <div>
                    rects
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftsRef} type="number" min={1} defaultValue={rs.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topsRef} type="number" min={1} defaultValue={rs.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthsRef} type="number" min={1} defaultValue={rs.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightsRef} type="number" min={1} defaultValue={rs.height} />
                </div>
                <button className="btn btn-sm btn-outline text-base btn-accent" ref={
                    c => {
                        if(c){
                            c.onclick = async () => {
                                const top1 = top1Ref.current?.value;
                                const left1 = left1Ref.current?.value;
                                const width1 = width1Ref.current?.value;
                                const height1 = height1Ref.current?.value;

                                const top2 = top2Ref.current?.value;
                                const left2 = left2Ref.current?.value;
                                const width2 = width2Ref.current?.value;
                                const height2 = height2Ref.current?.value;

                                const top3 = top3Ref.current?.value;
                                const left3 = left3Ref.current?.value;
                                const width3 = width3Ref.current?.value;
                                const height3 = height3Ref.current?.value;

                                const tops = topsRef.current?.value;
                                const lefts = leftsRef.current?.value;
                                const widths = widthsRef.current?.value;
                                const heights = heightsRef.current?.value;

                                if(
                                    !((top1 && left1 && width1 && height1) && 
                                    (top2 && left2 && width2 && height2) && 
                                    (top3 && left3 && width3 && height3))
                                )   return;



                                const rect1 = {
                                    top: parseInt(top1),
                                    left: parseInt(left1),
                                    width: parseInt(width1)-parseInt(left1),
                                    height: parseInt(height1)-parseInt(top1)
                                };

                                const rect2 = {
                                    top: parseInt(top2),
                                    left: parseInt(left2),
                                    width: parseInt(width2)-parseInt(left2),
                                    height: parseInt(height2)-parseInt(top2)
                                };

                                const rect3 = {
                                    top: parseInt(top3),
                                    left: parseInt(left3),
                                    width: parseInt(width3)-parseInt(left3),
                                    height: parseInt(height3)-parseInt(top3)
                                };

                                const rects = tops && lefts && widths && heights ? 
                                {
                                    top: parseInt(tops),
                                    left: parseInt(lefts),
                                    width: parseInt(widths)-parseInt(lefts),
                                    height: parseInt(heights)-parseInt(tops)
                                } : undefined;

                                const callback = (tick: number, sp?: number) => {
                                    bid = tick;
                                    
                                    if(sp){
                                        spread = sp;
                                        console.log(`${id} | bid: ${bid.toFixed(3)} | sp: ${spread}`);
                                    }else{
                                        console.log(`${id} | bid: ${bid.toFixed(3)}`);
                                    }
                                };

                                if(ocr){
                                    ocr.clear().then(() => {
                                        ocr?.detectTick2(callback, rect1, rect2, rect3, rects);
                                    });
                                }else{
                                    ocr = new Tesseract(canvas);
                                    ocr.detectTick2(callback, rect1, rect2, rect3, rects);
                                }
                            }
                        }
                    }
                }>ocr:{id}</button>
                &nbsp;
                <button className="btn btn-sm btn-outline text-base btn-warning" ref={
                    c => {if(c){c.onclick = () => {if(ocr) ocr.clear();}}}
                }>stop</button>
            </div>
        </>
    );
};

export const UseTesseractTickAll: React.FC<{id: string, canvas: HTMLCanvasElement}> = ({id, canvas}) => {
    const rb1 = {left: 67, top:660, width: 152, height: 718};
    const rb2 = {left: 165, top:660, width: 238, height: 718};
    const rb3 = {left: 238, top:656, width: 271, height: 698};

    const ra1 = {left: 310, top:660, width: 392, height: 718};
    const ra2 = {left: 401, top:660, width: 478, height: 718};
    const ra3 = {left: 478, top:656, width: 511, height: 698};
    
    const topB1Ref = useRef<HTMLInputElement>(null);
    const leftB1Ref = useRef<HTMLInputElement>(null);
    const widthB1Ref = useRef<HTMLInputElement>(null);
    const heightB1Ref = useRef<HTMLInputElement>(null);

    const topB2Ref = useRef<HTMLInputElement>(null);
    const leftB2Ref = useRef<HTMLInputElement>(null);
    const widthB2Ref = useRef<HTMLInputElement>(null);
    const heightB2Ref = useRef<HTMLInputElement>(null);

    const topB3Ref = useRef<HTMLInputElement>(null);
    const leftB3Ref = useRef<HTMLInputElement>(null);
    const widthB3Ref = useRef<HTMLInputElement>(null);
    const heightB3Ref = useRef<HTMLInputElement>(null);

    const topA1Ref = useRef<HTMLInputElement>(null);
    const leftA1Ref = useRef<HTMLInputElement>(null);
    const widthA1Ref = useRef<HTMLInputElement>(null);
    const heightA1Ref = useRef<HTMLInputElement>(null);

    const topA2Ref = useRef<HTMLInputElement>(null);
    const leftA2Ref = useRef<HTMLInputElement>(null);
    const widthA2Ref = useRef<HTMLInputElement>(null);
    const heightA2Ref = useRef<HTMLInputElement>(null);

    const topA3Ref = useRef<HTMLInputElement>(null);
    const leftA3Ref = useRef<HTMLInputElement>(null);
    const widthA3Ref = useRef<HTMLInputElement>(null);
    const heightA3Ref = useRef<HTMLInputElement>(null);

    let ocr: Tesseract|undefined;
    
    return (
        <>
            <div>
                <div>
                    recB1
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftB1Ref} type="number" min={1} defaultValue={rb1.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topB1Ref} type="number" min={1} defaultValue={rb1.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthB1Ref} type="number" min={1} defaultValue={rb1.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightB1Ref} type="number" min={1} defaultValue={rb1.height} />
                </div>
                <div>
                    rectB2
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftB2Ref} type="number" min={1} defaultValue={rb2.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topB2Ref} type="number" min={1} defaultValue={rb2.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthB2Ref} type="number" min={1} defaultValue={rb2.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightB2Ref} type="number" min={1} defaultValue={rb2.height} />
                </div>
                <div>
                    rectB3
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftB3Ref} type="number" min={1} defaultValue={rb3.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topB3Ref} type="number" min={1} defaultValue={rb3.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthB3Ref} type="number" min={1} defaultValue={rb3.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightB3Ref} type="number" min={1} defaultValue={rb3.height} />
                </div>
                <div>
                    recA1
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftA1Ref} type="number" min={1} defaultValue={ra1.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topA1Ref} type="number" min={1} defaultValue={ra1.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthA1Ref} type="number" min={1} defaultValue={ra1.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightA1Ref} type="number" min={1} defaultValue={ra1.height} />
                </div>
                <div>
                    rectA2
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftA2Ref} type="number" min={1} defaultValue={ra2.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topA2Ref} type="number" min={1} defaultValue={ra2.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthA2Ref} type="number" min={1} defaultValue={ra2.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightA2Ref} type="number" min={1} defaultValue={ra2.height} />
                </div>
                <div>
                    rectA3
                    &nbsp;
                    left: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={leftA3Ref} type="number" min={1} defaultValue={ra3.left} />
                    &nbsp;
                    top: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={topA3Ref} type="number" min={1} defaultValue={ra3.top} />
                    &nbsp;
                    width: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={widthA3Ref} type="number" min={1} defaultValue={ra3.width} />
                    &nbsp;
                    height: <input className="input input-sm input-bordered input-primary w-24 max-w-sm text-base" ref={heightA3Ref} type="number" min={1} defaultValue={ra3.height} />
                </div>
                <button className="btn btn-sm btn-outline text-base btn-accent" ref={
                    c => {
                        if(c){
                            c.onclick = async () => {
                                const topB1 = topB1Ref.current?.value;
                                const leftB1 = leftB1Ref.current?.value;
                                const widthB1 = widthB1Ref.current?.value;
                                const heightB1 = heightB1Ref.current?.value;

                                const topB2 = topB2Ref.current?.value;
                                const leftB2 = leftB2Ref.current?.value;
                                const widthB2 = widthB2Ref.current?.value;
                                const heightB2 = heightB2Ref.current?.value;

                                const topB3 = topB3Ref.current?.value;
                                const leftB3 = leftB3Ref.current?.value;
                                const widthB3 = widthB3Ref.current?.value;
                                const heightB3 = heightB3Ref.current?.value;

                                const topA1 = topA1Ref.current?.value;
                                const leftA1 = leftA1Ref.current?.value;
                                const widthA1 = widthA1Ref.current?.value;
                                const heightA1 = heightA1Ref.current?.value;

                                const topA2 = topA2Ref.current?.value;
                                const leftA2 = leftA2Ref.current?.value;
                                const widthA2 = widthA2Ref.current?.value;
                                const heightA2 = heightA2Ref.current?.value;

                                const topA3 = topA3Ref.current?.value;
                                const leftA3 = leftA3Ref.current?.value;
                                const widthA3 = widthA3Ref.current?.value;
                                const heightA3 = heightA3Ref.current?.value;

                                if(
                                    !(
                                        (topB1 && leftB1 && widthB1 && heightB1) && 
                                        (topB2 && leftB2 && widthB2 && heightB2) && 
                                        (topB3 && leftB3 && widthB3 && heightB3) &&
                                        (topA1 && leftA1 && widthA1 && heightA1) &&
                                        (topA2 && leftA2 && widthA2 && heightA2) && 
                                        (topA3 && leftA3 && widthA3 && heightA3) 
                                    )
                                )   return;



                                const rectB1 = {
                                    top: parseInt(topB1),
                                    left: parseInt(leftB1),
                                    width: parseInt(widthB1)-parseInt(leftB1),
                                    height: parseInt(heightB1)-parseInt(topB1)
                                };

                                const rectB2 = {
                                    top: parseInt(topB2),
                                    left: parseInt(leftB2),
                                    width: parseInt(widthB2)-parseInt(leftB2),
                                    height: parseInt(heightB2)-parseInt(topB2)
                                };

                                const rectB3 = {
                                    top: parseInt(topB3),
                                    left: parseInt(leftB3),
                                    width: parseInt(widthB3)-parseInt(leftB3),
                                    height: parseInt(heightB3)-parseInt(topB3)
                                };

                                const rectA1 = {
                                    top: parseInt(topA1),
                                    left: parseInt(leftA1),
                                    width: parseInt(widthA1)-parseInt(leftA1),
                                    height: parseInt(heightA1)-parseInt(topA1)
                                };

                                const rectA2 = {
                                    top: parseInt(topA2),
                                    left: parseInt(leftA2),
                                    width: parseInt(widthA2)-parseInt(leftA2),
                                    height: parseInt(heightA2)-parseInt(topA2)
                                };

                                const rectA3 = {
                                    top: parseInt(topA3),
                                    left: parseInt(leftA3),
                                    width: parseInt(widthA3)-parseInt(leftA3),
                                    height: parseInt(heightA3)-parseInt(topA3)
                                };

                                const callback = (ticks: {bid: number, ask: number}) => {
                                    bid = ticks.bid;
                                    ask = ticks.ask;
                                    spread = Math.floor((ask-bid)*1000) / 1000;
                                    console.log(`${id}| bid: ${bid.toFixed(3)} | ask: ${ask.toFixed(3)} | s: ${spread.toFixed(3)}`);
                                };

                                if(ocr){
                                    ocr.clear().then(() => {
                                        ocr?.detectTickAll(callback, rectB1, rectB2, rectB3, rectA1, rectA2, rectA3);
                                    });
                                }else{
                                    ocr = new Tesseract(canvas);
                                    ocr.detectTickAll(callback, rectB1, rectB2, rectB3, rectA1, rectA2, rectA3);
                                }
                            }
                        }
                    }
                }>ocr:{id}</button>
                &nbsp;
                <button className="btn btn-sm btn-outline text-base btn-warning" ref={
                    c => {if(c){c.onclick = () => {if(ocr) ocr.clear();}}}
                }>stop</button>
            </div>
        </>
    );
};

const AutoControl: React.FC<{canvas: HTMLCanvasElement}> = ({canvas}) => {
    return (
        <div>
            <button className="btn btn-sm btn-outline text-base btn-base-content" ref={
                    c => {if(c){c.onclick = () => {
                        autoMouse(canvas, {button: "contextmenu", pos: {x: 500, y: 500}});
                    }}}
            }>auto</button>
        </div>
    );
};


let bid: number;
let ask: number;
let spread: number;
