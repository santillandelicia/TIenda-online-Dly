const { useState, useEffect } = React;

// --- Configuración ---
const WHATSAPP_NUMBER = "5493815693576"; // Número sin '+' ni espacios
// Repositorio donde están los productos. Formato: usuario/repo
// TODO: El usuario necesita actualizar esto con su repo real
const GITHUB_REPO = "usuario/dermocosmetica-app";

// --- Componentes ---

const Navbar = ({ onNavigate }) => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
                    <h1 className="text-3xl font-bold tracking-tight text-dark">D'ly.</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => onNavigate('/admin')}
                        className="text-sm font-medium text-dark hover:text-secondary transition-colors"
                    >
                        Admin
                    </button>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="bg-primary text-dark px-6 py-2 rounded-full font-medium hover:bg-[#c9dbce] transition-all transform hover:scale-105 active:scale-95 shadow-sm">
                        Contacto
                    </a>
                </div>
            </div>
        </div>
    </nav>
);

const Footer = () => (
    <footer className="bg-primary mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-80">
            <p className="text-dark font-medium">&copy; {new Date().getFullYear()} D'ly Dermocosmética. Todos los derechos reservados.</p>
            <div className="mt-4 md:mt-0 space-x-4 text-sm">
                <a href="#" className="hover:text-secondary transition-colors">Instagram</a>
                <a href="#" className="hover:text-secondary transition-colors">Términos</a>
            </div>
        </div>
    </footer>
);

const ProductCard = ({ product }) => {
    const handleBuy = () => {
        const message = `Hola! Me gustaría comprar el producto: ${product.name} ($${product.price})`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-50">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-dark shadow-sm">
                    {product.category}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 leading-tight">{product.name}</h3>
                <p className="text-dark/70 text-sm flex-grow mb-4 leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dark to-dark/80">
                        ${product.price.toLocaleString('es-AR')}
                    </span>
                    <button
                        onClick={handleBuy}
                        className="bg-secondary text-dark px-5 py-2.5 rounded-full font-medium hover:bg-[#fccece] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-sm flex items-center gap-2"
                    >
                        <span>Comprar</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const StoreFront = ({ products, loading }) => {
    const [selectedCategory, setSelectedCategory] = useState("Todas");

    // Extraer categorías únicas
    const categories = ["Todas", ...new Set(products.map(p => p.category))];

    // Filtrar productos
    const filteredProducts = selectedCategory === "Todas"
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <div className="bg-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615397323608-2cb2d0f507ed?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary text-dark text-xs font-bold tracking-wider uppercase mb-6 animate-pulse">Nueva Colección</span>
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Tu piel, <br className="md:hidden" />más radiante.</h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-dark/80 font-light leading-relaxed">
                        Descubre nuestra selección de dermocosmética diseñada para realzar tu belleza natural con ingredientes clínicamente probados.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Filers */}
                <div className="flex flex-wrap gap-3 justify-center mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-dark text-white shadow-md transform scale-105'
                                    : 'bg-white text-dark hover:bg-primary/50 border border-transparent shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-dark/60">
                        <p className="text-xl">No se encontraron productos en esta categoría.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

// --- Panel de Admin ---

const AdminDashboard = ({ onLogout }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gitSha, setGitSha] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null); // null = no editing, {} = new, {...} = edit
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(!!window.githubDB.getToken());
    const [tokenInput, setTokenInput] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            loadProductsFromGithub();
        }
    }, [isAuthenticated]);

    const loadProductsFromGithub = async () => {
        setLoading(true);
        setStatusMessage({ text: 'Cargando datos desde GitHub...', type: 'info' });
        try {
            const data = await window.githubDB.getFile();
            setProducts(data.content || []);
            setGitSha(data.sha);
            setStatusMessage({ text: '', type: '' });
        } catch (error) {
            console.error(error);
            setStatusMessage({ text: 'Error al cargar datos. Verifica el token y repositorio.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        window.githubDB.setToken(tokenInput);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        window.githubDB.clearToken();
        setIsAuthenticated(false);
        onLogout();
    };

    const handleSaveToGithub = async () => {
        setLoading(true);
        setStatusMessage({ text: 'Guardando cambios en GitHub...', type: 'info' });
        try {
            const newSha = await window.githubDB.updateFile(products, gitSha);
            setGitSha(newSha);
            setStatusMessage({ text: '¡Cambios guardados con éxito!', type: 'success' });
            setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error(error);
            setStatusMessage({ text: 'Error al guardar. ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== id));
            setStatusMessage({ text: 'Producto eliminado localmente. Recuerda Guardar en GitHub.', type: 'info' });
        }
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            id: editingProduct.id || Date.now(), // Generate ID for new
            name: formData.get('name'),
            description: formData.get('description'),
            price: Number(formData.get('price')),
            category: formData.get('category'),
            image: formData.get('image')
        };

        if (editingProduct.id) {
            setProducts(products.map(p => p.id === productData.id ? productData : p));
        } else {
            setProducts([...products, productData]);
        }

        setEditingProduct(null);
        setStatusMessage({ text: 'Cambio aplicado localmente. Recuerda Guardar en GitHub.', type: 'info' });
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 py-20 px-4">
                <div className="bg-white p-8 rounded-3xl shadow-soft max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-6 text-dark text-center">Acceso Admin</h2>
                    <p className="text-dark/70 mb-6 text-center text-sm">
                        Ingresa tu Personal Access Token (PAT) de GitHub para gestionar el catálogo.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark/80 mb-1">GitHub Token</label>
                            <input
                                type="password"
                                required
                                value={tokenInput}
                                onChange={(e) => setTokenInput(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="ghp_..."
                            />
                        </div>
                        <button type="submit" className="w-full bg-dark text-white py-2.5 rounded-xl font-medium hover:bg-[#3d493a] transition-colors">
                            Ingresar
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={onLogout} className="text-sm text-dark/60 hover:text-dark transition-colors">Volver a la tienda</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-gray-50 py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Admin */}
                <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-dark">Panel de Control</h2>
                        <p className="text-sm text-dark/60">Gestiona tus productos directamente en GitHub</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditingProduct({})}
                            className="bg-primary text-dark px-4 py-2 rounded-xl font-medium hover:bg-[#c9dbce] transition-colors text-sm flex items-center gap-2"
                        >
                            <span>+ Nuevo Producto</span>
                        </button>
                        <button
                            onClick={handleSaveToGithub}
                            disabled={loading}
                            className="bg-dark text-white px-4 py-2 rounded-xl font-medium hover:bg-[#3d493a] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? 'Guardando...' : 'Guardar en GitHub'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-secondary text-dark px-4 py-2 rounded-xl font-medium hover:bg-[#fccece] transition-colors text-sm"
                        >
                            Salir
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                {statusMessage.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${statusMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                            statusMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {statusMessage.text}
                    </div>
                )}

                {/* Product Form Modal (Simplified inline for now) */}
                {editingProduct && (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
                        <h3 className="text-xl font-bold mb-4">{editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Nombre</label>
                                <input name="name" defaultValue={editingProduct.name} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Categoría</label>
                                <input name="category" defaultValue={editingProduct.category} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ej: Limpieza, Hidratación..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Precio ($)</label>
                                <input name="price" type="number" defaultValue={editingProduct.price} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">URL Imagen</label>
                                <input name="image" type="url" defaultValue={editingProduct.image} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="https://..." />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-dark/80">Descripción</label>
                                <textarea name="description" defaultValue={editingProduct.description} required rows="2" className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl text-dark/60 hover:bg-gray-100 font-medium text-sm transition-colors">Cancelar</button>
                                <button type="submit" className="px-4 py-2 rounded-xl bg-dark text-white font-medium text-sm hover:bg-[#3d493a] transition-colors">Guardar Producto Localmente</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Product List */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-dark/80">
                            <thead className="bg-primary/20 text-xs uppercase text-dark font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4">Precio</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading && products.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-dark/50">Cargando catálogo...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-8 text-center text-dark/50">No hay productos.</td></tr>
                                ) : products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-dark flex items-center gap-3">
                                            <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            <span className="truncate max-w-[200px]">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4 font-medium">${product.price.toLocaleString('es-AR')}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Editar</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- App Principal ---

const App = () => {
    const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple routing listeners
        const handleHashChange = () => setCurrentRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        // Fetch inicial de productos
        const fetchProducts = async () => {
            try {
                // Para GitHub Pages o dev local, lee del JSON local como fuente de verdad inicial si no usa API (simplificado de momento)
                // Idealmente en prod configuraremos que lea directo desde la API de github para ver los cambios recientes sin cache agresivo.

                // Intento primero leer el archivo local:
                const response = await fetch('./productos.json?t=' + new Date().getTime()); // Evitar caché local
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error("Error al cargar productos locales.");
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleNavigate = (path) => {
        window.location.hash = '#' + path;
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar onNavigate={handleNavigate} />

            {currentRoute === '#/' && <StoreFront products={products} loading={loading} />}
            {currentRoute === '#/admin' && <AdminDashboard onLogout={() => handleNavigate('/')} />}

            <Footer />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
