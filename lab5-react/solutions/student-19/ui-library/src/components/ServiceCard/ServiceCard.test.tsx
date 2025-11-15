import { render, screen, fireEvent } from '@testing-library/react'

import { ServiceCard } from './ServiceCard'

describe('ServiceCard', () => {
  const mockProps = {
    backgroundImage: '/test-image.jpg',
    title: 'Test Service',
    description: 'Test description for the service',
    onClick: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders service card with correct content', () => {
    render(<ServiceCard {...mockProps} />)
    
    expect(screen.getByText('Test Service')).toBeInTheDocument()
    expect(screen.getByText('Test description for the service')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Выбрать услугу: Test Service')
  })

  it('calls onClick when clicked', () => {
    render(<ServiceCard {...mockProps} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick when Enter key is pressed', () => {
    render(<ServiceCard {...mockProps} />)
    
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick when Space key is pressed', () => {
    render(<ServiceCard {...mockProps} />)
    
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('applies selected class when isSelected is true', () => {
    render(<ServiceCard {...mockProps} isSelected={true} />)
    
    const button = screen.getByRole('button')

    expect(button.className).toContain('selected')
  })

  it('applies custom className', () => {
    render(<ServiceCard {...mockProps} className="custom-class" />)
    
    const button = screen.getByRole('button')

    expect(button.className).toContain('custom-class')
  })
})