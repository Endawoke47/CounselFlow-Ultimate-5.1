import React from 'react'

interface IconProps {
  size?: number | string
  className?: string
  color?: string
  strokeWidth?: number
  style?: React.CSSProperties
}

const createIcon = (path: string | React.ReactNode, viewBox = "0 0 24 24") => {
  return ({ size = 24, className = "", color = "currentColor", strokeWidth = 1.5, style }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {typeof path === 'string' ? <path d={path} /> : path}
    </svg>
  )
}

// Navigation Icons
export const Home = createIcon("M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z")
export const Dashboard = createIcon("M3 3v8h8V3zm10 0v8h8V3zM3 13v8h8v-8zm10 0v8h8v-8z")
export const Documents = createIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 6h-4V4")
export const Cases = createIcon("M22 12h-4l-3 9L9 3l-3 9H2")
export const Contracts = createIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z")
export const Clients = createIcon("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2")
export const Analytics = createIcon("M21 21H3V3m4 14l4-4 4 4 6-6")

// Action Icons
export const Plus = createIcon("M12 5v14m-7-7h14")
export const Edit = createIcon("M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7")
export const Delete = createIcon("M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2")
export const Save = createIcon("M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z")
export const Download = createIcon("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m11-4l-5 5-5-5m5-7v12")
export const Upload = createIcon("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5-5 5 5m-5-7v12")
export const Share = createIcon("M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8")
export const Copy = createIcon("M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1")

// Interface Icons
export const Search = createIcon("M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z")
export const Filter = createIcon("M22 3H2l8 9.46V19l4 2v-8.54L22 3z")
export const Sort = createIcon("M3 7h18m-12 5h12m-8 5h8")
export const Menu = createIcon("M3 12h18m-9-6h9m-9 12h9")
export const Close = createIcon("M18 6L6 18M6 6l12 12")
export const ChevronDown = createIcon("M6 9l6 6 6-6")
export const ChevronUp = createIcon("M18 15l-6-6-6 6")
export const ChevronLeft = createIcon("M15 18l-6-6 6-6")
export const ChevronRight = createIcon("M9 18l6-6-6-6")
export const ArrowLeft = createIcon("M19 12H5m7-7l-7 7 7 7")
export const ArrowRight = createIcon("M5 12h14m-7-7l7 7-7 7")

// Status Icons
export const Check = createIcon("M20 6L9 17l-5-5")
export const CheckCircle = createIcon("M22 11.08V12a10 10 0 1 1-5.93-9.14")
export const AlertCircle = createIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4m0 4h.01")
export const Info = createIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4m0 4h.01")
export const Warning = createIcon("M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z")
export const Error = createIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 14.3l-1.4 1.4L12 14.8l-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 2.9 2.9 2.9-2.9 1.4 1.4L14.8 12l2.9 2.9z")
export const Success = createIcon("M22 11.08V12a10 10 0 1 1-5.93-9.14")
export const TrendingUp = createIcon("M22 7l-8.5 8.5L9 11l-7 7")
export const TrendingDown = createIcon("M22 17l-8.5-8.5L9 13l-7-7")
export const X = createIcon("M18 6L6 18M6 6l12 12")

// File & Document Icons
export const File = createIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z")
export const FileText = createIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-3 15H8m3-4H8m6-4H8")
export const FilePdf = createIcon("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z")
export const Folder = createIcon("M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z")
export const FolderOpen = createIcon("M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-9l-2-3H5a2 2 0 0 0-2 2z")
export const Archive = createIcon("M21 8v13H3V8m18-5H3l2.447 4.894a2 2 0 0 0 1.789 1.106h9.528a2 2 0 0 0 1.789-1.106L21 3z")

// Technology Icons
export const AI = createIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14.5v-9l8 4.5-8 4.5z")
export const Robot = createIcon("M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1a1 1 0 0 1-1 1h-2a3 3 0 0 1-6 0H9a1 1 0 0 1-1-1v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z")
export const Network = createIcon("M12 2v8m0 4v8m8-8H4")
export const Database = createIcon("M21 12c0 1.66-4 3-9 3s-9-1.34-9-3m18 0c0-1.66-4-3-9-3s-9 1.34-9 3m18 0v6c0 1.66-4 3-9 3s-9-1.34-9-3v-6m18-6c0-1.66-4-3-9-3s-9 1.34-9 3v6")
export const Cloud = createIcon("M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z")

// Legal Icons
export const Scale = createIcon("M12 3l-1.5 6h3L12 3zM8 8l-4 1v5l4-1V8zM16 8v5l4 1V9l-4-1zM5 15l2 6h2l-2-6H5zM15 15l2 6h2l-2-6h-2z")
export const Shield = createIcon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z")

// Communication Icons
export const Mail = createIcon("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z")
export const Phone = createIcon("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z")
export const Message = createIcon("M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z")
export const Bell = createIcon("M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-5.27 13a2 2 0 0 1-3.46 0")

// Settings & Configuration
export const Settings = createIcon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")
export const User = createIcon("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2")
export const Users = createIcon("M17 21v-2a4 4 0 0 0-3-3.87m0 0a5 5 0 1 0 0-9.26m0 9.26a5 5 0 1 0 0-9.26m0 9.26v3.87a4 4 0 0 0 3 3.87M9 7a4 4 0 1 1 8 0 4 4 0 0 1-8 0z")
export const Lock = createIcon("M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4")
export const Key = createIcon("M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4")
export const LogOut = createIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m5 0h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4")

// Time & Calendar
export const Calendar = createIcon("M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zm0 0V7a2 2 0 0 1 2-2h2m0-2v4m10-4v4m1-4h2a2 2 0 0 1 2 2v2")
export const Clock = createIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm3 11h-4V7")
export const Timer = createIcon("M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4-2")
export const History = createIcon("M3 3v5h5m-1.5-1.5C7.8 4.8 9.8 4 12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8")

// Theme & Display
export const Sun = createIcon("M12 1v2m0 18v2m11-11h-2M4 12H2m15.36-6.64l-1.42 1.42M6.64 6.64l-1.42-1.42m12.02 12.02l-1.42-1.42M6.64 17.36l-1.42 1.42")
export const Moon = createIcon("M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z")
export const Monitor = createIcon("M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z")
export const Eye = createIcon("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z")
export const EyeOff = createIcon("M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24")

// Export all icons as default object
const Icons = {
  // Navigation
  Home, Dashboard, Documents, Cases, Contracts, Clients, Analytics,
  
  // Actions
  Plus, Edit, Delete, Save, Download, Upload, Share, Copy,
  
  // Interface
  Search, Filter, Sort, Menu, Close, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight,
  
  // Status
  Check, CheckCircle, AlertCircle, Info, Warning, Error, Success, TrendingUp, TrendingDown, X,
  
  // Files
  File, FileText, FilePdf, Folder, FolderOpen, Archive,
  
  // Technology
  AI, Robot, Network, Database, Cloud,
  
  // Legal
  Scale, Shield,
  
  // Communication
  Mail, Phone, Message, Bell,
  
  // Settings
  Settings, User, Users, Lock, Key, LogOut,
  
  // Time
  Calendar, Clock, Timer, History,
  
  // Theme
  Sun, Moon, Monitor, Eye, EyeOff
}

export default Icons