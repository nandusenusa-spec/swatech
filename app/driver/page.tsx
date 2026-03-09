"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { 
  MapPin, Navigation, Wifi, WifiOff, Car, Package, Clock, Route, 
  MessageCircle, Flame, Trophy, Zap, Camera, Smile, Volume2, VolumeX,
  Send, Star, Target, Award, ChevronRight
} from "lucide-react"

type DeliveryStatus = "none" | "pickup" | "in-transit" | "delivered"

const EMOJI_AVATARS = ["😎", "🚗", "🚚", "🏎️", "🚀", "⚡", "🔥", "💪", "👨‍💼", "👩‍💼", "🦸", "🎯"]

const CAR_BRANDS = [
  { id: "toyota", name: "Toyota", icon: "🚙" },
  { id: "ford", name: "Ford", icon: "🛻" },
  { id: "honda", name: "Honda", icon: "🚗" },
  { id: "tesla", name: "Tesla", icon: "⚡" },
  { id: "chevrolet", name: "Chevrolet", icon: "🚐" },
  { id: "nissan", name: "Nissan", icon: "🚘" },
  { id: "bmw", name: "BMW", icon: "🏎️" },
  { id: "mercedes", name: "Mercedes", icon: "🚖" },
  { id: "van", name: "Van", icon: "🚐" },
  { id: "truck", name: "Truck", icon: "🚚" },
]

const CAR_COLORS = [
  { id: "blue", color: "#0ea5e9", name: "Blue" },
  { id: "red", color: "#ef4444", name: "Red" },
  { id: "green", color: "#22c55e", name: "Green" },
  { id: "yellow", color: "#eab308", name: "Yellow" },
  { id: "purple", color: "#a855f7", name: "Purple" },
  { id: "orange", color: "#f97316", name: "Orange" },
  { id: "pink", color: "#ec4899", name: "Pink" },
  { id: "white", color: "#f8fafc", name: "White" },
]

const QUICK_MESSAGES = [
  { emoji: "👋", text: "HI, LET'S TALK!" },
  { emoji: "🚗", text: "On my way!" },
  { emoji: "🚦", text: "Stuck in traffic" },
  { emoji: "☕", text: "Taking a break" },
  { emoji: "📦", text: "Package secured!" },
  { emoji: "✅", text: "Delivery complete!" },
  { emoji: "🆘", text: "Need assistance" },
  { emoji: "⏰", text: "Running late" },
]

const FLOATING_EMOJIS = ["🎉", "👍", "❤️", "🔥", "⭐", "🚀", "💯", "😊"]

const ACHIEVEMENTS = [
  { id: "first_mile", name: "First Mile", icon: "🏃", description: "Complete your first mile" },
  { id: "speed_demon", name: "Speed Demon", icon: "🏎️", description: "Reach 60+ mph" },
  { id: "early_bird", name: "Early Bird", icon: "🐦", description: "Clock in before 7am" },
  { id: "marathon", name: "Marathon", icon: "🏅", description: "Drive 100+ miles in a day" },
  { id: "streak_3", name: "3 Day Streak", icon: "🔥", description: "Work 3 days in a row" },
  { id: "delivery_10", name: "10 Deliveries", icon: "📦", description: "Complete 10 deliveries" },
]

export default function DriverPage() {
  const [driverId] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swatworks-driver-id')
      if (saved) return saved
      const newId = `driver-${Math.random().toString(36).substring(2, 8)}`
      localStorage.setItem('swatworks-driver-id', newId)
      return newId
    }
    return `driver-${Math.random().toString(36).substring(2, 8)}`
  })
  
  // Basic Info
  const [driverName, setDriverName] = useState("")
  const [driverPhone, setDriverPhone] = useState("")
  
  // Personalization
  const [avatar, setAvatar] = useState("😎")
  const [avatarType, setAvatarType] = useState<"emoji" | "photo" | "initials">("emoji")
  const [carBrand, setCarBrand] = useState("toyota")
  const [carColor, setCarColor] = useState("#0ea5e9")
  
  // Tracking State
  const [isTracking, setIsTracking] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  
  // Work Status
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("none")
  const [clockedIn, setClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<number | null>(null)
  const [totalMiles, setTotalMiles] = useState(0)
  const [dailyMilesGoal] = useState(100)
  
  // Messaging
  const [customMessage, setCustomMessage] = useState("HI, LET'S TALK!")
  const [showMessageBubble, setShowMessageBubble] = useState(true)
  const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null)
  
  // Gamification
  const [streak, setStreak] = useState(0)
  const [totalDeliveries, setTotalDeliveries] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [showAchievementPopup, setShowAchievementPopup] = useState<string | null>(null)
  
  // Sound
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Trail
  const [trail, setTrail] = useState<Array<{ lat: number; lng: number; timestamp: number }>>([])
  
  // Refs
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('swatworks-driver-name')
      const savedPhone = localStorage.getItem('swatworks-driver-phone')
      const savedAvatar = localStorage.getItem('swatworks-driver-avatar')
      const savedCarBrand = localStorage.getItem('swatworks-driver-car-brand')
      const savedCarColor = localStorage.getItem('swatworks-driver-car-color')
      const savedStreak = localStorage.getItem('swatworks-driver-streak')
      const savedDeliveries = localStorage.getItem('swatworks-driver-deliveries')
      const savedAchievements = localStorage.getItem('swatworks-driver-achievements')
      
      if (savedName) setDriverName(savedName)
      if (savedPhone) setDriverPhone(savedPhone)
      if (savedAvatar) setAvatar(savedAvatar)
      if (savedCarBrand) setCarBrand(savedCarBrand)
      if (savedCarColor) setCarColor(savedCarColor)
      if (savedStreak) setStreak(parseInt(savedStreak))
      if (savedDeliveries) setTotalDeliveries(parseInt(savedDeliveries))
      if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements))
    }
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && driverName) {
      localStorage.setItem('swatworks-driver-name', driverName)
      localStorage.setItem('swatworks-driver-phone', driverPhone)
      localStorage.setItem('swatworks-driver-avatar', avatar)
      localStorage.setItem('swatworks-driver-car-brand', carBrand)
      localStorage.setItem('swatworks-driver-car-color', carColor)
      localStorage.setItem('swatworks-driver-streak', streak.toString())
      localStorage.setItem('swatworks-driver-deliveries', totalDeliveries.toString())
      localStorage.setItem('swatworks-driver-achievements', JSON.stringify(unlockedAchievements))
    }
  }, [driverName, driverPhone, avatar, carBrand, carColor, streak, totalDeliveries, unlockedAchievements])

  // Play sound effect
  const playSound = (type: "honk" | "achievement" | "delivery") => {
    if (!soundEnabled) return
    // Using Web Audio API for sounds
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    if (type === "honk") {
      oscillator.frequency.value = 400
      gainNode.gain.value = 0.3
      oscillator.start()
      setTimeout(() => oscillator.stop(), 200)
    } else if (type === "achievement") {
      oscillator.frequency.value = 600
      gainNode.gain.value = 0.2
      oscillator.start()
      setTimeout(() => { oscillator.frequency.value = 800 }, 100)
      setTimeout(() => { oscillator.frequency.value = 1000 }, 200)
      setTimeout(() => oscillator.stop(), 400)
    } else if (type === "delivery") {
      oscillator.frequency.value = 500
      gainNode.gain.value = 0.2
      oscillator.start()
      setTimeout(() => oscillator.stop(), 150)
    }
  }

  // Check and unlock achievements
  const checkAchievements = useCallback((miles: number, speed: number) => {
    const newAchievements = [...unlockedAchievements]
    let unlocked = false
    
    if (miles >= 1 && !newAchievements.includes("first_mile")) {
      newAchievements.push("first_mile")
      setShowAchievementPopup("first_mile")
      unlocked = true
    }
    if (speed >= 60 && !newAchievements.includes("speed_demon")) {
      newAchievements.push("speed_demon")
      setShowAchievementPopup("speed_demon")
      unlocked = true
    }
    if (miles >= 100 && !newAchievements.includes("marathon")) {
      newAchievements.push("marathon")
      setShowAchievementPopup("marathon")
      unlocked = true
    }
    if (streak >= 3 && !newAchievements.includes("streak_3")) {
      newAchievements.push("streak_3")
      setShowAchievementPopup("streak_3")
      unlocked = true
    }
    if (totalDeliveries >= 10 && !newAchievements.includes("delivery_10")) {
      newAchievements.push("delivery_10")
      setShowAchievementPopup("delivery_10")
      unlocked = true
    }
    
    if (unlocked) {
      playSound("achievement")
      setUnlockedAchievements(newAchievements)
      setTimeout(() => setShowAchievementPopup(null), 3000)
    }
  }, [unlockedAchievements, streak, totalDeliveries, soundEnabled])

  // Calculate distance between two points in miles
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const sendLocation = useCallback(async (position: GeolocationPosition) => {
    if (!driverName) return
    
    let newTotalMiles = totalMiles
    const newTrail = [...trail]
    
    // Add to trail
    newTrail.push({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: Date.now()
    })
    // Keep only last 50 points
    if (newTrail.length > 50) newTrail.shift()
    setTrail(newTrail)
    
    // Calculate miles traveled
    if (lastPositionRef.current) {
      const distance = calculateDistance(
        lastPositionRef.current.lat,
        lastPositionRef.current.lng,
        position.coords.latitude,
        position.coords.longitude
      )
      if (distance < 1) {
        newTotalMiles = totalMiles + distance
        setTotalMiles(newTotalMiles)
      }
    }
    lastPositionRef.current = { lat: position.coords.latitude, lng: position.coords.longitude }
    
    // Check achievements
    const speedMph = (position.coords.speed || 0) * 2.237
    checkAchievements(newTotalMiles, speedMph)
    
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: driverId,
          name: driverName,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          phone: driverPhone || undefined,
          avatar,
          avatarType,
          carBrand,
          carColor,
          deliveryStatus,
          clockedIn,
          clockInTime,
          totalMiles: newTotalMiles,
          dailyMilesGoal,
          message: showMessageBubble ? customMessage : undefined,
          floatingEmoji,
          streak,
          totalDeliveries,
          achievements: unlockedAchievements,
          trail: newTrail.slice(-20), // Send last 20 for trail
        }),
      })
      
      if (response.ok) {
        setLastUpdate(new Date())
        setError(null)
        if (floatingEmoji) {
          setTimeout(() => setFloatingEmoji(null), 3000)
        }
      }
    } catch {
      setError("Failed to send location")
    }
  }, [driverId, driverName, driverPhone, avatar, avatarType, carBrand, carColor, 
      deliveryStatus, clockedIn, clockInTime, totalMiles, dailyMilesGoal,
      customMessage, showMessageBubble, floatingEmoji, streak, totalDeliveries,
      unlockedAchievements, trail, checkAchievements])

  useEffect(() => {
    if (!isTracking || !isRegistered) return

    let watchId: number

    const startTracking = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser")
        return
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position)
          sendLocation(position)
        },
        (err) => {
          setError(`Error: ${err.message}`)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      )
    }

    startTracking()

    const interval = setInterval(() => {
      if (currentPosition) {
        sendLocation(currentPosition)
      }
    }, 3000)

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
      clearInterval(interval)
    }
  }, [isTracking, isRegistered, sendLocation, currentPosition])

  const handleStart = () => {
    if (!driverName.trim()) {
      setError("Please enter your name")
      return
    }
    setIsRegistered(true)
    setIsTracking(true)
    setClockedIn(true)
    setClockInTime(Date.now())
    setError(null)
    playSound("honk")
  }

  const handleClockToggle = () => {
    if (!clockedIn) {
      setClockedIn(true)
      setClockInTime(Date.now())
      setTotalMiles(0)
      setStreak(prev => prev + 1)
      playSound("honk")
    } else {
      setClockedIn(false)
      setClockInTime(null)
    }
  }

  const handleDeliveryComplete = () => {
    setDeliveryStatus("delivered")
    setTotalDeliveries(prev => prev + 1)
    playSound("delivery")
    // Reset after 3 seconds
    setTimeout(() => setDeliveryStatus("none"), 3000)
  }

  const formatDuration = (startTime: number) => {
    const diff = Date.now() - startTime
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const deliveryStatuses: { value: DeliveryStatus; label: string; color: string; icon: string }[] = [
    { value: "none", label: "No Delivery", color: "bg-muted", icon: "📭" },
    { value: "pickup", label: "Pickup", color: "bg-yellow-500", icon: "📥" },
    { value: "in-transit", label: "In Transit", color: "bg-blue-500", icon: "🚚" },
    { value: "delivered", label: "Delivered", color: "bg-green-500", icon: "✅" },
  ]

  // Registration/Setup Screen
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="relative min-h-screen flex flex-col p-4 overflow-auto">
          <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4 shadow-lg shadow-primary/25 animate-bounce" style={{ animationDuration: "2s" }}>
                <Car className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">SwatWorks Fleet</h1>
              <p className="text-muted-foreground text-sm">Driver Tracking App</p>
            </div>
            
            {/* Setup Form */}
            <div className="space-y-5 flex-1">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name / Vehicle ID *
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g., John - Truck 01"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="e.g., +1 813 555 1234"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Choose Your Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setAvatar(emoji); setAvatarType("emoji") }}
                      className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                        avatar === emoji 
                          ? "bg-primary/20 border-2 border-primary scale-110" 
                          : "bg-secondary border border-border hover:border-primary/50"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Brand */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {CAR_BRANDS.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setCarBrand(brand.id)}
                      className={`p-2 rounded-xl text-center transition-all ${
                        carBrand === brand.id 
                          ? "bg-primary/20 border-2 border-primary" 
                          : "bg-secondary border border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl">{brand.icon}</span>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate">{brand.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Color */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CAR_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCarColor(c.color)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        carColor === c.color ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : ""
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Bubble Message
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {QUICK_MESSAGES.slice(0, 4).map((msg) => (
                    <button
                      key={msg.text}
                      onClick={() => setCustomMessage(msg.text)}
                      className={`p-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                        customMessage === msg.text 
                          ? "bg-primary/20 border border-primary" 
                          : "bg-secondary border border-border hover:border-primary/50"
                      }`}
                    >
                      <span>{msg.emoji}</span>
                      <span className="truncate">{msg.text}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Or type custom message..."
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}
            </div>
            
            {/* Start Button */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-lg transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Tracking
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <p className="text-xs text-muted-foreground text-center">
                Your location will be shared with the fleet dashboard in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Tracking Screen
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Achievement Popup */}
      {showAchievementPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-80">Achievement Unlocked!</p>
              <p className="font-bold">{ACHIEVEMENTS.find(a => a.id === showAchievementPopup)?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${carColor}22`, borderColor: carColor, borderWidth: 2 }}
            >
              {avatarType === "emoji" ? avatar : driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">{driverName}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {CAR_BRANDS.find(b => b.id === carBrand)?.icon} {CAR_BRANDS.find(b => b.id === carBrand)?.name}
                </span>
                {streak > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-orange-500">
                    <Flame className="w-3 h-3" /> {streak}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-secondary"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isTracking ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            }`}>
              {isTracking ? <Wifi className="w-4 h-4 animate-pulse" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-xs font-medium">{isTracking ? "Live" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto pb-24">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <Target className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-foreground">{totalMiles.toFixed(1)}</p>
            <p className="text-[10px] text-muted-foreground">Miles Today</p>
            <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${Math.min((totalMiles / dailyMilesGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <Package className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="text-lg font-bold text-foreground">{totalDeliveries}</p>
            <p className="text-[10px] text-muted-foreground">Deliveries</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <Award className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
            <p className="text-lg font-bold text-foreground">{unlockedAchievements.length}</p>
            <p className="text-[10px] text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* Clock In/Out */}
        <button
          onClick={handleClockToggle}
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            clockedIn 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-secondary border-border"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              clockedIn ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
            }`}>
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">{clockedIn ? "Clocked In" : "Clock In"}</p>
              {clockedIn && clockInTime && (
                <p className="text-sm text-green-500 font-mono">{formatDuration(clockInTime)}</p>
              )}
            </div>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 ${
            clockedIn ? "bg-green-500 border-green-500" : "border-muted-foreground"
          }`}>
            {clockedIn && <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>}
          </div>
        </button>

        {/* Delivery Status */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Delivery Status</span>
            </div>
            {deliveryStatus === "in-transit" && (
              <button
                onClick={handleDeliveryComplete}
                className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs font-medium animate-pulse"
              >
                Mark Delivered
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {deliveryStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setDeliveryStatus(status.value)}
                className={`p-2 rounded-lg text-center transition-all ${
                  deliveryStatus === status.value
                    ? `${status.color} text-white scale-105`
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="text-lg">{status.icon}</span>
                <p className="text-[9px] mt-1 truncate">{status.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Messages */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Quick Messages</span>
            <button
              onClick={() => setShowMessageBubble(!showMessageBubble)}
              className={`ml-auto px-2 py-0.5 rounded text-xs ${
                showMessageBubble ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {showMessageBubble ? "ON" : "OFF"}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_MESSAGES.map((msg) => (
              <button
                key={msg.text}
                onClick={() => setCustomMessage(msg.text)}
                className={`p-2 rounded-lg transition-all ${
                  customMessage === msg.text 
                    ? "bg-primary/20 border border-primary" 
                    : "bg-secondary hover:bg-muted"
                }`}
              >
                <span className="text-xl">{msg.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Emojis */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Smile className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Send Reaction</span>
          </div>
          <div className="flex gap-2 justify-between">
            {FLOATING_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { setFloatingEmoji(emoji); playSound("honk") }}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  floatingEmoji === emoji 
                    ? "bg-primary/20 scale-125 animate-bounce" 
                    : "bg-secondary hover:scale-110"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Current Position</p>
              {currentPosition ? (
                <p className="font-mono text-sm text-foreground">
                  {currentPosition.coords.latitude.toFixed(6)}, {currentPosition.coords.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground animate-pulse">Acquiring GPS...</p>
              )}
            </div>
          </div>

          {currentPosition && (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-secondary rounded-xl p-3 relative overflow-hidden">
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="text-xl font-bold text-foreground">
                  {currentPosition.coords.speed 
                    ? `${(currentPosition.coords.speed * 2.237).toFixed(0)}`
                    : "0"
                  }
                  <span className="text-xs font-normal text-muted-foreground ml-1">mph</span>
                </p>
                {currentPosition.coords.speed && currentPosition.coords.speed * 2.237 > 30 && (
                  <Flame className="absolute right-2 bottom-2 w-5 h-5 text-orange-500 animate-pulse" />
                )}
              </div>
              <div className="bg-secondary rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Heading</p>
                <div className="flex items-center gap-2">
                  <Navigation 
                    className="w-5 h-5 text-primary transition-transform" 
                    style={{ transform: `rotate(${currentPosition.coords.heading || 0}deg)` }}
                  />
                  <p className="text-xl font-bold text-foreground">
                    {currentPosition.coords.heading?.toFixed(0) || "0"}°
                  </p>
                </div>
              </div>
            </div>
          )}

          {lastUpdate && (
            <p className="text-xs text-muted-foreground text-center">
              Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-foreground">Achievements</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = unlockedAchievements.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`p-2 rounded-lg text-center transition-all ${
                    unlocked 
                      ? "bg-yellow-500/10 border border-yellow-500/30" 
                      : "bg-secondary/50 opacity-40"
                  }`}
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <p className="text-[9px] mt-1 text-muted-foreground truncate">{achievement.name}</p>
                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Fixed Bottom Control */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] shadow-lg ${
            isTracking 
              ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/25" 
              : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-primary/25"
          }`}
        >
          {isTracking ? "Stop Tracking" : "Resume Tracking"}
        </button>
      </div>
    </div>
  )
}
