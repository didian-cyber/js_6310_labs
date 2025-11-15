import { ServiceCard, MasterPhotoCard } from './index'

describe('Library Exports', () => {
  it('should export ServiceCard component', () => {
    expect(ServiceCard).toBeDefined()
    expect(typeof ServiceCard).toBe('function')
  })

  it('should export MasterPhotoCard component', () => {
    expect(MasterPhotoCard).toBeDefined()
    expect(typeof MasterPhotoCard).toBe('function')
  })

  it('should have correct component names', () => {
    expect(ServiceCard.displayName || ServiceCard.name).toBeDefined()
    expect(MasterPhotoCard.displayName || MasterPhotoCard.name).toBeDefined()
  })
})