import React from 'react'
import type { SimplifiedLifeArea } from '../../astro'

interface SimplifiedLifeAreaCardProps {
  area: SimplifiedLifeArea
  onViewMore: () => void
  showTechnicalSummary?: boolean
}

export const SimplifiedLifeAreaCard: React.FC<SimplifiedLifeAreaCardProps> = ({
  area,
  onViewMore,
  showTechnicalSummary = false
}) => {
  const getAreaIcon = (areaName: string) => {
    const icons: Record<string, string> = {
      'amor': '💖',
      'carreira': '💼',
      'financas': '💰',
      'saude': '🏥',
      'familia': '👨‍👩‍👧‍👦',
      'espiritualidade': '🧘',
      'comunicacao': '💬',
      'transformacao': '🔄'
    }
    return icons[areaName.toLowerCase()] || '⭐'
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case 'success':
        return 'success-theme'
      case 'warning':
        return 'warning-theme'
      case 'info':
        return 'info-theme'
      case 'danger':
        return 'danger-theme'
      default:
        return 'default-theme'
    }
  }

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'success':
        return 'gradient-success'
      case 'warning':
        return 'gradient-warning'
      case 'info':
        return 'gradient-info'
      case 'danger':
        return 'gradient-danger'
      default:
        return 'gradient-default'
    }
  }

  return (
    <div className={`life-area-card ${getColorClass(area.energy.color)}`}>
      <div className={`card-header ${getGradientClass(area.energy.color)}`}>
        <div className="area-icon">
          {getAreaIcon(area.area)}
        </div>
        
        <div className="area-info">
          <h3 className="area-title">{area.area.toUpperCase()}</h3>
          <div className="energy-score">{area.energy.percentage}%</div>
          <div className="energy-level">{area.energy.level}</div>
        </div>
        
        <button className="view-more-btn" onClick={onViewMore}>
          Ver mais
        </button>
      </div>
      
      <div className="card-content">
        <div className="main-influence">
          <h4>Influência Principal</h4>
          <p>{area.mainInfluence.description}</p>
          <span className="impact">{area.mainInfluence.impact}</span>
        </div>
        
        <div className="daily-guidance">
          <div className="guidance-item">
            <span className="guidance-icon">🎯</span>
            <span className="guidance-text">{area.dailyGuidance.focus}</span>
          </div>
          
          <div className="guidance-item">
            <span className="guidance-icon">⚠️</span>
            <span className="guidance-text">{area.dailyGuidance.avoid}</span>
          </div>
          
          <div className="guidance-item">
            <span className="guidance-icon">✨</span>
            <span className="guidance-text">{area.dailyGuidance.opportunity}</span>
          </div>
        </div>
        
        {showTechnicalSummary && (
          <div className="technical-summary">
            <h4>Resumo Técnico</h4>
            <div className="summary-items">
              <span className="summary-item">
                <strong>Dignidades:</strong> {area.technicalSummary.dignities}
              </span>
              <span className="summary-item">
                <strong>Casa:</strong> {area.technicalSummary.house}
              </span>
              <span className="summary-item">
                <strong>Aspectos:</strong> {area.technicalSummary.aspects}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .life-area-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .life-area-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }
        
        .card-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
        }
        
        .area-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }
        
        .area-info {
          flex: 1;
        }
        
        .area-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 1px;
        }
        
        .energy-score {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 4px;
        }
        
        .energy-level {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .view-more-btn {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .view-more-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }
        
        .card-content {
          padding: 20px;
          background: rgba(0, 0, 0, 0.1);
        }
        
        .main-influence {
          margin-bottom: 20px;
        }
        
        .main-influence h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .main-influence p {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #FFFFFF;
          line-height: 1.4;
        }
        
        .impact {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
        
        .daily-guidance {
          margin-bottom: 20px;
        }
        
        .guidance-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .guidance-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
        }
        
        .guidance-text {
          font-size: 13px;
          color: #FFFFFF;
          line-height: 1.3;
        }
        
        .technical-summary {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
        }
        
        .technical-summary h4 {
          margin: 0 0 12px 0;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .summary-item {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.3;
        }
        
        .summary-item strong {
          color: rgba(255, 255, 255, 0.9);
        }
        
        /* Temas de cores */
        .success-theme {
          border-color: rgba(76, 175, 80, 0.3);
        }
        
        .warning-theme {
          border-color: rgba(255, 193, 7, 0.3);
        }
        
        .info-theme {
          border-color: rgba(33, 150, 243, 0.3);
        }
        
        .danger-theme {
          border-color: rgba(244, 67, 54, 0.3);
        }
        
        /* Gradientes */
        .gradient-success {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.4));
        }
        
        .gradient-warning {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.8), rgba(255, 193, 7, 0.4));
        }
        
        .gradient-info {
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.8), rgba(33, 150, 243, 0.4));
        }
        
        .gradient-danger {
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.8), rgba(244, 67, 54, 0.4));
        }
        
        .gradient-default {
          background: linear-gradient(135deg, rgba(158, 158, 158, 0.8), rgba(158, 158, 158, 0.4));
        }
        
        @media (max-width: 768px) {
          .card-header {
            padding: 16px;
            gap: 12px;
          }
          
          .area-icon {
            width: 50px;
            height: 50px;
            font-size: 24px;
          }
          
          .area-title {
            font-size: 16px;
          }
          
          .energy-score {
            font-size: 20px;
          }
          
          .card-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  )
}
