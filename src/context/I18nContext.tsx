import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'kz' | 'ru' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Auth
    'login.title': 'Вход в личный кабинет',
    'login.subtitle': 'Введите номер телефона для доступа к вашим счётчикам',
    'login.phone_label': 'Номер телефона',
    'login.button': 'Войти',
    'login.loading': 'Вход...',
    'login.terms': 'Регистрируясь, вы принимаете условия использования сервиса',
    
    // Sidebar
    'menu.title': 'Меню',
    'menu.meters': 'Лицевые счета',
    'menu.services': 'Услуги',
    'menu.notifications': 'Уведомления',
    'menu.profile': 'Профиль',
    'menu.logout': 'Выйти',
    'menu.client_type': 'Частный клиент',

    // Meters Tab
    'meters.title': 'Лицевые счета',
    'meters.empty': 'Нет привязанных лицевых счетов',
    'meters.add_first': 'Добавить первый',
    
    // Add Meter
    'add.title': 'Добавить лицевой счет',
    'add.subtitle': 'Введите номер лицевого счета или серийный номер прибора для поиска',
    'add.search_placeholder': 'Например: 10743471',
    'add.button_search': 'ПОКАЗАТЬ СТАТУС',
    'add.button_add': 'Добавить в кабинет',
    'add.found': 'Прибор найден!',
    'add.error': 'Прибор не найден',
    
    'add.not_found_title': 'Не удалось найти прибор?',
    'add.not_found_desc': 'Возможно, данные еще не загружены. Вы можете оставить заявку или связаться с поддержкой.',
    'add.leave_request': 'Оставить заявку',
    'add.contact_support': 'Написать в WhatsApp',
    
    // Services
    'services.title': 'Услуги',
    'services.select': 'Выберите услугу',
    'services.verification': 'Поверка счётчика',
    'services.verification_desc': 'Заказать официальную поверку',
    'services.repair': 'Ремонт / Замена',
    'services.repair_desc': 'Вызов мастера на дом',
    'services.seal': 'Опломбировка',
    'services.seal_desc': 'Заявка на установку пломбы',
    'services.consultation': 'Консультация',
    'services.consultation_desc': 'Обратный звонок специалиста',
    
    // Notifications
    'notif.title': 'Уведомления',
    'notif.empty': 'Нет новых уведомлений',
    'notif.status': 'Статус',
    'notif.new': 'Обрабатывается',
    'notif.processing': 'В работе',
    'notif.completed': 'Выполнено',
    'notif.cancelled': 'Отменено',

    // Profile
    'profile.title': 'Профиль',
    'profile.stats': 'Статистика',
    'profile.meters_count': 'Счётчиков',
    'profile.requests_count': 'Заявок',
    'profile.add_email': 'Добавить email',
    'profile.logout_button': 'Выйти из приложения',

    // Common
    'common.delete_confirm': 'Удалить этот счётчик?',
    'common.success_request': 'Заявка успешно отправлена! Мы получили уведомление в Telegram и на почту.',
    'common.error': 'Ошибка',
    'common.send': 'Отправить заявку',
    'common.comment': 'Комментарий / Детали',
    'common.select_meter': 'Выберите прибор',
    'common.other_meter': 'Другой / Не из списка',

    // Meter Detail
    'detail.info': 'Информация о приборе',
    'detail.serial': 'Серийный номер',
    'detail.model': 'Модель',
    'detail.check_date': 'Дата поверки',
    'detail.not_specified': 'Не указана',
    'detail.diameter': 'Диаметр',
    'detail.address': 'Адрес установки',
    'detail.prev_reading': 'Предыдущее показание',
    'detail.consumption': 'Расход',
    'detail.current_reading_date': 'Дата текущего показания',
    'detail.current_reading': 'Текущее показание',
    'detail.submit_request': 'Подать заявку',
    'detail.history': 'История потребления',
    'detail.chart_title': 'График расхода',
    'detail.notif_check': 'Необходима поверка',
    'detail.notif_check_desc': 'Срок поверки вашего прибора истекает через 30 дней.',
    'detail.notif_offline': 'Нет связи с модемом',
    'detail.notif_offline_desc': 'Прибор не передает данные более 3 дней. Проверьте подключение.',
    'detail.no_notifs': 'Больше уведомлений нет',
    'detail.consumer': 'Физ.лицо',
    'detail.hot_water': 'Горячая вода (Ванная)',
    'detail.readings': 'Показания',
    'detail.notifications': 'Уведомления',

    // Header & Footer
    'header.cabinet': 'Кабинет',
    'header.login': 'Войти',
    'footer.contacts': 'Контакты',
    'footer.about': 'О компании',
    'footer.desc': 'Мы предоставляем современные решения для учёта ресурсов и диспетчеризации.',
    'footer.rights': 'Все права защищены.',
    'footer.made_with': 'Разработано с ❤️ для удобства жителей'
  },
  kz: {
    // Auth
    'login.title': 'Жеке кабинетке кіру',
    'login.subtitle': 'Есептегіштерге қол жеткізу үшін телефон нөмірін енгізіңіз',
    'login.phone_label': 'Телефон нөмірі',
    'login.button': 'Кіру',
    'login.loading': 'Кіру...',
    'login.terms': 'Тіркеле отырып, сіз қызмет көрсету шарттарын қабылдайсыз',

    // Sidebar
    'menu.title': 'Мәзір',
    'menu.meters': 'Дербес шоттар',
    'menu.services': 'Қызметтер',
    'menu.notifications': 'Хабарламалар',
    'menu.profile': 'Профиль',
    'menu.logout': 'Шығу',
    'menu.client_type': 'Жеке клиент',

    // Meters Tab
    'meters.title': 'Дербес шоттар',
    'meters.empty': 'Тіркелген дербес шоттар жоқ',
    'meters.add_first': 'Біріншісін қосу',

    // Add Meter
    'add.title': 'Дербес шотты қосу',
    'add.subtitle': 'Іздеу үшін дербес шот нөмірін немесе құрылғының сериялық нөмірін енгізіңіз',
    'add.search_placeholder': 'Мысалы: 10743471',
    'add.button_search': 'СТАТУСТЫ КӨРСЕТУ',
    'add.button_add': 'Кабинетке қосу',
    'add.found': 'Құрылғы табылды!',
    'add.error': 'Құрылғы табылмады',

    'add.not_found_title': 'Құрылғы табылмады ма?',
    'add.not_found_desc': 'Мүмкін деректер әлі жүктелмеген шығар. Сіз өтінім қалдыра аласыз немесе қолдау қызметіне хабарласа аласыз.',
    'add.leave_request': 'Өтінім қалдыру',
    'add.contact_support': 'WhatsApp-қа жазу',

    // Services
    'services.title': 'Қызметтер',
    'services.select': 'Қызметті таңдаңыз',
    'services.verification': 'Есептегішті тексеру',
    'services.verification_desc': 'Ресми тексеруге тапсырыс беру',
    'services.repair': 'Жөндеу / Ауыстыру',
    'services.repair_desc': 'Шеберді үйге шақыру',
    'services.seal': 'Пломбалау',
    'services.seal_desc': 'Пломба орнатуға өтінім',
    'services.consultation': 'Кеңес алу',
    'services.consultation_desc': 'Маманның кері қоңырауы',

    // Notifications
    'notif.title': 'Хабарламалар',
    'notif.empty': 'Жаңа хабарламалар жоқ',
    'notif.status': 'Статус',
    'notif.new': 'Өңделуде',
    'notif.processing': 'Жұмыста',
    'notif.completed': 'Орындалды',
    'notif.cancelled': 'Болдырылмады',

    // Profile
    'profile.title': 'Профиль',
    'profile.stats': 'Статистика',
    'profile.meters_count': 'Есептегіштер',
    'profile.requests_count': 'Өтінімдер',
    'profile.add_email': 'Email қосу',
    'profile.logout_button': 'Қосымшадан шығу',

    // Common
    'common.delete_confirm': 'Бұл есептегішті жою керек пе?',
    'common.success_request': 'Өтінім сәтті жіберілді! Біз Telegram және пошта арқылы хабарлама алдық.',
    'common.error': 'Қате',
    'common.send': 'Өтінім жіберу',
    'common.comment': 'Түсініктеме / Егжей-тегжейлер',
    'common.select_meter': 'Құрылғыны таңдаңыз',
    'common.other_meter': 'Басқа / Тізімнен емес',

    // Header & Footer
    'header.cabinet': 'Кабинет',
    'header.login': 'Кіру',
    'footer.contacts': 'Байланыс',
    'footer.about': 'Компания туралы',
    'footer.desc': 'Біз ресурстарды есепке алу және диспетчерлеу үшін заманауи шешімдерді ұсынамыз.',
    'footer.rights': 'Барлық құқықтар қорғалған.',
    'footer.made_with': 'Тұрғындарға ыңғайлы болу үшін ❤️ жасалған'
  },
  en: {
    // Auth
    'login.title': 'Login to Cabinet',
    'login.subtitle': 'Enter phone number to access your meters',
    'login.phone_label': 'Phone Number',
    'login.button': 'Login',
    'login.loading': 'Logging in...',
    'login.terms': 'By registering, you accept the terms of service',

    // Sidebar
    'menu.title': 'Menu',
    'menu.meters': 'Accounts',
    'menu.services': 'Services',
    'menu.notifications': 'Notifications',
    'menu.profile': 'Profile',
    'menu.logout': 'Logout',
    'menu.client_type': 'Private Client',

    // Meters Tab
    'meters.title': 'Accounts',
    'meters.empty': 'No linked accounts',
    'meters.add_first': 'Add First',

    // Add Meter
    'add.title': 'Add Account',
    'add.subtitle': 'Enter account number or device serial number to search',
    'add.search_placeholder': 'Example: 10743471',
    'add.button_search': 'SHOW STATUS',
    'add.button_add': 'Add to Cabinet',
    'add.found': 'Device found!',
    'add.error': 'Device not found',

    'add.not_found_title': 'Could not find device?',
    'add.not_found_desc': 'Data might not be loaded yet. You can leave a request or contact support.',
    'add.leave_request': 'Leave Request',
    'add.contact_support': 'Write to WhatsApp',

    // Services
    'services.title': 'Services',
    'services.select': 'Select Service',
    'services.verification': 'Meter Verification',
    'services.verification_desc': 'Order official verification',
    'services.repair': 'Repair / Replacement',
    'services.repair_desc': 'Call master to home',
    'services.seal': 'Sealing',
    'services.seal_desc': 'Request for seal installation',
    'services.consultation': 'Consultation',
    'services.consultation_desc': 'Request a call back',

    // Notifications
    'notif.title': 'Notifications',
    'notif.empty': 'No new notifications',
    'notif.status': 'Status',
    'notif.new': 'Processing',
    'notif.processing': 'In Progress',
    'notif.completed': 'Completed',
    'notif.cancelled': 'Cancelled',

    // Profile
    'profile.title': 'Profile',
    'profile.stats': 'Statistics',
    'profile.meters_count': 'Meters',
    'profile.requests_count': 'Requests',
    'profile.add_email': 'Add Email',
    'profile.logout_button': 'Logout from App',

    // Common
    'common.delete_confirm': 'Delete this meter?',
    'common.success_request': 'Request sent successfully! We received notification via Telegram and Email.',
    'common.error': 'Error',
    'common.send': 'Send Request',
    'common.comment': 'Comment / Details',
    'common.select_meter': 'Select Device',
    'common.other_meter': 'Other / Not in list',

    // Meter Detail
    'detail.info': 'Device Information',
    'detail.serial': 'Serial Number',
    'detail.model': 'Model',
    'detail.check_date': 'Verification Date',
    'detail.not_specified': 'Not specified',
    'detail.diameter': 'Diameter',
    'detail.address': 'Installation Address',
    'detail.prev_reading': 'Previous Reading',
    'detail.consumption': 'Consumption',
    'detail.current_reading_date': 'Current Reading Date',
    'detail.current_reading': 'Current Reading',
    'detail.submit_request': 'Submit Request',
    'detail.history': 'Consumption History',
    'detail.chart_title': 'Consumption Chart',
    'detail.notif_check': 'Verification Required',
    'detail.notif_check_desc': 'Your device verification expires in 30 days.',
    'detail.notif_offline': 'No Modem Connection',
    'detail.notif_offline_desc': 'Device has not sent data for over 3 days. Check connection.',
    'detail.no_notifs': 'No more notifications',
    'detail.consumer': 'Private Individual',
    'detail.hot_water': 'Hot Water (Bathroom)',
    'detail.readings': 'Readings',
    'detail.notifications': 'Notifications',

    // Header & Footer
    'header.cabinet': 'Cabinet',
    'header.login': 'Login',
    'footer.contacts': 'Contacts',
    'footer.about': 'About',
    'footer.desc': 'We provide modern solutions for resource metering and dispatching.',
    'footer.rights': 'All rights reserved.',
    'footer.made_with': 'Made with ❤️ for residents convenience'
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('metrix_language') as Language) || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('metrix_language', language);
  }, [language]);

  const t = (key: string) => {
    // Check if translation exists
    const translation = translations[language][key as keyof typeof translations['ru']];
    return translation || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
