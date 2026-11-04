import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, REVIEWS, FAQ_ITEMS } from './data/products.js';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Search,
  Eye,
  Star,
  X,
  Trash2,
  Lock,
  Check,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Feather,
  Gift,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  INR: { symbol: "₹", rate: 84.5 }
};

export default function App() {
  const [currency, setCurrency] = useState("USD");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [toast, setToast] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const formatPrice = (amount) => {
    const { symbol, rate } = CURRENCIES[currency];
    const converted = (amount * rate).toFixed(amount * rate % 1 === 0 ? 0 : 2);
    return `${symbol}${converted}`;
  };

  const addToCart = (product, quantity = 1, shade = null) => {
    setCart(prev => {
      const itemKey = `${product.id}-${shade?.name || 'default'}`;
      const existing = prev.find(item => item.key === itemKey);
      if (existing) {
        return prev.map(item =>
          item.key === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, key: itemKey, selectedShade: shade, quantity }];
    });
    showToast(`✨ Added "${product.name}" to your bag`);
  };

  const updateCartQty = (key, delta) => {
    setCart(prev => prev.map(item => {
      if (item.key === key) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(item => item.key !== key));
    showToast("Item removed from your bag", "info");
  };

  const toggleWishlist = (product) => {
    if (wishlist.some(p => p.id === product.id)) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      showToast(`Removed from your Wishlist`, "info");
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`💖 Saved to your Wishlist`);
    }
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = subtotal * appliedDiscount;
  const freeShippingThreshold = 50.0;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 8.5;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C07B', '#D87A68', '#FFFFFF']
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const handleApplyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "GLOW20") {
      setAppliedDiscount(0.20);
      showToast("🎉 Promo GLOW20 applied! 20% OFF your order");
      triggerCelebration();
    } else if (clean === "LUMEA10") {
      setAppliedDiscount(0.10);
      showToast("🎉 Promo LUMEA10 applied! 10% OFF");
    } else {
      showToast("Invalid code. Try 'GLOW20' for 20% off!", "error");
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-gold-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#121110] text-[#E5C07B] text-xs py-2 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 inline animate-pulse" />
        <span>COMPLIMENTARY EXPRESS WORLDWIDE DELIVERY ON ORDERS OVER $50</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">USE CODE <strong className="text-white underline">GLOW20</strong> FOR 20% OFF</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Currency Selector & Quiz Pill */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <button className="flex items-center text-xs font-semibold tracking-wider text-stone-600 hover:text-gold-600 uppercase border border-stone-300 rounded-full px-2.5 py-1">
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
                <div className="absolute left-0 mt-1 w-24 bg-white rounded-lg shadow-xl border border-stone-100 py-1 hidden group-hover:block z-50">
                  {Object.keys(CURRENCIES).map(curr => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex justify-between hover:bg-gold-50 ${currency === curr ? 'font-bold text-gold-600' : 'text-stone-700'}`}
                    >
                      <span>{curr}</span>
                      <span>{CURRENCIES[curr].symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="hidden lg:flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Skin Routine Quiz</span>
              </button>
            </div>

            {/* Brand Logo */}
            <div className="text-center cursor-pointer" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
              <span className="block font-serif text-2xl sm:text-3xl tracking-[0.25em] font-bold text-stone-900">
                LUMÉA
              </span>
              <span className="block text-[9px] tracking-[0.4em] uppercase text-gold-600 font-semibold -mt-1">
                PARIS • BOTANIQUE
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search serums, lipsticks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 pl-9 pr-4 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-stone-400">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-stone-700 hover:text-rose-500 transition rounded-full hover:bg-stone-100"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-[#121110] hover:bg-black text-white px-3.5 py-2 rounded-full text-xs font-semibold tracking-wider transition shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-gold-400" />
                <span className="hidden sm:inline">BAG</span>
                <span className="bg-gold-500 text-stone-900 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </button>
            </div>
          </div>

          {/* Categories Nav */}
          <div className="flex items-center justify-center space-x-6 py-2.5 border-t border-stone-100 text-xs tracking-wider uppercase font-medium overflow-x-auto no-scrollbar">
            {["All", "Skincare", "Makeup", "Fragrance", "Bath & Body"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap pb-1 transition-all ${
                  activeCategory === cat ? "text-gold-600 font-bold border-b-2 border-gold-500" : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-gold-500/40">
          <CheckCircle2 className="w-5 h-5 text-gold-400" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EA] to-[#FDFBF7] py-16 lg:py-24 border-b border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/15 border border-gold-500/30 text-gold-700 text-xs font-semibold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  <span>2026 Parisian Beauty Excellence Laureate</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.15] font-normal">
                  The Poetry of <br />
                  <span className="italic font-serif font-light text-gold-700">Luminous Botanicals</span> & 24K Gold.
                </h1>

                <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Handcrafted in Grasse and Paris. We blend rare organic Alpine floras with clinically proven biotechnical actives to reveal your most youthful, celestial radiance.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="#collection"
                    className="bg-[#121110] hover:bg-stone-800 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 text-gold-400" />
                  </a>
                  <button
                    onClick={() => setIsQuizOpen(true)}
                    className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 px-6 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <span>Find Your Routine</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                    alt="Luméa Luxury Cosmetics"
                    className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider">Featured Elixir</span>
                      <h4 className="font-serif text-sm font-bold text-stone-900">L'Élixir Céleste 24K Serum</h4>
                      <div className="text-xs text-stone-600 font-semibold">{formatPrice(68.0)}</div>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(PRODUCTS[0])}
                      className="bg-[#121110] hover:bg-gold-600 text-white p-2.5 rounded-full transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section id="collection" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">Curated Formulation</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">The Luméa Haute Collection</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 font-medium"
                >
                  <option value="featured">Featured & Curated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full font-medium">
                {filteredProducts.length} Products
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const isWishlisted = wishlist.some(w => w.id === product.id);
              return (
                <div key={product.id} className="shimmer-card bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col group relative">
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.badge && (
                        <span className="bg-[#121110]/90 text-gold-400 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md text-stone-600 hover:text-rose-500 transition"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <div className="absolute inset-x-0 bottom-3 px-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-white/95 text-stone-900 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                        <span className="uppercase tracking-widest font-semibold text-[10px] text-gold-600">{product.category}</span>
                        <div className="flex items-center text-amber-500 font-semibold text-[11px]">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <h3 onClick={() => setSelectedProduct(product)} className="font-serif text-base font-bold text-stone-900 group-hover:text-gold-600 transition cursor-pointer line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-2 mt-1">{product.subtitle}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold text-stone-900">{formatPrice(product.price)}</div>
                        {product.originalPrice > product.price && (
                          <div className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</div>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product, 1, product.shades ? product.shades[0] : null)}
                        className="bg-stone-900 hover:bg-gold-600 text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-600" />
                  <h3 className="font-serif text-lg font-bold text-stone-900">Your Shopping Bag</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-stone-400">Your bag is empty.</div>
                ) : (
                  cart.map(item => (
                    <div key={item.key} className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.key)} className="text-stone-400 hover:text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded bg-white">
                            <button onClick={() => updateCartQty(item.key, -1)} className="px-2 text-xs">-</button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.key, 1)} className="px-2 text-xs">+</button>
                          </div>
                          <span className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (GLOW20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-grow px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg uppercase"
                    />
                    <button onClick={() => handleApplyPromo(promoCode)} className="bg-stone-800 text-white px-4 py-2 text-xs font-bold rounded-lg uppercase">
                      Apply
                    </button>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-gold-700">{formatPrice(finalTotal)}</span>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full bg-[#121110] hover:bg-black text-white py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-gold-400" />
                    <span>Checkout • {formatPrice(finalTotal)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl z-10 border border-stone-200">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-stone-400">
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full aspect-square object-cover rounded-xl" />
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">{selectedProduct.category}</span>
                <h3 className="font-serif text-2xl font-bold">{selectedProduct.name}</h3>
                <div className="text-xl font-bold text-stone-900">{formatPrice(selectedProduct.price)}</div>
                <p className="text-xs text-stone-600 leading-relaxed">{selectedProduct.description}</p>
                <button
                  onClick={() => { addToCart(selectedProduct, 1); setSelectedProduct(null); }}
                  className="w-full bg-[#121110] text-white py-3 rounded-full text-xs font-bold tracking-widest uppercase"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl z-10 border">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-stone-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-bold mb-4">Complete Your Order</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              setIsCheckoutOpen(false);
              setCart([]);
              setOrderSuccess({ id: "LUM-" + Math.floor(100000 + Math.random() * 900000), total: formatPrice(finalTotal) });
              triggerCelebration();
            }} className="space-y-4 text-xs">
              <input type="text" required placeholder="Full Name" className="w-full p-2.5 bg-stone-50 border rounded-lg" />
              <input type="text" required placeholder="Shipping Address" className="w-full p-2.5 bg-stone-50 border rounded-lg" />
              <input type="text" required placeholder="Card Number (4000 1234 5678 9010)" className="w-full p-2.5 bg-stone-50 border rounded-lg" />
              <button type="submit" className="w-full bg-[#121110] text-white py-3.5 rounded-full text-xs font-bold tracking-widest uppercase">
                Pay {formatPrice(finalTotal)}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70"></div>
          <div className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl z-10 text-center space-y-4 border border-gold-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">Merci for Choosing Luméa!</h3>
            <p className="text-xs text-stone-600">Order ID: <strong className="font-mono">{orderSuccess.id}</strong></p>
            <button onClick={() => setOrderSuccess(null)} className="w-full bg-[#121110] text-white py-3 rounded-full text-xs font-bold uppercase">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

