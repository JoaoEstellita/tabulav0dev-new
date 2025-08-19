import React from 'react'
import type { ViewMode, UserLevel } from '../../astro'

interface ViewModeToggleProps {
  currentMode: ViewMode
  userLevel: UserLevel
  onModeChange: (mode: ViewMode) => void
  showUserLevel?: boolean
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  userLevel,
  onModeChange,
  showUserLevel = true
}) => {
  const getModeLabel = (mode: ViewMode) => {
    switch (mode) {
      case 'simple':
        return 'Simples'
      case 'technical':
        return 'Técnico'
      case 'dual':
        return 'Dual'
      default:
        return 'Simples'
    }
  }

  const getModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'simple':
        return '🌟'
      case 'technical':
        return '🔬'
      case 'dual':
        return '⚖️'
      default:
        return '🌟'
    }
  }

  const getUserLevelIcon = (level: UserLevel) => {
    switch (level) {
      case 'beginner':
        return '🌱'
      case 'intermediate':
        return '🌿'
      case 'expert':
        return '🌳'
      default:
        return '🌱'
    }
  }

  const getUserLevelLabel = (level: UserLevel) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante'
      case 'intermediate':
        return 'Intermediário'
      case 'expert':
        return 'Expert'
      default:
        return 'Iniciante'
    }
  }

  return (
    <div className="view-mode-toggle">
      {showUserLevel && (
        <div className="user-level-indicator">
          <span className="user-level-icon">{getUserLevelIcon(userLevel)}</span>
          <span className="user-level-label">{getUserLevelLabel(userLevel)}</span>
        </div>
      )}
      
      <div className="mode-toggle-buttons">
        <button
          className={`mode-button ${currentMode === 'simple' ? 'active' : ''}`}
          onClick={() => onModeChange('simple')}
          title="Visualização simplificada - linguagem acessível"
        >
          <span className="mode-icon">{getModeIcon('simple')}</span>
          <span className="mode-label">{getModeLabel('simple')}</span>
        </button>
        
        <button
          className={`mode-button ${currentMode === 'dual' ? 'active' : ''}`}
          onClick={() => onModeChange('dual')}
          title="Visualização dual - simples + técnico"
        >
          <span className="mode-icon">{getModeIcon('dual')}</span>
          <span className="mode-label">{getModeLabel('dual')}</span>
        </button>
        
        <button
          className={`mode-button ${currentMode === 'technical' ? 'active' : ''}`}
          onClick={() => onModeChange('technical')}
          title="Visualização técnica - dados completos"
        >
          <span className="mode-icon">{getModeIcon('technical')}</span>
          <span className="mode-label">{getModeLabel('technical')}</span>
        </button>
      </div>
      
      <style jsx>{`
        .view-mode-toggle {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }
        
        .user-level-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .user-level-icon {
          font-size: 16px;
        }
        
        .user-level-label {
          font-size: 14px;
          font-weight: 500;
          color: #FFC107;
        }
        
        .mode-toggle-buttons {
          display: flex;
          gap: 8px;
        }
        
        .mode-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .mode-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .mode-button.active {
          background: rgba(255, 193, 7, 0.2);
          border-color: rgba(255, 193, 7, 0.5);
          color: #FFC107;
        }
        
        .mode-icon {
          font-size: 20px;
        }
        
        .mode-label {
          font-size: 12px;
          font-weight: 500;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
