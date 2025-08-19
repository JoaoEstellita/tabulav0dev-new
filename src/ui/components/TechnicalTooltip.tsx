import React, { useState } from 'react'
import type { TechnicalTooltip as TechnicalTooltipType } from '../../astro'

interface TechnicalTooltipProps {
  term: string
  tooltip: TechnicalTooltipType
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const TechnicalTooltip: React.FC<TechnicalTooltipProps> = ({
  term,
  tooltip,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'tooltip-top'
      case 'bottom':
        return 'tooltip-bottom'
      case 'left':
        return 'tooltip-left'
      case 'right':
        return 'tooltip-right'
      default:
        return 'tooltip-top'
    }
  }

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`tooltip ${getPositionClasses()}`}>
          <div className="tooltip-header">
            <span className="tooltip-term">{tooltip.term}</span>
            <span className="tooltip-icon">ℹ️</span>
          </div>
          
          <div className="tooltip-content">
            <div className="tooltip-section">
              <h4>Simples:</h4>
              <p>{tooltip.simple}</p>
            </div>
            
            <div className="tooltip-section">
              <h4>Técnico:</h4>
              <p>{tooltip.technical}</p>
            </div>
            
            <div className="tooltip-section">
              <h4>Exemplo:</h4>
              <p>{tooltip.example}</p>
            </div>
            
            <div className="tooltip-section">
              <h4>Significado:</h4>
              <p>{tooltip.significance}</p>
            </div>
          </div>
          
          <div className="tooltip-arrow"></div>
        </div>
      )}
      
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        
        .tooltip {
          position: absolute;
          z-index: 1000;
          width: 320px;
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid rgba(255, 193, 7, 0.5);
          border-radius: 12px;
          padding: 16px;
          color: #FFFFFF;
          font-size: 14px;
          line-height: 1.5;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .tooltip-top {
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
        }
        
        .tooltip-bottom {
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
        }
        
        .tooltip-left {
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
        }
        
        .tooltip-right {
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
        }
        
        .tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .tooltip-term {
          font-weight: 600;
          color: #FFC107;
          text-transform: capitalize;
        }
        
        .tooltip-icon {
          font-size: 16px;
        }
        
        .tooltip-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .tooltip-section h4 {
          margin: 0 0 4px 0;
          font-size: 12px;
          font-weight: 600;
          color: #FFC107;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .tooltip-section p {
          margin: 0;
          font-size: 13px;
          color: #E0E0E0;
        }
        
        .tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
        }
        
        .tooltip-top .tooltip-arrow {
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid rgba(0, 0, 0, 0.95);
        }
        
        .tooltip-bottom .tooltip-arrow {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid rgba(0, 0, 0, 0.95);
        }
        
        .tooltip-left .tooltip-arrow {
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 8px solid rgba(0, 0, 0, 0.95);
        }
        
        .tooltip-right .tooltip-arrow {
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-right: 8px solid rgba(0, 0, 0, 0.95);
        }
        
        @media (max-width: 768px) {
          .tooltip {
            width: 280px;
            font-size: 13px;
          }
          
          .tooltip-section h4 {
            font-size: 11px;
          }
          
          .tooltip-section p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}

// Componente wrapper para uso simples
interface SimpleTooltipProps {
  term: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  term,
  children,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="simple-tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`simple-tooltip simple-tooltip-${position}`}>
          <div className="simple-tooltip-content">
            <span className="simple-tooltip-term">{term}</span>
            <span className="simple-tooltip-icon">ℹ️</span>
          </div>
          <div className="simple-tooltip-arrow"></div>
        </div>
      )}
      
      <style jsx>{`
        .simple-tooltip-container {
          position: relative;
          display: inline-block;
        }
        
        .simple-tooltip {
          position: absolute;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 193, 7, 0.5);
          border-radius: 8px;
          padding: 8px 12px;
          color: #FFFFFF;
          font-size: 12px;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }
        
        .simple-tooltip-top {
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }
        
        .simple-tooltip-bottom {
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }
        
        .simple-tooltip-left {
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }
        
        .simple-tooltip-right {
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }
        
        .simple-tooltip-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .simple-tooltip-term {
          font-weight: 500;
          color: #FFC107;
        }
        
        .simple-tooltip-icon {
          font-size: 12px;
        }
        
        .simple-tooltip-arrow {
          position: absolute;
          width: 0;
          height: 0;
        }
        
        .simple-tooltip-top .simple-tooltip-arrow {
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid rgba(0, 0, 0, 0.9);
        }
        
        .simple-tooltip-bottom .simple-tooltip-arrow {
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid rgba(0, 0, 0, 0.9);
        }
        
        .simple-tooltip-left .simple-tooltip-arrow {
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid rgba(0, 0, 0, 0.9);
        }
        
        .simple-tooltip-right .simple-tooltip-arrow {
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid rgba(0, 0, 0, 0.9);
        }
      `}</style>
    </div>
  )
}
