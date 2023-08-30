import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchForm } from './pages/SearchForm';
import { SearchResults } from './pages/SearchResults';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<SearchForm />} />
        <Route path="/results" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
