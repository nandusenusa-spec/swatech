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
        <div className="flex flex-wrap justify-center gap-3 mb-8">
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
              className="flex items-center gap-2 rounded-full bg-secondary/50 border border-border/50 px-3 py-1.5 text-xs text-muted-foreground"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="w-3.5 h-3.5 text-primary" />
              {feature.label}
            </div>
          ))}
        </div>

        {/* Main Dashboard */}
        <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">SWATech Inventory Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">24h demo</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500">Live</span>
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

          <div className="p-4 md:p-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Total Value</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  ${displayedTotalValue.toLocaleString()}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.5% this month
                </p>
              </div>
              
              <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Total Items</span>
                  <Box className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{displayedTotalItems}</p>
                <p className="text-xs text-muted-foreground mt-1">Across {products.length} SKUs</p>
              </div>
              
              <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Low Stock</span>
                  <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
                </div>
                <p className={`text-2xl font-bold ${lowStockCount > 0 ? "text-amber-500" : "text-foreground"}`}>
                  {lowStockCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Need reorder</p>
              </div>
              
              <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Movements Today</span>
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{movements.length}</p>
                <p className="text-xs text-muted-foreground mt-1">In/Out transactions</p>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <button 
                  onClick={simulateScan}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden md:inline">Scan</span>
                </button>
                
                <button 
                  onClick={handleRefresh}
                  className={`p-2.5 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:text-foreground transition-colors ${isRefreshing ? "animate-spin" : ""}`}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Products table */}
              <div className="md:col-span-2 rounded-xl border border-border/50 overflow-hidden">
                <div className="bg-secondary/30 px-4 py-2 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground">Products ({filteredProducts.length})</p>
                </div>
                <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                  {filteredProducts.map((product, i) => (
                    <div 
                      key={product.id}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedProduct(product); setShowQuickAdd(true) }}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl group-hover:scale-110 transition-transform overflow-visible shrink-0">
                        <span className="text-2xl leading-none">{product.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.id} · {product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${
                          product.stock <= product.minStock ? "text-amber-500" : "text-foreground"
                        }`}>
                          {product.stock} units
                        </p>
                        <p className="text-xs text-muted-foreground">${product.price}</p>
                      </div>
                      {product.stock <= product.minStock && (
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="bg-secondary/30 px-4 py-2 border-b border-border/50 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Live Activity</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                </div>
                <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                  {movements.map((movement, i) => (
                    <div 
                      key={movement.id}
                      className="px-4 py-3 animate-in slide-in-from-right duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          movement.type === "in" 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {movement.type === "in" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{movement.product}</p>
                          <p className="text-xs text-muted-foreground">
                            {movement.type === "in" ? "+" : "-"}{movement.quantity} · {movement.user}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{movement.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom features row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: ShoppingCart, label: "Auto Purchase Orders", desc: "AI-powered reordering" },
                { icon: Globe, label: "Multi-location", desc: "3 warehouses synced" },
                { icon: Clock, label: "History & Audit", desc: "Full traceability" },
                { icon: Sparkles, label: "Smart Predictions", desc: "Demand forecasting" },
              ].map((feature) => (
                <div key={feature.label} className="rounded-lg bg-secondary/30 border border-border/50 p-3 text-center">
                  <feature.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">{feature.label}</p>
                  <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Access overlay */}
          {!hasAccess && (
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-[2px] flex items-end justify-center pb-12">
              <div className="text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Try the Inventory Demo</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Enter your email for 24-hour access to our enterprise inventory management system.
                </p>
                <button
                  onClick={onRequestAccess}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Unlock Demo Access
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            All of this is included in our <span className="text-primary font-semibold">PYMES plan at $169/month</span>
          </p>
          <a 
            href="#pricing" 
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all pricing plans <ArrowUpRight className="w-4 h-4" />
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
