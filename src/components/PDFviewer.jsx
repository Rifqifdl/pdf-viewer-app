import '../App.css'
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faMagnifyingGlassPlus, 
    faMagnifyingGlassMinus,
    faRotateLeft,
    faRotateRight, 
    faArrowsToDot, 
    faChevronRight, 
    faChevronLeft, 
    faChevronUp, 
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFviewer() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [rotate, setRotate] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [search, setSearch] = useState('');
    const [matchIndexes, setMatchIndexes] = useState([]);
    const [activeMatch, setActiveMatch] = useState(0);
    const [showZoomOverlay, setShowZoomOverlay] = useState(false);

    // =========== TRANSFORM =========== 
    const zoomIn = () => {
        setScale(prev => {
            const newScale = Math.min(prev + 0.2, 4.0);
            showZoomPercentOverlay();
            return newScale;
        });
    };

    const zoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.2, 0.5);
            showZoomPercentOverlay();
            return newScale;
        });
    };

    const reset = () => {
        const newScale = setScale(1.0);
        showZoomPercentOverlay();
        return newScale;
    }
    
    const rotateLeft = () => setRotate((prevRotate) => Math.max(prevRotate - 90));
    const rotateRight = () => setRotate((prevRotate) => Math.max(prevRotate + 90));
    
    // =========== NAVIGATION =========== 
    const prevPage = () => {
        if (pageNumber > 1) {
        setPageNumber(pageNumber - 1);
        }
    };
    
    const nextPage = () => {
        if (pageNumber < numPages) {
        setPageNumber(pageNumber + 1);
        }
    };

    const jumpPage = (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page) && page >= 1 && page <= numPages) {
            setPageNumber(page);
        }
    };

    // =========== ZOOM OVERLAY =========== 
    const showZoomPercentOverlay = () => {
        setShowZoomOverlay(true);
        setTimeout(() => setShowZoomOverlay(false), 1000);
    };

    // =========== SEARCH AND HIGHLIGHT =========== 
    const highlight = () => {
        const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
        if (search) {
            let matches = []; //Kata yang cocok
            let matchCounter = 0;
            textLayers.forEach((layer, layerIndex) => {
                const spans = layer.querySelectorAll('span');
                spans.forEach((span, spanIndex) => {
                    const originalText = span.textContent;
                    span.innerHTML = originalText;
                    span.style.backgroundColor = "transparent";
                    span.style.outline = "none";
                    
                    //Cek kata yang dicari
                    if (originalText.toLowerCase().includes(search.toLowerCase())) {
                        const regex = new RegExp(`(${search})`, 'gi');
                
                        // Cek kata cocok yang aktif
                        const replaced = originalText.replace(regex, (match) => {
                            const isActive = matchCounter === activeMatch;
                            const markup = isActive
                            ? `<mark style="background-color: yellow">${match}</mark>` //Highlight kata yang cocok dengan warna
                            : `${match}`;
                            matchCounter++;
                            return markup;
                        });
                
                        span.innerHTML = replaced;
                        matches.push({ span, layerIndex, spanIndex });
                    }
                });
                setMatchIndexes(matches);
            });
        } else {
            textLayers.forEach((layer) => {
                const spans = layer.querySelectorAll('span');
                spans.forEach((span) => {
                    span.innerHTML = span.textContent; //Reset mark/highlight
                    span.style.backgroundColor = "transparent";
                });
            });
            setMatchIndexes([]); //Reset jumlah kata yang cocok
            setActiveMatch(0); //reset kata cocok yang aktif
        }
    }

    useEffect(() => {
        highlight();
    });

    return (
        <div>
            {/* ========== GET PDF ==========*/}
            <TransformWrapper wheel={{ disabled: true }} doubleClick={{disabled: true}}>
                <TransformComponent>
                    <Document
                        file="https://api.nextbv.app/v1/files/e2a5032e-ca35-4993-979a-5007f0546578/content" //GET PDF from API
                        
                        // Handle Loading
                        onLoadSuccess={({ numPages }) => {
                            setNumPages(numPages);
                            setLoading(false);
                            console.log(`PDF loaded with ${numPages} pages`);
                        }}
                        
                        // Handle Error
                        onLoadError={(error) => {
                            setError(error.message || "Failed to load PDF");
                            setLoading(false);
                            console.error("Error loading PDF", error);
                        }}
                    >
                    
                    {/* Handle Loading & Error */}
                    {loading && <p>Loading PDF...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    
                    {!loading && !error && (
                        <Page 
                            pageNumber={pageNumber} 
                            scale={scale}
                            rotate={rotate}
                            renderTextLayer={true}
                            onRenderSuccess={highlight}
                        />
                    )}
                    </Document>
                </TransformComponent>
            </TransformWrapper>
            
            {/* ========== CUSTOM CONTAINER ==========*/}
            <div className="wrapper">

                {/* ========== ZOOM PERCENT OVERLAY ==========*/}
                {showZoomOverlay && (
                    <div className='zoom-overlay'>
                        {Math.round(scale * 100)}%
                    </div>
                )}

                {/* FLOATING BUTTON */}
                <div className="float-button">

                    {/* ========== ZOOM BUTTON ==========*/}
                    <div className="action-area right-border">
                        <button onClick={zoomIn} className="btn btn-primary" title='Zoom In'><FontAwesomeIcon icon={faMagnifyingGlassPlus} /></button>
                        <button onClick={zoomOut} className="btn btn-primary" title='Zoom Out'><FontAwesomeIcon icon={faMagnifyingGlassMinus} /></button>
                        <button onClick={reset} className="btn btn-warning" title='Reset Size'><FontAwesomeIcon icon={faArrowsToDot} /></button>
                    </div>

                    {/* ========== ROTATE BUTTON ==========*/}
                    <div className="action-area right-border">
                        <button onClick={rotateLeft} className="btn btn-primary" title='Rotate Counter Clockwise'><FontAwesomeIcon icon={faRotateLeft} /></button>
                        <button onClick={rotateRight} className="btn btn-primary" title='Rotate Clockwise'><FontAwesomeIcon icon={faRotateRight} /></button>
                    </div>
                    
                    {/* ========== NAVIGATION BUTTON ==========*/}
                    <div className="action-area right-border">
                        <button onClick={prevPage} className="btn btn-primary" title='Previous Page'><FontAwesomeIcon icon={faChevronLeft} /></button>
                        <input
                            type="number"
                            className="input input-page no-spinner"
                            value={pageNumber}
                            onChange={jumpPage}
                            min="1"
                            max={numPages}
                        />
                        <p style={{fontSize: '15px'}}>of {numPages}</p>
                        <button onClick={nextPage} className="btn btn-primary" title='Next Page'><FontAwesomeIcon icon={faChevronRight} /></button>
                    </div>
                    
                    {/* ========== SEARCH & HIGHLIGHT ==========*/}
                    <div className="action-area">
                        <input
                            type="text"
                            className="input input-search"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            onClick={() =>
                            setActiveMatch((prevMatch) => (prevMatch - 1 + matchIndexes.length) % matchIndexes.length)
                            }
                            disabled={matchIndexes.length === 0}
                            className="btn btn-primary"
                            title='Previous Result'
                        ><FontAwesomeIcon icon={faChevronUp} /> </button>
                        
                        <span>
                            {matchIndexes.length > 0 ? `${activeMatch + 1}/${matchIndexes.length}` : ''}
                        </span>
                        
                        <button
                            onClick={() =>
                            setActiveMatch((prevMatch) => (prevMatch + 1) % matchIndexes.length)
                            }
                            disabled={matchIndexes.length === 0}
                            className="btn btn-primary"
                            title='Next Result'
                        ><FontAwesomeIcon icon={faChevronDown} /></button>
                    </div>

                </div>
            </div>
        </div>
    );
}
