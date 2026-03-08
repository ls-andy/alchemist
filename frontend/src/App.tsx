import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Search from './pages/Search';
import ToolDetail from './pages/ToolDetail';
import ToolPage from './pages/ToolPage';
import Admin from './pages/Admin';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<Category />} />
          <Route path="search" element={<Search />} />
          <Route path="tool/:slug" element={<ToolPage />} />
          <Route path="link/:slug" element={<ToolDetail />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
