import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchForm } from './pages/SearchForm';
import { SearchResults } from './pages/SearchResults';
import { ThemeProvider } from "@emotion/react";
import { theme } from "./styles/Theme";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<SearchForm />} />
          <Route path="/results" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
