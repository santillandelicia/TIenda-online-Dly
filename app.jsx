const { useState, useEffect, useRef } = React;

// --- Configuración ---
const WHATSAPP_NUMBER = "5493815693576";
const GITHUB_REPO = "santillandelicia/Tienda-online-Dly";

// --- Helpers ---
const getFinalPrice = (product) => {
    if (product.discount > 0) {
        return product.price - (product.price * (product.discount / 100));
    }
    return product.price;
};

// --- Componentes ---

// ======== NAVBAR ========
const Navbar = ({ onNavigate, cartCount, onCartOpen }) => (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
                <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('/')}>
                    <h1 className="text-3xl font-bold tracking-tight text-dark">
                        D'ly<span
                            onClick={(e) => { e.stopPropagation(); onNavigate('/admin'); }}
                            className="text-primary cursor-default select-none"
                        >.</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-3">
                    {/* Carrito */}
                    <button
                        onClick={onCartOpen}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Abrir carrito"
                    >
                        <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-secondary text-dark text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    {/* Contacto */}
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="bg-primary text-dark px-6 py-2 rounded-full font-medium hover:bg-[#c9dbce] transition-all transform hover:scale-105 active:scale-95 shadow-sm">
                        Contacto
                    </a>
                </div>
            </div>
        </div>
    </nav>
);

// ======== CART DRAWER ========
const CartDrawer = ({ isOpen, onClose, cart, onUpdateQty, onRemove }) => {
    const total = cart.reduce((sum, item) => sum + getFinalPrice(item.product) * item.quantity, 0);

    const handleWhatsApp = () => {
        let message = "¡Hola! Me gustaría realizar el siguiente pedido:\n\n";
        cart.forEach((item, i) => {
            const price = getFinalPrice(item.product);
            message += `${i + 1}. ${item.product.name} x${item.quantity} — $${(price * item.quantity).toLocaleString('es-AR')}\n`;
        });
        message += `\n💰 Total: $${total.toLocaleString('es-AR')}`;
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Mi Carrito
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto text-dark/15 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            <p className="text-dark/50 font-medium">Tu carrito está vacío</p>
                            <p className="text-dark/30 text-sm mt-1">Explorá nuestro catálogo y agregá productos</p>
                        </div>
                    ) : (
                        cart.map(item => {
                            const price = getFinalPrice(item.product);
                            return (
                                <div key={item.product.id} className="flex gap-4 bg-gray-50 rounded-2xl p-4">
                                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover bg-gray-200 flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-semibold text-dark text-sm truncate">{item.product.name}</h4>
                                        {item.product.brand && <p className="text-xs text-dark/50">{item.product.brand}</p>}
                                        <p className="text-sm font-bold text-dark mt-1">${price.toLocaleString('es-AR')}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={() => onUpdateQty(item.product.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-dark hover:bg-gray-100 transition-colors font-bold text-sm">−</button>
                                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => onUpdateQty(item.product.id, 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-dark hover:bg-gray-100 transition-colors font-bold text-sm">+</button>
                                            <button onClick={() => onRemove(item.product.id)} className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <p className="text-sm font-bold text-dark">${(price * item.quantity).toLocaleString('es-AR')}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
                        <div className="flex justify-between items-center">
                            <span className="text-dark/70 font-medium">Total</span>
                            <span className="text-2xl font-bold text-dark">${total.toLocaleString('es-AR')}</span>
                        </div>
                        <button
                            onClick={handleWhatsApp}
                            className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl font-bold text-base hover:bg-[#1fb855] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.624-1.467A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.193-.586-5.934-1.608l-.425-.254-2.741.87.878-2.677-.278-.442A9.776 9.776 0 012.182 12c0-5.413 4.405-9.818 9.818-9.818S21.818 6.587 21.818 12s-4.405 9.818-9.818 9.818z" /></svg>
                            Ir a WhatsApp
                        </button>
                        <p className="text-xs text-dark/50 text-center leading-relaxed">
                            📍 La compra se coordina con la vendedora.<br />
                            Los productos se retiran en el local.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

// ======== PRODUCT CARD (Catálogo - sin descripción) ========
const ProductCard = ({ product, onNavigate, onAddToCart, isFavorite, onToggleFavorite }) => {
    const isOutOfStock = product.stock <= 0;
    const finalPrice = getFinalPrice(product);

    return (
        <div className={`group bg-white rounded-3xl overflow-hidden shadow-soft ${isOutOfStock ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-lg transition-all duration-300'} flex flex-col h-full border border-gray-50 relative`}>
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.discount > 0 && (
                    <span className="bg-secondary text-dark px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        -{product.discount}% OFF
                    </span>
                )}
                {isOutOfStock && (
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Sin Stock
                    </span>
                )}
            </div>

            {/* Favorite heart */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                aria-label="Favorito"
            >
                {isFavorite ? (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                ) : (
                    <svg className="w-5 h-5 text-dark/30 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                )}
            </button>

            {/* Image — clickable */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onNavigate(`/producto/${product.id}`)}>
                <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center ${!isOutOfStock && 'group-hover:scale-105 transition-transform duration-500'}`}
                    loading="lazy"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-dark shadow-sm">
                    {product.category}
                </div>
            </div>

            {/* Info — sin descripción */}
            <div className="p-6 flex flex-col flex-grow">
                {product.brand && <span className="text-xs font-bold tracking-wider text-dark/50 uppercase mb-1">{product.brand}</span>}
                <h3 className="text-lg font-semibold mb-1 leading-tight cursor-pointer hover:text-dark/70 transition-colors" onClick={() => onNavigate(`/producto/${product.id}`)}>{product.name}</h3>

                <div className="flex flex-col mt-auto pt-4 border-t border-gray-100 gap-3">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            {product.discount > 0 && (
                                <span className="text-sm text-dark/50 line-through decoration-red-400">
                                    ${Number(product.price).toLocaleString('es-AR')}
                                </span>
                            )}
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dark to-dark/80">
                                ${finalPrice.toLocaleString('es-AR')}
                            </span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); if (!isOutOfStock) onAddToCart(product); }}
                            disabled={isOutOfStock}
                            className={`${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-secondary text-dark hover:bg-[#fccece] hover:-translate-y-1 active:translate-y-0'} px-4 py-2.5 rounded-full font-medium transition-all transform shadow-sm flex items-center gap-2 text-sm`}
                        >
                            {isOutOfStock ? (
                                <span>Agotado</span>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    <span>Agregar</span>
                                </>
                            )}
                        </button>
                    </div>
                    {!isOutOfStock && product.stock <= 5 && (
                        <div className="text-xs text-orange-600 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ¡Últimas {product.stock} unidades!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ======== PRODUCT DETAIL PAGE ========
const ProductDetail = ({ product, onNavigate, onAddToCart, isFavorite, onToggleFavorite }) => {
    const [addedFeedback, setAddedFeedback] = useState(false);

    if (!product) {
        return (
            <div className="flex-grow flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-xl text-dark/60 font-medium mb-4">Producto no encontrado</p>
                    <button onClick={() => onNavigate('/')} className="text-primary hover:text-dark underline transition-colors">Volver al catálogo</button>
                </div>
            </div>
        );
    }

    const isOutOfStock = product.stock <= 0;
    const finalPrice = getFinalPrice(product);

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        onAddToCart(product);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
    };

    return (
        <main className="flex-grow">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back button */}
                <button
                    onClick={() => onNavigate('/')}
                    className="flex items-center gap-2 text-dark/60 hover:text-dark mb-8 font-medium transition-colors group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver al catálogo
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="relative rounded-3xl overflow-hidden bg-gray-50 aspect-square">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Badges */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                            {product.discount > 0 && (
                                <span className="bg-secondary text-dark px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                    -{product.discount}% OFF
                                </span>
                            )}
                            {isOutOfStock && (
                                <span className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                    Sin Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-primary/30 text-dark px-3 py-1 rounded-full text-xs font-medium">{product.category}</span>
                            {product.brand && <span className="text-xs font-bold tracking-wider text-dark/50 uppercase">{product.brand}</span>}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6 leading-tight">{product.name}</h1>

                        {/* Description */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                            <h3 className="text-sm font-bold text-dark/50 uppercase tracking-wider mb-3">Descripción</h3>
                            <p className="text-dark/80 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            {product.discount > 0 && (
                                <span className="text-lg text-dark/40 line-through decoration-red-400 mr-3">
                                    ${Number(product.price).toLocaleString('es-AR')}
                                </span>
                            )}
                            <span className="text-4xl font-bold text-dark">
                                ${finalPrice.toLocaleString('es-AR')}
                            </span>
                        </div>

                        {/* Stock */}
                        {!isOutOfStock && product.stock <= 5 && (
                            <div className="text-sm text-orange-600 font-medium flex items-center gap-2 mb-6 bg-orange-50 px-4 py-2 rounded-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ¡Últimas {product.stock} unidades disponibles!
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-grow ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : addedFeedback ? 'bg-green-500 text-white' : 'bg-dark text-white hover:bg-[#3d493a]'} px-8 py-4 rounded-2xl font-bold text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-3`}
                            >
                                {isOutOfStock ? (
                                    'Agotado'
                                ) : addedFeedback ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        ¡Agregado!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        Agregar al carrito
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => onToggleFavorite(product.id)}
                                className={`px-6 py-4 rounded-2xl font-bold text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 border-2 ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-dark/60 hover:border-red-200 hover:text-red-400'}`}
                            >
                                {isFavorite ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                )}
                                <span className="hidden sm:inline">{isFavorite ? 'En favoritos' : 'Favorito'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// ======== STOREFRONT ========
const StoreFront = ({ products, loading, onNavigate, onAddToCart, favorites, onToggleFavorite }) => {
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [selectedBrand, setSelectedBrand] = useState("Todas");
    const [maxPrice, setMaxPrice] = useState(100000);

    const categories = ["Todas", ...new Set(products.map(p => p.category).filter(Boolean))];
    const brands = ["Todas", ...new Set(products.map(p => p.brand).filter(Boolean))];

    useEffect(() => {
        if (products.length > 0) {
            const max = Math.max(...products.map(p => getFinalPrice(p)));
            setMaxPrice(Math.ceil(max));
        }
    }, [products]);

    const filteredProducts = products.filter(p => {
        const pFinalPrice = getFinalPrice(p);
        const passCategory = selectedCategory === "Todas" || p.category === selectedCategory;
        const passBrand = selectedBrand === "Todas" || p.brand === selectedBrand;
        const passPrice = pFinalPrice <= maxPrice;
        return passCategory && passBrand && passPrice;
    });

    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <div className="bg-primary/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615397323608-2cb2d0f507ed?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Tu piel, <br className="md:hidden" />más radiante.</h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-dark/80 font-light leading-relaxed">
                        Descubre nuestra selección de dermocosmética diseñada para realzar tu belleza natural con ingredientes clínicamente probados.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Advanced Filters Area */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-2">Categoría</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl focus:ring-primary focus:border-primary block p-2.5 transition-colors focus:outline-none">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-2">Marca</label>
                        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-dark text-sm rounded-xl focus:ring-primary focus:border-primary block p-2.5 transition-colors focus:outline-none">
                            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-center">
                        <label className="block text-xs font-bold text-dark/50 uppercase tracking-wider mb-2 flex justify-between">
                            Precio Máximo <span>${maxPrice.toLocaleString('es-AR')}</span>
                        </label>
                        <input type="range" min="0" max="100000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dark" />
                    </div>
                </div>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${selectedCategory === cat ? 'bg-dark text-white shadow-sm transform scale-105' : 'bg-white text-dark/70 hover:bg-gray-50 border border-gray-100 shadow-sm'}`}>
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
                            <ProductCard
                                key={product.id}
                                product={product}
                                onNavigate={onNavigate}
                                onAddToCart={onAddToCart}
                                isFavorite={favorites.includes(product.id)}
                                onToggleFavorite={onToggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-dark/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xl text-dark/60 font-medium">No se encontraron productos con estos filtros.</p>
                        <button onClick={() => { setSelectedCategory("Todas"); setSelectedBrand("Todas"); setMaxPrice(100000); }} className="mt-4 text-primary hover:text-dark underline transition-colors">Limpiar filtros</button>
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
    const [editingProduct, setEditingProduct] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

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
            id: editingProduct.id || Date.now(),
            name: formData.get('name'),
            description: formData.get('description'),
            price: Number(formData.get('price')),
            discount: Number(formData.get('discount')),
            category: formData.get('category'),
            brand: formData.get('brand'),
            stock: Number(formData.get('stock')),
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
                        <button onClick={() => setEditingProduct({})} className="bg-primary text-dark px-4 py-2 rounded-xl font-medium hover:bg-[#c9dbce] transition-colors text-sm flex items-center gap-2">
                            <span>+ Nuevo Producto</span>
                        </button>
                        <button onClick={handleSaveToGithub} disabled={loading} className="bg-dark text-white px-4 py-2 rounded-xl font-medium hover:bg-[#3d493a] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            {loading ? 'Guardando...' : 'Guardar en GitHub'}
                        </button>
                        <button onClick={handleLogout} className="bg-secondary text-dark px-4 py-2 rounded-xl font-medium hover:bg-[#fccece] transition-colors text-sm">
                            Salir
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                {statusMessage.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium ${statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {statusMessage.text}
                    </div>
                )}

                {/* Product Form */}
                {editingProduct && (
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative">
                        <h3 className="text-xl font-bold mb-4">{editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Nombre</label>
                                <input name="name" defaultValue={editingProduct.name} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Marca</label>
                                <input name="brand" defaultValue={editingProduct.brand} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Opcional" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Categoría</label>
                                <input name="category" defaultValue={editingProduct.category} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ej: Limpieza, Hidratación..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Stock</label>
                                <input name="stock" type="number" defaultValue={editingProduct.stock || 0} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Precio Regular ($)</label>
                                <input name="price" type="number" defaultValue={editingProduct.price} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-dark/80">Descuento (%)</label>
                                <input name="discount" type="number" defaultValue={editingProduct.discount || 0} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
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
                                    <th className="px-6 py-4">Categoría / Marca</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Precio (Dcto)</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading && products.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-dark/50">Cargando catálogo...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-dark/50">No hay productos.</td></tr>
                                ) : products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-dark flex items-center gap-3">
                                            <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            <span className="truncate max-w-[200px]">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{product.category}</div>
                                            <div className="text-xs text-dark/50">{product.brand || 'Sin marca'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>{product.stock} un.</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            ${product.price.toLocaleString('es-AR')}
                                            {product.discount > 0 && <span className="ml-2 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">-{product.discount}%</span>}
                                        </td>
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

    // Cart state
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('dly_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [cartOpen, setCartOpen] = useState(false);

    // Favorites state
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('dly_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // Persist cart
    useEffect(() => {
        localStorage.setItem('dly_cart', JSON.stringify(cart));
    }, [cart]);

    // Persist favorites
    useEffect(() => {
        localStorage.setItem('dly_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        const handleHashChange = () => setCurrentRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('./productos.json?t=' + new Date().getTime());
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

    // Cart actions
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateCartQty = (productId, delta) => {
        setCart(prev =>
            prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Favorites actions
    const toggleFavorite = (productId) => {
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Routing: detect product detail page
    const productMatch = currentRoute.match(/^#\/producto\/(\d+)$/);
    const currentProduct = productMatch ? products.find(p => p.id === Number(productMatch[1])) : null;

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar onNavigate={handleNavigate} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                onUpdateQty={updateCartQty}
                onRemove={removeFromCart}
            />

            {currentRoute === '#/' && (
                <StoreFront
                    products={products}
                    loading={loading}
                    onNavigate={handleNavigate}
                    onAddToCart={addToCart}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                />
            )}
            {productMatch && (
                <ProductDetail
                    product={currentProduct}
                    onNavigate={handleNavigate}
                    onAddToCart={addToCart}
                    isFavorite={currentProduct ? favorites.includes(currentProduct.id) : false}
                    onToggleFavorite={toggleFavorite}
                />
            )}
            {currentRoute === '#/admin' && <AdminDashboard onLogout={() => handleNavigate('/')} />}

            <Footer />
        </div>
    );
};

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
