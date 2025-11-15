import { useState } from 'react'

import { MasterPhotoCard, ServiceCard } from '@beauty-salon/ui-library'
import './App.css'

interface Service {
  backgroundImage: string
  title: string
  description: string
}

interface Master {
  masterPhoto: string
  workPhotos: string[]
  masterName: string
  masterPosition: string
  experience: string
}

interface MasterCategory {
  id: string
  name: string
}

type MasterCategoryKey = 'nails' | 'brows' | 'hair' | 'depilation'

function App() {
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedMasterCategory, setSelectedMasterCategory] = useState<MasterCategoryKey>('nails')

  const services: Service[] = [
    {
      backgroundImage: '/images/manicure.png',
      title: 'Маникюр',
      description: 'Создаем ногти, которые подчеркнут вашу индивидуальность, безупречно'
    },
    {
      backgroundImage: '/images/pedicure.png',
      title: 'Педикюр',
      description: 'Мы уделяем особое внимание стерильности и безопасности процедур'
    },
    {
      backgroundImage: '/images/hair.png',
      title: 'Стрижка и окрашивание',
      description: 'Подберём идеальный вариант, который подчеркнёт вашу индивидуальность'
    },
    {
      backgroundImage: '/images/lashes.png',
      title: 'Ресницы',
      description: 'Наращивание, ламинирование, окрашивание и коррекция ресниц'
    },
    {
      backgroundImage: '/images/brows.png',
      title: 'Брови',
      description: 'Современные техники и качественные материалы'
    },
    {
      backgroundImage: '/images/depilation.png',
      title: 'Депиляция',
      description: 'Мы предлагаем эффективные и безопасные методы удаления нежелательных волос'
    }
  ]

  const masterCategories: MasterCategory[] = [
    { id: 'nails', name: 'Мастера маникюра и педикюра' },
    { id: 'brows', name: 'Бровисты и лашмейкеры' },
    { id: 'hair', name: 'Парикмахеры' },
    { id: 'depilation', name: 'Мастера депиляции' }
  ]

  const masters: Record<MasterCategoryKey, Master[]> = {
    nails: [
      {
        masterPhoto: '/images/nails_master.png',
        workPhotos: [
          '/images/masterManicure/m1.1.png',
          '/images/masterManicure/m1.2.png',
          '/images/masterManicure/m1.3.png',
          '/images/masterManicure/m1.4.png'
        ],
        masterName: 'Мария',
        masterPosition: 'Мастер ногтевого сервиса',
        experience: 'Опыт работы: с 2022 года'
      },
      {
        masterPhoto: '/images/nails_top_master.png',
        workPhotos: [
          '/images/masterManicure/m2.1.png',
          '/images/masterManicure/m2.2.png',
          '/images/masterManicure/m2.3.png',
          '/images/masterManicure/m2.4.png'
        ],
        masterName: 'София',
        masterPosition: 'Топ мастер ногтевого сервиса',
        experience: 'Опыт работы: с 2019 года'
      }
    ],
    brows: [
      {
        masterPhoto: '/images/browMaster.png',
        workPhotos: [
          '/images/masterBrows/b1.1.png',
          '/images/masterBrows/b1.2.png',
          '/images/masterBrows/b1.3.png'
        ],
        masterName: 'Ольга',
        masterPosition: 'Мастер бровист и мастер по ламинированию ресниц',
        experience: 'Опыт работы: с 2021 года'
      },
      {
        masterPhoto: '/images/browTopMaster.png',
        workPhotos: [
          '/images/masterBrows/b2.1.png',
          '/images/masterBrows/b2.2.png',
          '/images/masterBrows/b2.3.png'
        ],
        masterName: 'Виктория',
        masterPosition: 'Эксперт по ламинированию и наращиванию ресниц',
        experience: 'Опыт работы: с 2018 года'
      }
    ],
    hair: [
      {
        masterPhoto: '/images/hairMaster.png',
        workPhotos: [
          '/images/masterHair/m1.1.png',
          '/images/masterHair/m1.2.png'
        ],
        masterName: 'Анна',
        masterPosition: 'Стилист по волосам',
        experience: 'Опыт работы: с 2020 года'
      },
      {
        masterPhoto: '/images/haitTopMaster.png',
        workPhotos: [
          '/images/masterHair/m2.1.png',
          '/images/masterHair/m2.2.png',
          '/images/masterHair/m2.3.png'
        ],
        masterName: 'Елена',
        masterPosition: 'Топ-стилист',
        experience: 'Опыт работы: с 2017 года'
      }
    ],
    depilation: [
      {
        masterPhoto: '/images/depilationMaster.png',
        workPhotos: [],
        masterName: 'Ирина',
        masterPosition: 'Мастер депиляции',
        experience: 'Опыт работы: с 2021 года'
      },
      {
        masterPhoto: '/images/depilationTopMaster.png',
        workPhotos: [],
        masterName: 'Наталья',
        masterPosition: 'Специалист по лазерной эпиляции',
        experience: 'Опыт работы: с 2020 года'
      }
    ]
  }

  const handleServiceClick = (serviceTitle: string) => {
    setSelectedService(serviceTitle)
  }

  //мастера для выбранной категории
  const currentMasters = masters[selectedMasterCategory]

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">Beauty&tochka</h1>
          <p className="app-subtitle">Салон красоты премиум-класса</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="section">
            <h2 className="section-title">Услуги</h2>
            <div className="services-grid">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  backgroundImage={service.backgroundImage}
                  title={service.title}
                  description={service.description}
                  onClick={() => handleServiceClick(service.title)}
                  isSelected={selectedService === service.title}
                />
              ))}
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Мастера</h2>
            
            <div className="master-categories">
              {masterCategories.map((category) => (
                <button
                  key={category.id}
                  className={`master-category-btn ${selectedMasterCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedMasterCategory(category.id as MasterCategoryKey)}
                  type="button"
                >
                  {category.name}
                </button>
              ))}
            </div>

            <h3 className="master-category-title">
              {masterCategories.find(cat => cat.id === selectedMasterCategory)?.name}:
            </h3>

            <div className="masters-grid">
              {currentMasters.map((master, index) => (
                <div key={index} className="master-card">
                  <MasterPhotoCard
                    masterPhoto={master.masterPhoto}
                    workPhotos={master.workPhotos}
                  />
                  <div className="master-info">
                    <h4 className="master-name">{master.masterName}</h4>
                    <p className="master-position">{master.masterPosition}</p>
                    <p className="master-experience">{master.experience}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-text">© Студия красоты "Beauty&tochka"</p>
            <p className="footer-text">г. Казань, ул. Пушкина, д. Колотушкина</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App