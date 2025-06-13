import './App.css'
import PDFviewer from './components/PDFviewer';

function App() {
  return (
    <>
      <div className="App">
        <h3 className='text-navy'>PDF Viewer</h3>
        <p className='text-navy'>Klik/Tap 2x untuk reset ke posisi awal</p>
        <PDFviewer />
      </div>
    </>
  )
}

export default App
