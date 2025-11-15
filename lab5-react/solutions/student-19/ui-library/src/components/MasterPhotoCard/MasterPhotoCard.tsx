import React, { useState } from 'react'

import styles from './MasterPhotoCard.module.css'

export interface MasterPhotoCardProps {
  masterPhoto: string
  workPhotos: string[]
  masterName?: string
  className?: string
}

export const MasterPhotoCard: React.FC<MasterPhotoCardProps> = ({
  masterPhoto,
  workPhotos,
  masterName,
  className = ''
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const allPhotos = [masterPhoto, ...workPhotos]

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev + 1) % allPhotos.length)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentSlide((prev) => (prev - 1 + allPhotos.length) % allPhotos.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div 
      className={`${styles.masterPhotoCard} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setCurrentSlide(0)
      }}
    >
      <div className={styles.slider}>
        <img
          src={allPhotos[currentSlide]}
          alt={currentSlide === 0 ? `Мастер ${masterName || 'салона'}` : `Работа мастера ${masterName || 'салона'}`}
          className={styles.sliderImage}
        />
        
        {isHovered && workPhotos.length > 0 && (
          <>
            <button 
              className={`${styles.sliderBtn} ${styles.sliderBtnPrev}`}
              onClick={prevSlide}
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            
            <button 
              className={`${styles.sliderBtn} ${styles.sliderBtnNext}`}
              onClick={nextSlide}
              aria-label="Следующее фото"
            >
              ›
            </button>
          </>
        )}

        {isHovered && workPhotos.length > 0 && allPhotos.length > 1 && (
          <div className={styles.sliderDots}>
            {allPhotos.map((_, index) => (
              <button
                key={index}
                className={`${styles.sliderDot} ${index === currentSlide ? styles.sliderDotActive : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(index)
                }}
                aria-label={`Перейти к фото ${index + 1}`}
              />
            ))}
          </div>
        )}

        {isHovered && currentSlide > 0 && (
          <div className={styles.workLabel}>
            Работа мастера
          </div>
        )}
      </div>

      {masterName && (
        <div className={styles.masterName}>
          {masterName}
        </div>
      )}
    </div>
  )
}