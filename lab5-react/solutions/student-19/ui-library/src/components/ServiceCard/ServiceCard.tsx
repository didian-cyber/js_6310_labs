import React from 'react'

import styles from './ServiceCard.module.css'

export interface ServiceCardProps {
  backgroundImage: string
  title: string
  description: string
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  backgroundImage,
  title,
  description,
  onClick,
  isSelected = false,
  className = ''
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div 
      className={`${styles.serviceCardWrapper} ${isSelected ? styles.selected : ''} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Выбрать услугу: ${title}`}
    >
      <div 
        className={styles.serviceCard}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className={styles.overlay}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  )
}