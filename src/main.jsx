import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BundleProvider } from './state/BundleProvider.jsx'

createRoot(document.getElementById('root')).render(
    <BundleProvider>
        <App />
    </BundleProvider>
)
