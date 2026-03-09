"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Package, Search, Plus, Minus, AlertTriangle, TrendingUp, 
  TrendingDown, BarChart3, Box, Truck, QrCode, Bell, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Filter,
  Warehouse, ShoppingCart, Clock, CheckCircle2, XCircle,
  Sparkles, Zap, Shield, Globe
} from "lucide-react"

// Demo product data
const DEMO_PRODUCTS = [
  { id: "SKU-001", name: "iPhone 15 Pro Max", category: "Electronics", stock: 23, minStock: 10, price: 1199, image: "📱", supplier: "Apple Inc.", location: "Warehouse A" },
  { id: "SKU-002", name: "MacBook Pro 14\"", category: "Electronics", stock: 8, minStock: 15, price: 1999, image: "💻", supplier: "Apple Inc.", location: "Warehouse A" },
  { id: "SKU-003", name: "AirPods Pro 2", category: "Electronics", stock: 45, minStock: 20, price: 249, image: "🎧", supplier: "Apple Inc.", location: "Warehouse B" },
  { id: "SKU-004", name: "Samsung 65\" OLED TV", category: "Electronics", stock: 3, minStock: 5, price: 2499, image: "📺", supplier: "Samsung", location: "Warehouse C" },
  { id: "SKU-005", name: "Nike Air Max 90", category: "Footwear", stock: 67, minStock: 30, price: 130, image: "👟", supplier: "Nike Direct", location: "Warehouse B" },
  { id: "SKU-006", name: "Levi's 501 Jeans", category: "Apparel", stock: 12, minStock: 25, price: 89, image: "👖", supplier: "Levi's", location: "Warehouse A" },
  { id: "SKU-007", name: "Sony WH-1000XM5", category: "Electronics", stock: 31, minStock: 15, price: 399, image: "🎵", supplier: "Sony Corp.", location: "Warehouse A" },
  { id: "SKU-008", name: "Dyson V15 Vacuum", category: "Home", stock: 5, minStock: 8, price: 749, image: "🧹", supplier: "Dyson", location: "Warehouse C" },
]

const DEMO_MOVEMENTS = [
  { id: 1, type: "in", product: "iPhone 15 Pro Max", quantity: 50, time: "2 min ago", user: "John D." },
  { id: 2, type: "out", product: "MacBook Pro 14\"", quantity: 3, time: "15 min ago", user: "Sarah M." },
  { id: 3, type: "out", product: "AirPods Pro 2", quantity: 12, time: "1 hr ago", user: "Mike R." },
  { id: 4, type: "in", product: "Nike Air Max 90", quantity: 100, time: "2 hrs ago", user: "John D." },
  { id: 5, type: "out", product: "Samsung 65\" OLED TV", quantity: 2, time: "3 hrs ago", user: "Lisa K." },
]

interface InventoryDemoProps {
  hasAccess: boolean
  onRequestAccess: () => void
}

export function InventoryDemo({ hasAccess, onRequestAccess }: InventoryDemoProps) {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [movements, setMovements] = useState(DEMO_MOVEMENTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof DEMO_PRODUCTS[0] | null>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  // Animated counters
  const [displayedTotalValue, setDisplayedTotalValue] = useState(0)
  const [displayedTotalItems, setDisplayedTotalItems] = useState(0)
  
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0)
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length
  const categories = ["All", ...new Set(products.map(p => p.category))]

  // Animate counters on mount
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const valueStep = totalValue / steps
    const itemsStep = totalItems / steps
    let current = 0
    
    const timer = setInterval(() => {
      current++
      setDisplayedTotalValue(Math.min(Math.round(valueStep * current), totalValue))
      setDisplayedTotalItems(Math.min(Math.round(itemsStep * current), totalItems))
      if (current >= steps) clearInterval(timer)
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [totalValue, totalItems])

  // Simulate real-time updates
  useEffect(() => {
    if (!hasAccess) return
    
    const interval = setInterval(() => {
      // Random stock movement
      const randomProduct = Math.floor(Math.random() * products.length)
      const isIncoming = Math.random() > 0.5
      const quantity = Math.floor(Math.random() * 5) + 1
      
      setProducts(prev => prev.map((p, i) => {
        if (i === randomProduct) {
          const newStock = isIncoming ? p.stock + quantity : Math.max(0, p.stock - quantity)
          
          // Show notification for low stock
          if (newStock <= p.minStock && p.stock > p.minStock) {
            setNotification(`Low stock alert: ${p.name}`)
            setTimeout(() => setNotification(null), 3000)
          }
          
          return { ...p, stock: newStock }
        }
        return p
      }))
      
      // Add movement to history
      const product = products[randomProduct]
      setMovements(prev => [{
        id: Date.now(),
        type: isIncoming ? "in" : "out",
        product: product.name,
        quantity,
        time: "Just now",
        user: ["John D.", "Sarah M.", "Mike R."][Math.floor(Math.random() * 3)]
      }, ...prev.slice(0, 4)])
    }, 5000)
    
    return () => clearInterval(interval)
  }, [hasAccess, products])

  // Barcode scanner simulation
  const simulateScan = useCallback(() => {
    setShowScanner(true)
    setScanResult(null)
    
    setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setScanResult(randomProduct.id)
      setSelectedProduct(randomProduct)
      
      setTimeout(() => {
        setShowScanner(false)
        setScanResult(null)
      }, 2000)
    }, 1500)
  }, [products])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleQuickAdjust = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ))
    
    const product = products.find(p => p.id === productId)
    if (product) {
      setMovements(prev => [{
        id: Date.now(),
        type: delta > 0 ? "in" : "out",
        product: product.name,
        quantity: Math.abs(delta),
        time: "Just now",
        user: "You"
      }, ...prev.slice(0, 4)])
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Package className="w-4 h-4" />
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            Enterprise Inventory System
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Real-time stock tracking, automated alerts, barcode scanning, and powerful analytics.
            <span className="text-primary font-medium"> All included in the PYMES plan.</span>
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-2">
          {[
            { icon: Zap, label: "Real-time Sync" },
            { icon: QrCode, label: "Barcode Scanner" },
            { icon: Bell, label: "Smart Alerts" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Warehouse, label: "Multi-warehouse" },
            { icon: Shield, label: "Audit Trail" },
          ].map((feature, i) => (
            <div 
              key={feature.label}
              className="flex items-center gap-1.5 md:gap-2 rounded-full bg-secondary/50 border border-border/50 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs text-muted-foreground"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
              <span className="hidden sm:inline">{feature.label}</span>
              <span className="sm:hidden">{feature.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {/* Main Dashboard */}
        <div className="relative rounded-xl md:rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden mx-2 md:mx-0">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border/50 px-3 md:px-4 py-2 md:py-3 bg-secondary/30">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs md:text-sm font-medium text-muted-foreground hidden sm:inline">SwatWorks Inventory Pro</span>
              <span className="text-xs font-medium text-muted-foreground sm:hidden">Inventory</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary px-1.5 md:px-2 py-0.5 rounded">24h demo</span>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] md:text-xs text-green-500">Live</span>
            </div>
          </div>

          {/* Notification banner */}
          {notification && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 bg-amber-500/90 text-amber-950 px-4 py-2 rounded-lg shadow-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{notification}</span>
              </div>
            </div>
          )}

          {/* Scanner overlay */}
          {showScanner && (
            <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="absolute inset-0 border-2 border-primary rounded-2xl" />
                  <div className="absolute inset-4 border border-primary/50 rounded-xl" />
                  {!scanResult && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-scan" 
                         style={{ animation: "scan 1.5s ease-in-out infinite" }} />
                  )}
                  {scanResult && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />
                    </div>
                  )}
                </div>
                <p className="text-lg font-medium text-foreground">
                  {scanResult ? `Found: ${scanResult}` : "Scanning..."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {scanResult ? "Product identified!" : "Position barcode in frame"}
                </p>
              </div>
            </div>
          )}

          {/* Quick add modal */}
          {showQuickAdd && selectedProduct && (
            <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Quick Adjustment</h3>
                  <button onClick={() => setShowQuickAdd(false)} className="text-muted-foreground hover:text-foreground">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-visible shrink-0">
                    <span className="text-4xl leading-none">{selectedProduct.image}</span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProduct.id}</p>
                    <p className="text-sm text-primary">Current: {selectedProduct.stock} units</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => { handleQuickAdjust(selectedProduct.id, -10); setShowQuickAdd(false) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    <Minus className="w-4 h-4" /> Remove 10
                  </button>
                  <button 
                    onClick={() => { handleQuickAdjust(selectedProduct.id, 10); setShowQuickAdd(false) }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add 10
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 md:p-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="rounded-lg md:rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-2.5 md:p-4">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Total Value</span>
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                </div>
                <p className="text-lg md:text-2xl font-bold text-foreground">
                  ${displayedTotalValue.toLocaleString()}
                </p>
                <p className="text-[10px] md:text-xs text-green-500 flex items-center gap-1 mt-0.5 md:mt-1">
                  <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3" /> +12.5%
                </p>
              </div>
              
              <div className="rounded-lg md:rounded-xl bg-secondary/50 border border-border/50 p-2.5 md:p-4">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Total Items</span>
                  <Box className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <p className="text-lg md:text-2xl font-bold text-foreground">{displayedTotalItems}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">{products.length} SKUs</p>
              </div>
              
              <div className="rounded-lg md:rounded-xl bg-secondary/50 border border-border/50 p-2.5 md:p-4">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Low Stock</span>
                  <AlertTriangle className={`w-3 h-3 md:w-4 md:h-4 ${lowStockCount > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
                </div>
                <p className={`text-lg md:text-2xl font-bold ${lowStockCount > 0 ? "text-amber-500" : "text-foreground"}`}>
                  {lowStockCount}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">Reorder</p>
              </div>
              
              <div className="rounded-lg md:rounded-xl bg-secondary/50 border border-border/50 p-2.5 md:p-4">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-xs text-muted-foreground">Movements</span>
                  <Truck className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <p className="text-lg md:text-2xl font-bold text-foreground">{movements.length}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">Today</p>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex gap-1.5 md:gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 md:flex-none px-2 md:px-3 py-2 md:py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-xs md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <button 
                  onClick={simulateScan}
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-medium hover:bg-primary/90 active:scale-95 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Scan</span>
                </button>
                
                <button 
                  onClick={handleRefresh}
                  className={`p-2 md:p-2.5 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground active:scale-95 transition-all ${isRefreshing ? "animate-spin" : ""}`}
                >
                  <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {/* Products table */}
              <div className="md:col-span-2 rounded-lg md:rounded-xl border border-border/50 overflow-hidden">
                <div className="bg-secondary/30 px-3 md:px-4 py-2 border-b border-border/50">
                  <p className="text-xs md:text-sm font-medium text-foreground">Products ({filteredProducts.length})</p>
                </div>
                <div className="divide-y divide-border/50 max-h-[280px] md:max-h-[400px] overflow-y-auto">
                  {filteredProducts.map((product, i) => (
                    <div 
                      key={product.id}
                      className="flex items-center gap-2.5 md:gap-4 px-2.5 md:px-4 py-2.5 md:py-3 hover:bg-secondary/30 active:bg-secondary/50 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedProduct(product); setShowQuickAdd(true) }}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <span className="text-base md:text-xl">{product.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs md:text-sm text-foreground truncate">{product.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">{product.id}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-semibold text-xs md:text-sm ${
                          product.stock <= product.minStock ? "text-amber-500" : "text-foreground"
                        }`}>
                          {product.stock}
                        </p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">${product.price}</p>
                      </div>
                      {product.stock <= product.minStock && (
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="rounded-lg md:rounded-xl border border-border/50 overflow-hidden">
                <div className="bg-secondary/30 px-3 md:px-4 py-2 border-b border-border/50 flex items-center justify-between">
                  <p className="text-xs md:text-sm font-medium text-foreground">Live Activity</p>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] md:text-xs text-green-500">Live</span>
                  </div>
                </div>
                <div className="divide-y divide-border/50 max-h-[200px] md:max-h-[400px] overflow-y-auto">
                  {movements.map((movement, i) => (
                    <div 
                      key={movement.id}
                      className="px-2.5 md:px-4 py-2 md:py-3 animate-in slide-in-from-right duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${
                          movement.type === "in" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {movement.type === "in" ? <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs md:text-sm text-foreground truncate">{movement.product}</p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {movement.type === "in" ? "+" : "-"}{movement.quantity} · {movement.user}
                          </p>
                        </div>
                        <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">{movement.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom features row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
              {[
                { icon: ShoppingCart, label: "Auto Reorder", desc: "AI-powered" },
                { icon: Globe, label: "Multi-location", desc: "3 warehouses" },
                { icon: Clock, label: "Audit Trail", desc: "Full history" },
                { icon: Sparkles, label: "Predictions", desc: "Forecasting" },
              ].map((feature) => (
                <div key={feature.label} className="rounded-lg bg-secondary/30 border border-border/50 p-2 md:p-3 text-center">
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto mb-1 md:mb-2" />
                  <p className="text-[10px] md:text-xs font-medium text-foreground">{feature.label}</p>
                  <p className="text-[8px] md:text-[10px] text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Access overlay */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-[2px] flex items-end justify-center pb-8 md:pb-12">
              <div className="text-center px-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Package className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-1.5 md:mb-2">Try the Inventory Demo</h3>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md mb-4 md:mb-6">
                  Enter your email for 24-hour access to our inventory system.
                </p>
                <button
                  onClick={onRequestAccess}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Unlock Demo Access
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 md:mt-8 text-center px-4">
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
            All included in our <span className="text-primary font-semibold">PYMES plan at $169/month</span>
          </p>
          <a 
            href="#pricing" 
            className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-primary hover:underline"
          >
            View all pricing plans <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 4px); }
        }
      `}</style>
    </section>
  )
}
