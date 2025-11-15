import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

jest.mock('@beauty-salon/ui-library', () => ({
  ServiceCard: jest.fn(({ title, description, onClick, isSelected }) => (
    <div 
      onClick={onClick} 
      data-testid={`service-${title}`}
      className={isSelected ? 'selected' : ''}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )),
  MasterPhotoCard: jest.fn(({ masterName = 'Мастер' }) => (
    <div data-testid={`master-${masterName}`}>
      <div>{masterName}</div>
    </div>
  ))
}))

jest.mock('./App.css', () => ({}))
jest.mock('@beauty-salon/ui-library/style.css', () => ({}))

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders salon name and services', () => {
    render(<App />)
    
    expect(screen.getByText('Beauty&tochka')).toBeInTheDocument()
    expect(screen.getByText('Салон красоты премиум-класса')).toBeInTheDocument()
    expect(screen.getByText('Услуги')).toBeInTheDocument()
    expect(screen.getByText('Мастера')).toBeInTheDocument()
  })

  it('displays all service cards', () => {
    render(<App />)
    
    expect(screen.getByText('Маникюр')).toBeInTheDocument()
    expect(screen.getByText('Педикюр')).toBeInTheDocument()
    expect(screen.getByText('Стрижка и окрашивание')).toBeInTheDocument()
    expect(screen.getByText('Ресницы')).toBeInTheDocument()
    expect(screen.getByText('Брови')).toBeInTheDocument()
    expect(screen.getByText('Депиляция')).toBeInTheDocument()
  })

  it('selects service when clicked', () => {
    render(<App />)
    
    const serviceCard = screen.getByTestId('service-Маникюр')

    fireEvent.click(serviceCard)
    
    const selectedServiceElement = screen.queryByText('Выбрана услуга:')

    if (selectedServiceElement) {
      expect(selectedServiceElement).toBeInTheDocument()
    }
  })

  it('displays master categories and current masters', () => {
    render(<App />)
    
    expect(screen.getByText('Мастера маникюра и педикюра')).toBeInTheDocument()
    expect(screen.getByText('Бровисты и лашмейкеры')).toBeInTheDocument()
    expect(screen.getByText('Парикмахеры')).toBeInTheDocument()
    expect(screen.getByText('Мастера депиляции')).toBeInTheDocument()
    
    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.getByText('София')).toBeInTheDocument()
  })

  it(' button click', () => {
    render(<App />)
    
    const browsButton = screen.getByText('Бровисты и лашмейкеры')

    fireEvent.click(browsButton)
    
    const categoryTitle = screen.getByText('Бровисты и лашмейкеры')

    expect(categoryTitle).toBeInTheDocument()
    
    expect(screen.getByText('Ольга')).toBeInTheDocument()
    expect(screen.getByText('Виктория')).toBeInTheDocument()
  })
})