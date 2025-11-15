import { render, screen, fireEvent } from '@testing-library/react'

import { MasterPhotoCard } from './MasterPhotoCard'

describe('MasterPhotoCard', () => {
  const mockProps = {
    masterPhoto: 'master.jpg',
    workPhotos: ['work1.jpg', 'work2.jpg', 'work3.jpg'],
    masterName: 'Анна'
  }

  it('renders master photo and name', () => {
    render(<MasterPhotoCard {...mockProps} />)
    
    expect(screen.getByAltText('Мастер Анна')).toHaveAttribute('src', mockProps.masterPhoto)
    expect(screen.getByText('Анна')).toBeInTheDocument()
  })

  it('shows navigation and dots on hover with work photos', () => {
    render(<MasterPhotoCard {...mockProps} />)
    
    const card = document.querySelector('.masterPhotoCard')

    fireEvent.mouseEnter(card!)
    
    expect(screen.getByLabelText('Предыдущее фото')).toBeInTheDocument()
    expect(screen.getByLabelText('Следующее фото')).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Перейти к фото/)).toHaveLength(4)
  })

  it('navigates slides with buttons and shows work label', () => {
    render(<MasterPhotoCard {...mockProps} />)
    
    const card = document.querySelector('.masterPhotoCard')

    fireEvent.mouseEnter(card!)
    
    fireEvent.click(screen.getByLabelText('Следующее фото'))
    expect(screen.getByAltText('Работа мастера Анна')).toBeInTheDocument()
    expect(screen.getByText('Работа мастера')).toBeInTheDocument()
    
    fireEvent.click(screen.getByLabelText('Предыдущее фото'))
    expect(screen.getByAltText('Мастер Анна')).toBeInTheDocument()
  })

  it('navigates with dots', () => {
    render(<MasterPhotoCard {...mockProps} />)
    
    const card = document.querySelector('.masterPhotoCard')

    fireEvent.mouseEnter(card!)
    
    const dots = screen.getAllByLabelText(/Перейти к фото/)

    fireEvent.click(dots[2])
    expect(screen.getByAltText('Работа мастера Анна')).toBeInTheDocument()
  })

  it('handles master without name', () => {
    const props = { masterPhoto: 'master.jpg', workPhotos: ['work1.jpg'], masterName: undefined }

    render(<MasterPhotoCard {...props} />)
    
    expect(screen.getByAltText('Мастер салона')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<MasterPhotoCard {...mockProps} className="custom-class" />)
    const card = document.querySelector('.masterPhotoCard')

    expect(card).toHaveClass('custom-class')
  })
})