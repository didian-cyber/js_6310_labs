import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { 
  BookingStateMachine, 
  mainCategories,
  services,
  hairSubcategories,
  masters, 
  formatPrice, 
  generateBookingId,
  getServicePrice,
  getDisplayPrice,
  getMastersByService,
  formatDuration,
  getAvailableMonths,
  getAvailableDays,
  getAvailableTimes,  
  formatDateDisplay,
  isTimeAvailable
} from './utils/index.js';

config();

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error('BOT_TOKEN is required in .env file');
}

const bot = new TelegramBot(token, { polling: true });
const stateMachine = new BookingStateMachine();

const appointments = [];

function formatAppointmentDate(year, month, day, time) {
  const date = new Date(year, month - 1, day, ...time.split(':').map(Number));
  return date.toISOString();
}

function getMasterAppointments(masterId, year, month, day) {
  return appointments.filter(app => {
    if (app.masterId !== masterId || app.status !== 'Запись подтверждена!✅') return false;
    
    const appointmentDate = new Date(app.date);
    return appointmentDate.getFullYear() === year &&
           appointmentDate.getMonth() + 1 === month &&
           appointmentDate.getDate() === day;
  });
}

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    '✨ Добро пожаловать в салон красоты BeautyBooker! ✨\n\nВыберите действие:\n/book - Записаться на услугу\n/services - Посмотреть услуги\n/history - История посещений\n\nМы поможем вам стать еще красивее! 💅',
    {
      reply_markup: {
        keyboard: [
          [{ text: '📅 Записаться (/book)' }],
          [{ text: '💅 Услуги (/services)' }, { text: '📊 История (/history)' }]
        ],
        resize_keyboard: true
      }
    }
  );
});

// Команда /book 
bot.onText(/\/book/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  stateMachine.setState(userId, 'selecting_main_category');
  
  const categoriesKeyboard = mainCategories.map(category => ([
    {
      text: category.name,
      callback_data: `main_category_${category.id}`
    }
  ]));

  bot.sendMessage(chatId, '🎨 Выберите категорию услуг:', {
    reply_markup: {
      inline_keyboard: categoriesKeyboard
    }
  });
});

// Команда /services
bot.onText(/\/services/, (msg) => {
  const chatId = msg.chat.id;
  
  let servicesText = '💅 Все наши услуги:\n\n';
  
  mainCategories.forEach(category => {
    servicesText += `**${category.name}**\n`;
    
    if (category.id === 'hair') {
      hairSubcategories.forEach(subCat => {
        const subServices = services[subCat.id] || [];
        subServices.forEach(service => {
          servicesText += `• ${service.name} - ${getDisplayPrice(service)} | ${formatDuration(service.duration)}\n`;
        });
      });
    } else {
      const categoryServices = services[category.id] || [];
      categoryServices.forEach(service => {
        servicesText += `• ${service.name} - ${getDisplayPrice(service)} | ${formatDuration(service.duration)}\n`;
      });
    }
    servicesText += '\n';
  });

  servicesText += '\nДля записи используйте команду /book';

  bot.sendMessage(chatId, servicesText);
});

// Команда /history
bot.onText(/\/history/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const userHistory = appointments.filter(app => app.userId === userId);
  
  if (userHistory.length === 0) {
    bot.sendMessage(chatId, '📊 У вас пока нет записей. Запишитесь на первую услугу с помощью /book');
    return;
  }
  
  const historyText = userHistory.map((app, index) => {
    const appointmentDate = new Date(app.date);
    const formattedDate = appointmentDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `📅 Запись ${index + 1}:
    Услуга: ${app.serviceName}
    Мастер: ${app.masterName}
    Дата: ${formattedDate}
    Время: ${formattedTime}
    Стоимость: ${formatPrice(app.price)}
    Статус: ${app.status}`;
  }).join('\n\n');


  let promotionMessage = '';
  const visitCount = userHistory.length;
  
  if (visitCount === 1) {
    promotionMessage = '\n\n🎉 **ВАША ПЕРВАЯ АКЦИЯ!**\nПриведите подругу и получите 20% скидку на следующую услугу!\n\nПросто назовите код: BEAUTY20';
  } else if (visitCount === 3) {
    promotionMessage = '\n\n🎁 **ВЫ ПОСТОЯННЫЙ КЛИЕНТ!**\nЗа 3 посещения вы получаете:\n• 15% скидку на следующую услугу\n• Бесплатную консультацию стилиста\n\nКод скидки: LOYAL15';
  }
  const fullMessage = `📊 Ваша история посещений:\n\n${historyText}${promotionMessage}\n\nСпасибо, что выбираете нас! 💖`;

  bot.sendMessage(chatId, fullMessage);
});

// Обработка callback 
bot.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;


  try {
    // Выбор категории услуг
    if (data.startsWith('main_category_')) {
      const categoryId = data.split('_')[2];
      stateMachine.updateData(userId, { mainCategory: categoryId });

      
      if (categoryId === 'hair') {
        stateMachine.setState(userId, 'selecting_hair_subcategory');
        const subcategoriesKeyboard = hairSubcategories.map(subCat => ([
          {
            text: subCat.name,
            callback_data: `hair_subcategory_${subCat.id}`
          }
        ]));
        
        await bot.editMessageText(
          '💇‍♀️ Выберите тип услуги для волос:',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: { inline_keyboard: subcategoriesKeyboard }
          }
        );
      } else {
        stateMachine.setState(userId, 'selecting_service');
        const categoryServices = services[categoryId] || [];
        const servicesKeyboard = categoryServices.map(service => ([
          {
            text: `${service.name} - ${getDisplayPrice(service)}`,
            callback_data: `service_${service.id}`
          }
        ]));
        
        await bot.editMessageText(
          'Выберите услугу:',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: { inline_keyboard: servicesKeyboard }
          }
        );
      }
    }

    // Выбор подкатегории волос
    else if (data.startsWith('hair_subcategory_')) {
      const subcategoryId = data.split('_')[2];
      
      stateMachine.updateData(userId, { hairSubcategory: subcategoryId });
      stateMachine.setState(userId, 'selecting_service');
      
      const subcategoryServices = services[subcategoryId] || [];
      
      if (subcategoryServices.length === 0) {
        await bot.editMessageText(
          '❌ В выбранной категории пока нет доступных услуг.',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id
          }
        );
        return;
      }
      
      const servicesKeyboard = subcategoryServices.map(service => ([
        {
          text: `${service.name} - ${getDisplayPrice(service)}`,
          callback_data: `service_${service.id}`
        }
      ]));
      
      servicesKeyboard.push([{
        text: '⬅️ Назад',
        callback_data: 'back_to_hair_types'
      }]);
      
      const subcategoryName = hairSubcategories.find(sc => sc.id === subcategoryId)?.name || 'Услуги';
      
      await bot.editMessageText(
        `💇‍♀️ ${subcategoryName}:\n\nВыберите услугу:`,
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: servicesKeyboard }
        }
      );
    }
    
    else if (data === 'back_to_hair_types') {
      stateMachine.setState(userId, 'selecting_hair_subcategory');
      
      const subcategoriesKeyboard = hairSubcategories.map(subCat => ([
        {
          text: subCat.name,
          callback_data: `hair_subcategory_${subCat.id}`
        }
      ]));
      
      await bot.editMessageText(
        '💇‍♀️ Выберите тип услуги для волос:',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: subcategoriesKeyboard }
        }
      );
    }
    
    // Выбор услуги
    else if (data.startsWith('service_')) {
      const serviceId = data.replace('service_', '');
      
      let service = null;
      let foundInCategory = null;
      
      for (const categoryKey in services) {
        const categoryServices = services[categoryKey];
        
        const foundService = categoryServices.find(s => s.id === serviceId);
        
        if (foundService) {
          service = foundService;
          foundInCategory = categoryKey;
          break;
        }
      }
      
      if (!service) {
        await bot.editMessageText(
          '❌ Услуга не найдена. Пожалуйста, начните заново с команды /book',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id
          }
        );
        return;
      }
      
      stateMachine.updateData(userId, { 
        serviceId: service.id,
        serviceName: service.name,
        serviceCategory: service.category,
        serviceDuration: service.duration,
        serviceBasePrice: service.basePrice,
        serviceTopPrice: service.topMasterPrice
      });
      stateMachine.setState(userId, 'selecting_master');
      
      const availableMasters = getMastersByService(service.category);
      
      if (availableMasters.length === 0) {
        await bot.editMessageText(
          '❌ К сожалению, нет доступных мастеров для этой услуги.',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id
          }
        );
        return;
      }
      
      const mastersKeyboard = availableMasters.map(master => {
        const price = getServicePrice(service, master);
        const masterType = master.isTopMaster ? '👑 Топ-мастер' : '👩‍💼 Обычный мастер';
        return [{
          text: `${master.name} - ${price}₽ (${masterType})`,
          callback_data: `master_${master.id}`
        }];
      });
      
      // Кнопка "Назад"
      mastersKeyboard.push([{
        text: '⬅️ Назад к услугам',
        callback_data: `back_to_services_${foundInCategory || service.category}`
      }]);
      
      await bot.editMessageText(
        `✅ Вы выбрали: ${service.name}\n\n` +
        `⏱ Длительность: ${formatDuration(service.duration)}\n` +
        `💰 Стоимость: ${getDisplayPrice(service)}\n\n` +
        'Выберите мастера:',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: mastersKeyboard }
        }
      );
    }

    // Кнопка "Назад к услугам"
    else if (data.startsWith('back_to_services_')) {
      const categoryId = data.replace('back_to_services_', '');
      
      stateMachine.setState(userId, 'selecting_service');
      
      if (categoryId === 'hair') {
        const subcategoriesKeyboard = hairSubcategories.map(subCat => ([
          {
            text: subCat.name,
            callback_data: `hair_subcategory_${subCat.id}`
          }
        ]));
        
        await bot.editMessageText(
          '💇‍♀️ Выберите тип услуги для волос:',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: { inline_keyboard: subcategoriesKeyboard }
          }
        );
      } else {
        const categoryServices = services[categoryId] || [];
        const servicesKeyboard = categoryServices.map(service => ([
          {
            text: `${service.name} - ${getDisplayPrice(service)}`,
            callback_data: `service_${service.id}`
          }
        ]));
        
        await bot.editMessageText(
          'Выберите услугу:',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: { inline_keyboard: servicesKeyboard }
          }
        );
      }
    }
    
    // Выбор мастера 
    else if (data.startsWith('master_')) {
      const masterId = parseInt(data.split('_')[1]);      
      const master = masters.find(m => m.id === masterId);
      const userData = stateMachine.getUserData(userId);
      
      if (master && userData.serviceId) {
        let service = null;
        for (const catServices of Object.values(services)) {
          const foundService = catServices.find(s => s.id === userData.serviceId);
          if (foundService) {
            service = foundService;
            break;
          }
        }
                
        if (service) {
          const servicePrice = getServicePrice(service, master);
          
          stateMachine.updateData(userId, { 
            masterId: master.id, 
            masterName: master.name,
            servicePrice: servicePrice
          });
          
          //Выбор месяца
          stateMachine.setState(userId, 'selecting_month');
          
          const availableMonths = getAvailableMonths();
          const monthsKeyboard = availableMonths.map(month => ([
            {
              text: month.name,
              callback_data: `month_${month.id}`
            }
          ]));
          
          //Добавляем кнопку "Назад к мастерам"
          monthsKeyboard.push([{
            text: '⬅️ Назад к мастерам',
            callback_data: `back_to_masters_${userData.serviceCategory}`
          }]);
          
          await bot.editMessageText(
            `Отлично! Мастер: ${master.name}\n` +
            `Услуга: ${userData.serviceName}\n` +
            `Стоимость: ${servicePrice}₽\n\n` +
            'Выберите месяц:',
            {
              chat_id: chatId,
              message_id: callbackQuery.message.message_id,
              reply_markup: { inline_keyboard: monthsKeyboard }
            }
          );
        }
      }
    }

    else if (data.startsWith('back_to_masters_')) {
      const serviceCategory = data.replace('back_to_masters_', '');
      
      const userData = stateMachine.getUserData(userId);
      
      let service = null;
      for (const catServices of Object.values(services)) {
        const foundService = catServices.find(s => s.id === userData.serviceId);
        if (foundService) {
          service = foundService;
          break;
        }
      }
      
      if (service) {
        stateMachine.setState(userId, 'selecting_master');
        
        const availableMasters = getMastersByService(service.category);
        const mastersKeyboard = availableMasters.map(master => {
          const price = getServicePrice(service, master);
          const masterType = master.isTopMaster ? '👑 Топ-мастер' : '👩‍💼 Обычный мастер';
          return [{
            text: `${master.name} - ${price}₽ (${masterType})`,
            callback_data: `master_${master.id}`
          }];
        });
        
        // Добавляем кнопку "Назад к услугам"
        mastersKeyboard.push([{
          text: '⬅️ Назад к услугам',
          callback_data: `back_to_services_${serviceCategory}`
        }]);
        
        await bot.editMessageText(
          `✅ Вы выбрали: ${service.name}\n\n` +
          `⏱ Длительность: ${formatDuration(service.duration)}\n` +
          `💰 Стоимость: ${getDisplayPrice(service)}\n\n` +
          'Выберите мастера:',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: { inline_keyboard: mastersKeyboard }
          }
        );
      }
    }
    
    // Выбор месяца
    else if (data.startsWith('month_')) {
      const monthId = data.replace('month_', '');
      const [year, month] = monthId.split('-').map(Number);
            
      stateMachine.updateData(userId, { selectedYear: year, selectedMonth: month });
      stateMachine.setState(userId, 'selecting_day');
      
      const availableDays = getAvailableDays(year, month);
      
      if (availableDays.length === 0) {
        await bot.editMessageText(
          '❌ В выбранном месяце нет доступных дней для записи.\n\nПожалуйста, выберите другой месяц.',
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
              inline_keyboard: [[
                {
                  text: '⬅️ Назад к месяцам',
                  callback_data: 'back_to_months'
                }
              ]]
            }
          }
        );
        return;
      }
      
      const daysKeyboard = availableDays.map(day => ([
        {
          text: day.name,
          callback_data: `day_${day.id}`
        }
      ]));
      
      // Добавляем кнопку "Назад к месяцам"
      daysKeyboard.push([{
        text: '⬅️ Назад к месяцам',
        callback_data: 'back_to_months'
      }]);
      
      await bot.editMessageText(
        'Выберите день:',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: daysKeyboard }
        }
      );
    }
    
    else if (data === 'back_to_months') {
      
      const userData = stateMachine.getUserData(userId);
      stateMachine.setState(userId, 'selecting_month');
      
      const availableMonths = getAvailableMonths();
      const monthsKeyboard = availableMonths.map(month => ([
        {
          text: month.name,
          callback_data: `month_${month.id}`
        }
      ]));
      
      // Добавляем кнопку "Назад к мастерам"
      monthsKeyboard.push([{
        text: '⬅️ Назад к мастерам',
        callback_data: `back_to_masters_${userData.serviceCategory}`
      }]);
      
      await bot.editMessageText(
        'Выберите месяц:',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: monthsKeyboard }
        }
      );
    }
    
    // Выбор дня
    else if (data.startsWith('day_')) {
      const dayId = data.replace('day_', '');
      const [year, month, day] = dayId.split('-').map(Number);
            
      const userData = stateMachine.getUserData(userId);
      
      stateMachine.updateData(userId, { selectedDay: day, selectedDate: dayId });
      stateMachine.setState(userId, 'selecting_time');
      
      // Доступное время с учетом занятости мастера
      const masterAppointments = getMasterAppointments(userData.masterId, year, month, day);
      const availableTimes = getAvailableTimes(
        year, month, day, 
        userData.masterId, 
        userData.serviceDuration, 
        masterAppointments
      );
      
      if (availableTimes.length === 0) {
        await bot.editMessageText(
          `❌ На ${formatDateDisplay(dayId)} у мастера ${userData.masterName} нет свободного времени.\n\nПожалуйста, выберите другой день.`,
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
              inline_keyboard: [[
                {
                  text: '⬅️ Назад к дням',
                  callback_data: `back_to_days_${year}-${month}`
                }
              ]]
            }
          }
        );
        return;
      }
      
      const timeKeyboard = availableTimes.map(time => ([
        {
          text: `🕐 ${time}`,
          callback_data: `time_${time}`
        }
      ]));
      
      // Добавляем кнопку "Назад к дням"
      timeKeyboard.push([{
        text: '⬅️ Назад к дням',
        callback_data: `back_to_days_${year}-${month}`
      }]);
      
      const formattedDate = formatDateDisplay(dayId);
      
      await bot.editMessageText(
        `Выберите время на ${formattedDate}:\n\n` +
        '🟢 - свободное время\n' +
        `⏱ Длительность услуги: ${formatDuration(userData.serviceDuration)}`,
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: timeKeyboard }
        }
      );
    }

    else if (data.startsWith('back_to_days_')) {
      const monthId = data.replace('back_to_days_', '');
      const [year, month] = monthId.split('-').map(Number);
            
      stateMachine.setState(userId, 'selecting_day');
      
      const availableDays = getAvailableDays(year, month);
      const daysKeyboard = availableDays.map(day => ([
        {
          text: day.name,
          callback_data: `day_${day.id}`
        }
      ]));
      
      daysKeyboard.push([{
        text: '⬅️ Назад к месяцам',
        callback_data: 'back_to_months'
      }]);
      
      await bot.editMessageText(
        'Выберите день:',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: { inline_keyboard: daysKeyboard }
        }
      );
    }

    //Выбор времени
    else if (data.startsWith('time_')) {
      const time = data.split('_')[1];
      const userData = stateMachine.getUserData(userId);
      const [year, month, day] = userData.selectedDate.split('-').map(Number);
      
      const isAvailable = isTimeAvailable(
        year, month, day, time, 
        userData.masterId, 
        userData.serviceDuration, 
        appointments
      );
      
      if (!isAvailable) {
        await bot.editMessageText(
          `❌ Время ${time} уже занято. Пожалуйста, выберите другое время.`,
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
              inline_keyboard: [[
                {
                  text: '⬅️ Назад к выбору времени',
                  callback_data: `back_to_days_${year}-${month}`
                }
              ]]
            }
          }
        );
        return;
      }
      
      const formattedDate = formatDateDisplay(userData.selectedDate);
      
      stateMachine.updateData(userId, { time });
      stateMachine.setState(userId, 'confirming');
      
      await bot.editMessageText(
        '📋 Подтвердите запись:\n\n' +
        `Услуга: ${userData.serviceName}\n` +
        `Мастер: ${userData.masterName}\n` +
        `Дата: ${formattedDate}\n` +
        `Время: ${time}\n` +
        `Длительность: ${formatDuration(userData.serviceDuration)}\n` +
        `Стоимость: ${formatPrice(userData.servicePrice)}\n\n` +
        'Всё верно?',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Подтвердить', callback_data: 'confirm_yes' },
                { text: '❌ Отменить', callback_data: 'confirm_no' }
              ]
            ]
          }
        }
      );
    }


    // Подтверждение записи
    else if (data === 'confirm_yes') {
      const userData = stateMachine.getUserData(userId);
      const bookingId = generateBookingId();
      
      const [year, month, day] = userData.selectedDate.split('-').map(Number);
      const appointmentDateTime = formatAppointmentDate(year, month, day, userData.time);
      
      // Форматирование даты
      const appointmentDate = new Date(appointmentDateTime);
      const formattedDate = appointmentDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const formattedTime = appointmentDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const isAvailable = isTimeAvailable(
        year, month, day, userData.time, 
        userData.masterId, 
        userData.serviceDuration, 
        appointments
      );
      
      if (!isAvailable) {
        await bot.editMessageText(
          `❌ К сожалению, время ${userData.time} уже занято другим клиентом.\n\nПожалуйста, начните запись заново.`,
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id
          }
        );
        stateMachine.resetState(userId);
        return;
      }
      
      const appointment = {
        id: bookingId,
        userId,
        serviceId: userData.serviceId,
        serviceName: userData.serviceName,
        masterId: userData.masterId,
        masterName: userData.masterName,
        date: appointmentDateTime,
        dateDisplay: `${formattedDate}, ${formattedTime}`, 
        price: userData.servicePrice,
        duration: userData.serviceDuration,
        status: 'Запись подтверждена!✅',
        createdAt: new Date().toISOString()
      };
      
      appointments.push(appointment);
      stateMachine.resetState(userId);
      
      await bot.editMessageText(
        '🎉 Запись подтверждена!\n\n' +
        `Номер записи: ${bookingId}\n` +
        `Услуга: ${userData.serviceName}\n` +
        `Мастер: ${userData.masterName}\n` +
        `Дата: ${formattedDate}\n` +
        `Время: ${formattedTime}\n` +
        `Длительность: ${formatDuration(userData.serviceDuration)}\n` +
        `Стоимость: ${formatPrice(userData.servicePrice)}\n\n` +
        'Ждём вас в салоне! 💖',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id
        }
      );
    }
    
    // Отмена записи
    else if (data === 'confirm_no') {
      stateMachine.resetState(userId);
      await bot.editMessageText(
        'Запись отменена. Если передумаете - используйте /book 😊',
        {
          chat_id: chatId,
          message_id: callbackQuery.message.message_id
        }
      );
    }
    
    await bot.answerCallbackQuery(callbackQuery.id);
  } catch (error) {
    process.stderr.write(`Callback error: ${error.message}\n`);
    await bot.answerCallbackQuery(callbackQuery.id, { text: 'Произошла ошибка' });
  }
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    
    if (msg.text.includes('Записаться')) {
      bot.sendMessage(chatId, 'Используйте команду /book для записи на услугу');
    } else if (msg.text.includes('Услуги')) {
      bot.sendMessage(chatId, 'Используйте команду /services для просмотра услуг');
    } else if (msg.text.includes('История')) {
      bot.sendMessage(chatId, 'Используйте команду /history для просмотра истории');
    }
  }
});

// Обработка ошибок
bot.on('error', (error) => {
  process.stderr.write(`Bot error: ${error.message}\n`);
});

process.stdout.write('🤖 BeautyBooker Bot started successfully!\n');

export default bot;