import { PrismaClient, UserRole, LeadType, LeadStatus, HomeSectionKey } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Запуск сидирования базы данных...')

  // ============================================================
  // ПОЛЬЗОВАТЕЛИ
  // ============================================================
  const adminPassword = await bcryptjs.hash('Admin123!', 12)
  const managerPassword = await bcryptjs.hash('Manager123!', 12)
  const editorPassword = await bcryptjs.hash('Editor123!', 12)

  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@pivovarna.ru' },
    update: {},
    create: {
      email: 'admin@pivovarna.ru',
      name: 'Администратор',
      passwordHash: adminPassword,
      role: UserRole.SUPERADMIN,
      isActive: true,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@pivovarna.ru' },
    update: {},
    create: {
      email: 'manager@pivovarna.ru',
      name: 'Магомед Алиев',
      passwordHash: managerPassword,
      role: UserRole.MANAGER,
      isActive: true,
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@pivovarna.ru' },
    update: {},
    create: {
      email: 'editor@pivovarna.ru',
      name: 'Заира Гусейнова',
      passwordHash: editorPassword,
      role: UserRole.CONTENT_EDITOR,
      isActive: true,
    },
  })

  console.log('✅ Пользователи созданы')

  // ============================================================
  // НАСТРОЙКИ САЙТА
  // ============================================================
  await prisma.siteSettings.deleteMany()
  await prisma.siteSettings.create({
    data: {
      siteName: 'Дербентская пивоварня',
      siteTagline: 'Традиции вкуса с 2008 года',
      phone: '+7 (872) 250-35-00',
      phoneSecond: '+7 (928) 123-45-67',
      email: 'info@pivovarna.ru',
      address: 'Республика Дагестан, г. Дербент, ул. Промышленная, д. 12',
      workingHours: 'Пн–Пт: 9:00–18:00, Сб: 10:00–15:00',
      socialVk: 'https://vk.com/derbent_brewery',
      socialTelegram: 'https://t.me/derbent_brewery',
      footerText: '© 2024 Дербентская пивоварня. Все права защищены. Чрезмерное употребление алкоголя вредит вашему здоровью.',
    },
  })

  console.log('✅ Настройки сайта созданы')

  // ============================================================
  // SEO НАСТРОЙКИ
  // ============================================================
  await prisma.seoSettings.deleteMany()
  const seoPages = [
    {
      page: 'home',
      title: 'Дербентская пивоварня — Традиции вкуса с 2008 года',
      description: 'Дербентская пивоварня производит крафтовое пиво по традиционным рецептам. Более 20 сортов, натуральные ингредиенты, 15+ лет опыта.',
      keywords: 'дербентская пивоварня, крафтовое пиво, дагестанское пиво, купить пиво Дербент',
    },
    {
      page: 'products',
      title: 'Продукция — Дербентская пивоварня',
      description: 'Более 20 сортов крафтового пива: светлые, тёмные, нефильтрованные и сезонные сорта. Узнайте о каждом сорте подробнее.',
      keywords: 'сорта пива, светлое пиво, тёмное пиво, нефильтрованное пиво, крафт',
    },
    {
      page: 'about',
      title: 'О нас — Дербентская пивоварня',
      description: 'История Дербентской пивоварни, наша философия, производство и команда мастеров.',
      keywords: 'о пивоварне, история, производство пива Дербент',
    },
    {
      page: 'news',
      title: 'Новости — Дербентская пивоварня',
      description: 'Последние новости Дербентской пивоварни: новые сорта, события, акции и достижения.',
      keywords: 'новости пивоварни, акции, события',
    },
    {
      page: 'contacts',
      title: 'Контакты — Дербентская пивоварня',
      description: 'Свяжитесь с нами: адрес, телефон, email. Заказ пива оптом и в розницу.',
      keywords: 'контакты пивоварни, заказать пиво, оптовые поставки',
    },
  ]
  for (const seo of seoPages) {
    await prisma.seoSettings.create({ data: seo })
  }

  console.log('✅ SEO настройки созданы')

  // ============================================================
  // СЕКЦИИ ГЛАВНОЙ СТРАНИЦЫ
  // ============================================================
  await prisma.homeSection.deleteMany()
  const homeSections = [
    { key: HomeSectionKey.HERO, title: 'Главный баннер', isVisible: true, sortOrder: 0 },
    { key: HomeSectionKey.ABOUT_BRIEF, title: 'О пивоварне (коротко)', isVisible: true, sortOrder: 1 },
    { key: HomeSectionKey.STATS, title: 'Статистика', isVisible: true, sortOrder: 2 },
    { key: HomeSectionKey.PRODUCTS, title: 'Продукция', isVisible: true, sortOrder: 3 },
    { key: HomeSectionKey.TEAM_PERSON, title: 'Технолог', isVisible: true, sortOrder: 4 },
    { key: HomeSectionKey.NEWS, title: 'Новости', isVisible: true, sortOrder: 5 },
    { key: HomeSectionKey.GALLERY, title: 'Галерея', isVisible: true, sortOrder: 6 },
    { key: HomeSectionKey.PARTNERS, title: 'Партнёры', isVisible: false, sortOrder: 7 },
    { key: HomeSectionKey.CONTACTS_CTA, title: 'Призыв к действию (контакты)', isVisible: true, sortOrder: 8 },
  ]
  for (const section of homeSections) {
    await prisma.homeSection.create({ data: section })
  }

  console.log('✅ Секции главной страницы созданы')

  // ============================================================
  // HERO СЛАЙД
  // ============================================================
  await prisma.heroSlide.deleteMany()
  await prisma.heroSlide.create({
    data: {
      title: 'Пиво с характером Дербента',
      subtitle: 'Традиции вкуса с 2008 года',
      description: 'Мы варим пиво так, как это делали мастера древнего Дербента — с уважением к традициям и страстью к совершенству. Натуральные ингредиенты, авторские рецептуры, живой вкус.',
      imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1920&q=80',
      ctaText: 'Наша продукция',
      ctaUrl: '/products',
      ctaSecondaryText: 'О пивоварне',
      ctaSecondaryUrl: '/about',
      sortOrder: 0,
      isActive: true,
    },
  })

  console.log('✅ Hero слайд создан')

  // ============================================================
  // О КОМПАНИИ
  // ============================================================
  await prisma.companyInfo.deleteMany()
  await prisma.companyInfo.create({
    data: {
      foundedYear: 2008,
      historyTitle: 'История, вписанная в камень',
      historyText: `Дербентская пивоварня основана в 2008 году в стенах одного из древнейших городов России — Дербента, история которого насчитывает более 2000 лет. Наш основатель, Шамиль Мурадов, вернувшись из Германии, где изучал пивоварение в Мюнхене, решил создать производство, способное объединить баварские технологии с самобытным характером дагестанского края.

Первые варки были экспериментальными — мы пробовали местную воду с уникальным минеральным составом, тестировали местный хмель, искали правильный баланс между традиционными и современными рецептурами. Прошли годы, прежде чем мы нашли тот самый вкус, который сегодня знают и любят тысячи ценителей пива по всей России.

Сегодня Дербентская пивоварня — это современное производство мощностью 500 000 литров в год, штат из 45 сотрудников и более 20 сортов пива, каждый из которых является результатом многолетней работы нашей команды.`,
      historyImageUrl: 'https://images.unsplash.com/photo-1505075106905-fb052892c116?w=800&q=80',
      productionTitle: 'Производство без компромиссов',
      productionText: `Наше производство оснащено современным немецким оборудованием компании Ziemann — одного из лидеров мирового пивоваренного машиностроения. Варочный цех, цилиндроконические танки для брожения, линия фильтрации и розлива — всё это позволяет нам контролировать каждый этап производственного процесса.

Мы используем только натуральные ингредиенты: солод из лучших сортов ячменя, хмель из Чехии и Германии, горную воду с уникальным минеральным составом. Никаких консервантов, усилителей вкуса или искусственных добавок — только то, что создала природа.

Каждая партия пива проходит многоступенчатый контроль качества в нашей собственной лаборатории. Мы гордимся тем, что соответствуем требованиям ГОСТ и имеем все необходимые сертификаты.`,
      productionImageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
      philosophyTitle: 'Философия живого вкуса',
      philosophyText: `Мы верим, что настоящее пиво — живое. Оно меняется вместе со временами года, отражает характер места, где было создано, и несёт в себе историю людей, которые его варили.

Наша философия проста: делать то, что делаешь, с полной отдачей. Не гнаться за объёмами в ущерб качеству. Слушать своего потребителя. Не бояться экспериментировать. И всегда помнить, что за каждым бокалом нашего пива стоит труд десятков людей, которые вложили в него душу.

Дербент дал нам много: древние стены, горный воздух, минеральную воду и дух предпринимательства. Мы стараемся возвращать этот долг — создавая рабочие места, поддерживая местных поставщиков и рассказывая всему миру о прекрасном городе на берегу Каспийского моря.`,
      philosophyImageUrl: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=800&q=80',
      stats: {
        years: 15,
        sorts: 20,
        employees: 45,
        litersPerYear: 500000,
        regions: 12,
        awards: 8,
      },
    },
  })

  console.log('✅ Информация о компании создана')

  // ============================================================
  // КОМАНДА / ТЕХНОЛОГ
  // ============================================================
  await prisma.teamPerson.deleteMany()
  await prisma.teamPerson.create({
    data: {
      name: 'Алибек Магомедов',
      role: 'Главный технолог',
      bio: `Алибек Магомедов — признанный мастер пивоварения с более чем 25-летним опытом работы в отрасли. Родился в Дербенте в 1971 году, с детства был увлечён химией и биологией, что в итоге привело его к профессии технолога пищевого производства.

После окончания Московского государственного университета пищевых производств Алибек прошёл стажировку на ведущих пивоварнях Германии и Чехии, где усовершенствовал своё мастерство под руководством европейских мастеров-пивоваров. Его глубокие знания в области ферментации, химии солода и хмелеводства сделали его одним из наиболее востребованных специалистов отрасли.

В Дербентскую пивоварню Алибек пришёл одним из первых сотрудников — в 2009 году — и с тех пор является архитектором всей продуктовой линейки предприятия. Под его руководством разработано более 30 рецептур, 8 из которых удостоены наград российских и международных конкурсов.`,
      quote: 'Хорошее пиво нельзя торопить. Как и всё настоящее в жизни, оно требует времени, терпения и уважения к процессу.',
      quoteAuthor: 'Алибек Магомедов',
      experience: '25+ лет в пивоварении',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      achievements: [
        'Золотая медаль, фестиваль «Пивная Россия» 2022 — за сорт «Каспийское тёмное»',
        'Серебро, конкурс крафтового пива Москва 2021 — за нефильтрованное пшеничное',
        'Лауреат премии «Лучший технолог года» Союза пивоваров России 2019',
        'Разработчик запатентованной технологии холодного хмелевания «Дербент-метод»',
        'Автор книги «Кавказское пивоварение: традиции и современность»',
        'Победитель регионального конкурса «Вкус Дагестана» 2020, 2021, 2023',
      ],
      certifications: [
        'Диплом МГУПП, специальность «Технология бродильных производств и виноделие»',
        'Сертификат Doemens Akademie, Мюнхен (2001)',
        'Сертификат Brewing and Malting Science, IBD (2008)',
        'Сертификат HACCP-системы управления безопасностью пищевых продуктов',
      ],
      isVisible: true,
      sortOrder: 0,
    },
  })

  console.log('✅ Технолог создан')

  // ============================================================
  // КАТЕГОРИИ ПРОДУКТОВ
  // ============================================================
  await prisma.product.deleteMany()
  await prisma.productCategory.deleteMany()

  const catSvetlye = await prisma.productCategory.create({
    data: {
      name: 'Светлые',
      slug: 'svetlye',
      description: 'Лёгкие и освежающие светлые сорта пива с золотистым цветом и мягким хмелевым ароматом.',
      imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80',
      sortOrder: 0,
      isActive: true,
    },
  })

  const catTyomnye = await prisma.productCategory.create({
    data: {
      name: 'Тёмные',
      slug: 'tyomnye',
      description: 'Насыщенные тёмные сорта с карамельными и шоколадными нотами.',
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
      sortOrder: 1,
      isActive: true,
    },
  })

  const catNefiltr = await prisma.productCategory.create({
    data: {
      name: 'Нефильтрованные',
      slug: 'nefiltrovanye',
      description: 'Живое пиво с натуральным осадком — максимум вкуса и аромата.',
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80',
      sortOrder: 2,
      isActive: true,
    },
  })

  const catSezonnye = await prisma.productCategory.create({
    data: {
      name: 'Сезонные',
      slug: 'sezonnye',
      description: 'Ограниченные выпуски, вдохновлённые временами года.',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
      sortOrder: 3,
      isActive: true,
    },
  })

  console.log('✅ Категории продуктов созданы')

  // ============================================================
  // ПРОДУКТЫ
  // ============================================================
  const products = [
    {
      name: 'Дербент Классик',
      slug: 'derbent-klassik',
      categoryId: catSvetlye.id,
      description: 'Наш флагманский светлый лагер — визитная карточка пивоварни. Варится по неизменной рецептуре с 2009 года. Мягкий, сбалансированный вкус с нотами свежего хлеба и лёгкой хмелевой горчинкой в финале. Идеален для повседневного наслаждения.',
      alcoholContent: 4.8,
      bitterness: 18,
      density: 12.0,
      color: 'Золотисто-жёлтый, прозрачный',
      volume: '0.5 л, 1.5 л, 30 л (кег)',
      ingredients: 'Вода, солод ячменный светлый, хмель (Hallertau, Saaz), дрожжи',
      isPopular: true,
      isNew: false,
      isSeasonal: false,
      isActive: true,
      sortOrder: 0,
      imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80',
    },
    {
      name: 'Каспийское светлое',
      slug: 'kaspiyskoe-svetloe',
      categoryId: catSvetlye.id,
      description: 'Лёгкое освежающее пиво, вдохновлённое морским бризом Каспия. Низкая горчинка, чистый солодовый вкус с лёгкими фруктовыми нотами. Отлично утоляет жажду в жаркий день.',
      alcoholContent: 4.2,
      bitterness: 12,
      density: 10.5,
      color: 'Светло-золотистый',
      volume: '0.5 л, 1.5 л',
      ingredients: 'Вода, солод ячменный светлый, хмель (Perle), дрожжи',
      isPopular: true,
      isNew: false,
      isSeasonal: false,
      isActive: true,
      sortOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1598006342052-9a85c396c0ae?w=600&q=80',
    },
    {
      name: 'Крепкое резервное',
      slug: 'krepkoe-rezervnoe',
      categoryId: catSvetlye.id,
      description: 'Крепкий светлый лагер с выраженным солодовым характером и тёплым алкогольным послевкусием. Сваренное по традиционной баварской технологии «двойного затирания». Для ценителей насыщенного вкуса.',
      alcoholContent: 7.5,
      bitterness: 22,
      density: 18.0,
      color: 'Янтарно-золотистый',
      volume: '0.5 л',
      ingredients: 'Вода, солод ячменный светлый и мюнхенский, хмель (Magnum, Hallertau), дрожжи',
      isPopular: false,
      isNew: false,
      isSeasonal: false,
      isActive: true,
      sortOrder: 2,
      imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80',
    },
    {
      name: 'Каспийское тёмное',
      slug: 'kaspiyskoe-tyomnoe',
      categoryId: catTyomnye.id,
      description: 'Победитель золотой медали фестиваля «Пивная Россия» 2022. Богатый тёмный портер с ароматами жжёного солода, горького шоколада и кофе. Кремовая пена, плотное тело, долгое согревающее послевкусие.',
      alcoholContent: 5.8,
      bitterness: 30,
      density: 14.5,
      color: 'Тёмно-коричневый, почти чёрный',
      volume: '0.5 л, 30 л (кег)',
      ingredients: 'Вода, солод ячменный светлый, солод тёмный, солод жжёный, хмель (Target, Fuggle), дрожжи',
      isPopular: true,
      isNew: false,
      isSeasonal: false,
      isActive: true,
      sortOrder: 0,
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
    },
    {
      name: 'Горный мёд',
      slug: 'gornyy-myod',
      categoryId: catTyomnye.id,
      description: 'Уникальный тёмный медовый эль, созданный в коллаборации с пасекой из горного Дагестана. Натуральный горный мёд добавляется на этапе брожения, придавая пиву неповторимую сладость и цветочный аромат. Мягкое, бархатистое тело.',
      alcoholContent: 5.2,
      bitterness: 15,
      density: 13.0,
      color: 'Красно-коричневый',
      volume: '0.5 л',
      ingredients: 'Вода, солод ячменный светлый и карамельный, мёд горный натуральный, хмель (Styrian Goldings), дрожжи',
      isPopular: false,
      isNew: true,
      isSeasonal: false,
      isActive: true,
      sortOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1571767454098-246b94fbcf70?w=600&q=80',
    },
    {
      name: 'Пшеничное живое',
      slug: 'pshenichnoe-zhivoe',
      categoryId: catNefiltr.id,
      description: 'Традиционное баварское пшеничное пиво в нефильтрованном исполнении. Мутное золотисто-жёлтое, с характерным ароматом банана и гвоздики от специальных пшеничных дрожжей. Лёгкое, освежающее, с кремовой пеной.',
      alcoholContent: 5.0,
      bitterness: 14,
      density: 12.5,
      color: 'Мутный золотисто-жёлтый',
      volume: '0.5 л',
      ingredients: 'Вода, солод пшеничный, солод ячменный, хмель (Perle, Hallertau), дрожжи пшеничные',
      isPopular: true,
      isNew: false,
      isSeasonal: false,
      isActive: true,
      sortOrder: 0,
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80',
    },
    {
      name: 'Янтарный крафт',
      slug: 'yantarnyy-kraft',
      categoryId: catNefiltr.id,
      description: 'Нефильтрованный янтарный эль с выраженным хмелевым ароматом и карамельным солодовым вкусом. Сухое хмелевание придаёт пиву яркие цветочно-цитрусовые нотки. Любимый сорт завсегдатаев нашего фирменного магазина.',
      alcoholContent: 5.5,
      bitterness: 28,
      density: 13.5,
      color: 'Янтарный, слегка мутный',
      volume: '0.5 л',
      ingredients: 'Вода, солод ячменный светлый и карамельный, хмель (Cascade, Centennial, Citra), дрожжи',
      isPopular: false,
      isNew: true,
      isSeasonal: false,
      isActive: true,
      sortOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
    },
    {
      name: 'Осенний урожай',
      slug: 'osenniy-urozhay',
      categoryId: catSezonnye.id,
      description: 'Октябрьский сезонный выпуск, вдохновлённый традицией сбора урожая в предгорьях Дагестана. Марценовское пиво с ярким солодовым характером, нотами карамели, поджаренного хлеба и лёгкими пряными акцентами. Варится только в сентябре–октябре.',
      alcoholContent: 6.2,
      bitterness: 20,
      density: 15.0,
      color: 'Медно-янтарный',
      volume: '0.5 л',
      ingredients: 'Вода, солод мюнхенский, солод венский, солод карамельный, хмель (Saaz, Tettnang), дрожжи',
      isPopular: false,
      isNew: false,
      isSeasonal: true,
      isActive: true,
      sortOrder: 0,
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
    },
    {
      name: 'Зимний согрев',
      slug: 'zimniy-sogrev',
      categoryId: catSezonnye.id,
      description: 'Зимний крепкий тёмный эль с добавлением корицы, гвоздики и кардамона. Варится ограниченной партией к новогодним праздникам. Согревающий, пряный, с долгим тёплым послевкусием. Идеален для холодных вечеров.',
      alcoholContent: 8.0,
      bitterness: 25,
      density: 19.5,
      color: 'Тёмно-рубиновый',
      volume: '0.33 л',
      ingredients: 'Вода, солод тёмный, солод карамельный, хмель (Fuggle), корица, гвоздика, кардамон, дрожжи',
      isPopular: false,
      isNew: true,
      isSeasonal: true,
      isActive: true,
      sortOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=600&q=80',
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('✅ Продукты созданы')

  // ============================================================
  // КАТЕГОРИИ НОВОСТЕЙ
  // ============================================================
  await prisma.newsArticle.deleteMany()
  await prisma.newsCategory.deleteMany()

  const newsCatNews = await prisma.newsCategory.create({
    data: { name: 'Новости пивоварни', slug: 'novosti-pivovarni', sortOrder: 0, isActive: true },
  })
  const newsCatEvents = await prisma.newsCategory.create({
    data: { name: 'События и акции', slug: 'sobytiya-i-akcii', sortOrder: 1, isActive: true },
  })
  const newsCatProducts = await prisma.newsCategory.create({
    data: { name: 'Новинки', slug: 'novinki', sortOrder: 2, isActive: true },
  })

  console.log('✅ Категории новостей созданы')

  // ============================================================
  // СТАТЬИ НОВОСТЕЙ
  // ============================================================
  const now = new Date()
  const newsArticles = [
    {
      title: 'Дербентская пивоварня получила золото на фестивале «Пивная Россия»',
      slug: 'zoloto-pivnaya-rossiya-2023',
      categoryId: newsCatNews.id,
      excerpt: 'Наш сорт «Каспийское тёмное» завоевал золотую медаль в категории «Тёмные сорта» на крупнейшем пивном фестивале страны.',
      content: `В октябре 2023 года Дербентская пивоварня приняла участие в юбилейном фестивале «Пивная Россия», который прошёл в Москве и собрал более 200 производителей из 45 регионов страны.

Наш флагманский тёмный портер «Каспийское тёмное», разработанный главным технологом Алибеком Магомедовым, был признан лучшим в категории «Тёмные сорта» и удостоен золотой медали.

Экспертное жюри отметило исключительную чистоту вкуса, выверенный баланс между горчинкой жжёного солода и сладостью карамели, а также насыщенный аромат с нотами кофе и горького шоколада.

«Эта победа — результат многолетней работы всей нашей команды», — прокомментировал директор пивоварни Шамиль Мурадов. «Мы очень гордимся признанием на федеральном уровне и продолжим развивать линейку тёмных сортов».

Медаль будет торжественно вручена на специальной церемонии в декабре 2023 года.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1567533888082-eac6b9d0d875?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Открытие фирменного магазина в центре Дербента',
      slug: 'otkrytie-magazina-derbent-2023',
      categoryId: newsCatNews.id,
      excerpt: 'С 1 сентября 2023 года начал работу наш новый фирменный магазин на улице Гагарина, 15. Весь ассортимент, экскурсии, дегустации.',
      content: `Рады сообщить об открытии нашего нового фирменного магазина в центре Дербента!

Адрес: ул. Гагарина, 15 (рядом с историческим центром города)
Режим работы: ежедневно с 10:00 до 20:00

В магазине вы найдёте:
— Весь ассортимент пивоварни, включая нефильтрованные сорта в розлив
— Фирменную сувенирную продукцию (кружки, футболки, бокалы)
— Снеки и закуски от местных производителей
— Информационный уголок с историей пивоварни

Каждую субботу с 14:00 до 16:00 проводятся бесплатные дегустации с рассказом о технологии производства. Запись по телефону или через сайт.

В честь открытия — скидка 15% на все сорта пива до 30 сентября 2023 года.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Новинка сезона: «Зимний согрев» — пряный эль к Новому году',
      slug: 'novinка-zimniy-sogrev-2023',
      categoryId: newsCatProducts.id,
      excerpt: 'Ограниченная партия пряного зимнего эля с корицей, гвоздикой и кардамоном. Только 5000 бутылок — успейте попробовать!',
      content: `Команда Дербентской пивоварни представляет долгожданную зимнюю новинку — «Зимний согрев»!

Этот крепкий тёмный эль (8% об.) главный технолог Алибек Магомедов разрабатывал в течение двух лет. Вдохновением послужили традиционные горские рецепты согревающих напитков, которые готовили в зимние вечера в дагестанских сёлах.

**Вкусовой профиль:**
Первые ноты — корица и кардамон, затем раскрываются жжёный солод и тёмный шоколад, финал — тёплое пряное послевкусие, которое согревает изнутри.

**Ограниченный выпуск:**
Сварено всего 5000 бутылок объёмом 0.33 л. В продаже с 1 декабря 2023 года в фирменном магазине и у наших партнёров по Дагестану.

**Где купить:**
— Фирменный магазин, ул. Гагарина, 15 (Дербент)
— Сеть магазинов «Напитки Дагестана» (Махачкала)
— Заказ на сайте с доставкой по России

Отличный подарок на Новый год для ценителей крафтового пива!`,
      coverImageUrl: 'https://images.unsplash.com/photo-1543418219-44e30b057fea?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Экскурсионный сезон 2024: записывайтесь на тур по пивоварне',
      slug: 'ekskursii-pivovarna-2024',
      categoryId: newsCatEvents.id,
      excerpt: 'С марта 2024 года возобновляем экскурсии по производству. Узнайте, как рождается настоящее пиво, прямо на заводе.',
      content: `Мы рады объявить о старте нового экскурсионного сезона!

С 1 марта 2024 года Дербентская пивоварня вновь открывает двери для всех желающих познакомиться с производством изнутри.

**Что входит в тур:**
1. Ознакомление с историей пивоварни (15 мин)
2. Экскурсия по варочному цеху — от зерна до сусла (20 мин)
3. Посещение бродильного отделения (15 мин)
4. Мастер-класс по дегустации 4 сортов пива (30 мин)
5. Посещение фирменного магазина со скидкой 10%

**Расписание:**
Пятница–воскресенье, 11:00 и 14:00
Продолжительность: ~1,5 часа

**Стоимость:**
800 руб/чел (взрослые), 400 руб/чел (группы от 10 чел)
Дети до 18 лет — без дегустации, бесплатно

**Запись:**
По телефону +7 (872) 250-35-00 или через форму на сайте.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: '«Янтарный крафт» — новый нефильтрованный эль уже в продаже',
      slug: 'yantarnyy-kraft-v-prodazhe',
      categoryId: newsCatProducts.id,
      excerpt: 'Долгожданная новинка от нашего технолога — нефильтрованный янтарный эль с американским хмелем Cascade и Citra.',
      content: `Алибек Магомедов представляет своё новейшее творение — «Янтарный крафт»!

Этот нефильтрованный янтарный эль стал ответом на многочисленные просьбы наших поклонников создать что-то более хмелевое и ароматное. Используя технологию «сухого хмелевания» (dry hopping), мы добавляем американские хмели Cascade, Centennial и Citra прямо в танк после брожения — это даёт пиву яркий тропический аромат без дополнительной горчинки.

**Характеристики:**
- Алкоголь: 5,5% об.
- Горчинка (IBU): 28
- Плотность: 13,5%
- Цвет: янтарный, слегка мутный

**Вкусовой профиль:**
Аромат — цитрус, тропические фрукты, смола. Вкус — карамельный солод с яркими хмелевыми нотами. Послевкусие — долгое, сухое, с фруктовой горчинкой.

Доступен в фирменном магазине в Дербенте и у оптовых партнёров. Оптовые заявки принимаем по email: sales@pivovarna.ru`,
      coverImageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
      isPublished: true,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const article of newsArticles) {
    await prisma.newsArticle.create({ data: article })
  }

  console.log('✅ Статьи новостей созданы')

  // ============================================================
  // ГАЛЕРЕЯ
  // ============================================================
  await prisma.galleryItem.deleteMany()
  await prisma.galleryCategory.deleteMany()

  const galProduction = await prisma.galleryCategory.create({
    data: { name: 'Производство', slug: 'proizvodstvo', sortOrder: 0, isActive: true },
  })
  const galProducts = await prisma.galleryCategory.create({
    data: { name: 'Продукция', slug: 'produkciya', sortOrder: 1, isActive: true },
  })
  const galEvents = await prisma.galleryCategory.create({
    data: { name: 'События', slug: 'sobytiya', sortOrder: 2, isActive: true },
  })

  const galleryItems = [
    { categoryId: galProduction.id, imageUrl: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80', title: 'Варочный цех', sortOrder: 0 },
    { categoryId: galProduction.id, imageUrl: 'https://images.unsplash.com/photo-1505075106905-fb052892c116?w=800&q=80', title: 'Медные котлы', sortOrder: 1 },
    { categoryId: galProduction.id, imageUrl: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=800&q=80', title: 'Бродильные танки', sortOrder: 2 },
    { categoryId: galProduction.id, imageUrl: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80', title: 'Линия розлива', sortOrder: 3 },
    { categoryId: galProducts.id, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80', title: 'Дербент Классик', sortOrder: 0 },
    { categoryId: galProducts.id, imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80', title: 'Каспийское тёмное', sortOrder: 1 },
    { categoryId: galProducts.id, imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80', title: 'Пшеничное живое', sortOrder: 2 },
    { categoryId: galProducts.id, imageUrl: 'https://images.unsplash.com/photo-1571767454098-246b94fbcf70?w=800&q=80', title: 'Горный мёд', sortOrder: 3 },
    { categoryId: galEvents.id, imageUrl: 'https://images.unsplash.com/photo-1567533888082-eac6b9d0d875?w=800&q=80', title: 'Пивная Россия 2023', sortOrder: 0 },
    { categoryId: galEvents.id, imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80', title: 'Открытие магазина', sortOrder: 1 },
    { categoryId: galEvents.id, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', title: 'Дегустация', sortOrder: 2 },
    { categoryId: galEvents.id, imageUrl: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80', title: 'Экскурсия по заводу', sortOrder: 3 },
  ]

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: { ...item, isActive: true } })
  }

  console.log('✅ Галерея создана')

  // ============================================================
  // ЗАЯВКИ (CRM)
  // ============================================================
  await prisma.leadStatusHistory.deleteMany()
  await prisma.leadComment.deleteMany()
  await prisma.lead.deleteMany()

  const lead1 = await prisma.lead.create({
    data: {
      type: LeadType.WHOLESALE,
      status: LeadStatus.NEW,
      name: 'Артём Белов',
      phone: '+7 (915) 234-56-78',
      email: 'artem.belov@restauracia.ru',
      company: 'Ресторан «Причал»',
      message: 'Добрый день! Интересует оптовая закупка пива для нашего ресторана в Москве. Планируем брать 5–10 кегов в неделю. Можете ли вы предложить условия сотрудничества и прайс-лист?',
      source: 'website',
      ipAddress: '212.45.67.89',
      isRead: false,
    },
  })

  const lead2 = await prisma.lead.create({
    data: {
      type: LeadType.DISTRIBUTION,
      status: LeadStatus.IN_PROGRESS,
      name: 'Наталья Коваленко',
      phone: '+7 (861) 345-67-89',
      email: 'n.kovalenko@drinks-south.ru',
      company: 'ООО «Напитки Юга»',
      message: 'Мы являемся дистрибьютором алкогольной продукции в Краснодарском крае. Хотели бы рассмотреть возможность эксклюзивного представительства вашей продукции в нашем регионе. Готовы обсудить объёмы и условия.',
      source: 'website',
      ipAddress: '176.32.45.12',
      isRead: true,
      assignedToId: manager.id,
    },
  })

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead2.id,
      fromStatus: LeadStatus.NEW,
      toStatus: LeadStatus.IN_PROGRESS,
      changedById: superadmin.id,
      comment: 'Передано менеджеру для проработки',
    },
  })

  await prisma.leadComment.create({
    data: {
      leadId: lead2.id,
      authorId: manager.id,
      text: 'Связался с Натальей по телефону. Компания реально работает, хорошая репутация. Запросил данные по их текущему обороту. Жду ответа.',
    },
  })

  const lead3 = await prisma.lead.create({
    data: {
      type: LeadType.COOPERATION,
      status: LeadStatus.WAITING,
      name: 'Дмитрий Орлов',
      phone: '+7 (495) 456-78-90',
      email: 'd.orlov@horekagroup.ru',
      company: 'HoReCa Group',
      message: 'Управляем сетью из 8 баров в Москве. Ищем эксклюзивного партнёра по крафтовому пиву. Можем предложить размещение на кранах во всех заведениях. Интересны условия совместного брендинга.',
      source: 'website',
      ipAddress: '91.234.56.78',
      isRead: true,
      assignedToId: manager.id,
    },
  })

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead3.id,
      fromStatus: LeadStatus.NEW,
      toStatus: LeadStatus.IN_PROGRESS,
      changedById: superadmin.id,
    },
  })
  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead3.id,
      fromStatus: LeadStatus.IN_PROGRESS,
      toStatus: LeadStatus.WAITING,
      changedById: manager.id,
      comment: 'Ждём коммерческое предложение от клиента',
    },
  })

  await prisma.leadComment.create({
    data: {
      leadId: lead3.id,
      authorId: manager.id,
      text: 'Провели онлайн-встречу. Серьёзные ребята. Попросили КП со схемой поставок. Подготавливаем документы.',
    },
  })
  await prisma.leadComment.create({
    data: {
      leadId: lead3.id,
      authorId: superadmin.id,
      text: 'Приоритетный клиент. При необходимости подключайте меня к переговорам.',
    },
  })

  const lead4 = await prisma.lead.create({
    data: {
      type: LeadType.TOUR,
      status: LeadStatus.CLOSED,
      name: 'Анна Смирнова',
      phone: '+7 (928) 567-89-01',
      email: 'anna.smirnova@mail.ru',
      message: 'Хотим заказать экскурсию для корпоративного мероприятия. Группа 20 человек. Дата — 15 декабря. Возможна ли организация выездного фуршета?',
      source: 'website',
      ipAddress: '85.143.23.45',
      isRead: true,
      assignedToId: manager.id,
    },
  })

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead4.id,
      fromStatus: LeadStatus.NEW,
      toStatus: LeadStatus.CLOSED,
      changedById: manager.id,
      comment: 'Экскурсия подтверждена на 15 декабря. Оплата получена.',
    },
  })

  const lead5 = await prisma.lead.create({
    data: {
      type: LeadType.FEEDBACK,
      status: LeadStatus.CLOSED,
      name: 'Рустам Мамедов',
      phone: '+7 (988) 678-90-12',
      email: 'rustam.m@yandex.ru',
      message: 'Купил «Каспийское тёмное» в вашем магазине — отличное пиво! Хотел бы уточнить, планируете ли вы выпускать его в банках? Было бы удобно брать с собой на природу.',
      source: 'website',
      ipAddress: '176.45.67.23',
      isRead: true,
    },
  })

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead5.id,
      fromStatus: LeadStatus.NEW,
      toStatus: LeadStatus.CLOSED,
      changedById: editor.id,
      comment: 'Ответили по email. Формат банки в планах на 2025 год.',
    },
  })

  const lead6 = await prisma.lead.create({
    data: {
      type: LeadType.WHOLESALE,
      status: LeadStatus.NEW,
      name: 'Игорь Захаров',
      phone: '+7 (812) 789-01-23',
      email: 'i.zakharov@spbmarket.ru',
      company: 'СПБ Маркет',
      message: 'Розничная сеть в Санкт-Петербурге (12 магазинов). Ищем поставщиков крафтового пива из регионов для расширения ассортимента. Интересны объёмы от 200 ящиков в месяц.',
      source: 'website',
      ipAddress: '195.34.56.78',
      isRead: false,
    },
  })

  const lead7 = await prisma.lead.create({
    data: {
      type: LeadType.COOPERATION,
      status: LeadStatus.REJECTED,
      name: 'Олег Петров',
      phone: '+7 (499) 890-12-34',
      email: 'petrov@investgroup.ru',
      company: 'InvestGroup',
      message: 'Рассматриваем возможность инвестиций в пивоваренную отрасль. Интересует покупка доли в вашем бизнесе или открытие совместного производства.',
      source: 'website',
      ipAddress: '213.87.65.43',
      isRead: true,
    },
  })

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead7.id,
      fromStatus: LeadStatus.NEW,
      toStatus: LeadStatus.REJECTED,
      changedById: superadmin.id,
      comment: 'Не рассматриваем продажу доли. Отклонено.',
    },
  })

  const lead8 = await prisma.lead.create({
    data: {
      type: LeadType.TOUR,
      status: LeadStatus.NEW,
      name: 'Светлана Иванова',
      phone: '+7 (928) 901-23-45',
      email: 'svetlana.i@gmail.com',
      message: 'Планируем туристический маршрут по Дербенту. Есть ли возможность включить экскурсию на вашу пивоварню в программу? Группа 35 человек туристов из Москвы.',
      source: 'website',
      ipAddress: '92.34.12.56',
      isRead: false,
    },
  })

  const lead9 = await prisma.lead.create({
    data: {
      type: LeadType.DISTRIBUTION,
      status: LeadStatus.IN_PROGRESS,
      name: 'Тимур Гаджиев',
      phone: '+7 (928) 012-34-56',
      email: 't.gadzhiev@dagoptorg.ru',
      company: 'ООО «ДагОптТорг»',
      message: 'Местный дистрибьютор алкоголя в Дагестане. Хотим заключить договор на поставку вашей продукции в Махачкалу и пригородные районы.',
      source: 'website',
      ipAddress: '176.98.76.54',
      isRead: true,
      assignedToId: manager.id,
    },
  })

  await prisma.leadStatusHistory.create({
    data: {
      leadId: lead9.id,
      fromStatus: LeadStatus.NEW,
      toStatus: LeadStatus.IN_PROGRESS,
      changedById: superadmin.id,
      comment: 'Местный партнёр — приоритет.',
    },
  })

  const lead10 = await prisma.lead.create({
    data: {
      type: LeadType.OTHER,
      status: LeadStatus.NEW,
      name: 'Марина Соколова',
      phone: '+7 (916) 123-45-67',
      email: 'marina.s@mediamoscow.ru',
      company: 'МедиаМосква',
      message: 'Пишем статью о российских крафтовых пивоварнях для федерального издания. Хотели бы взять интервью у вашего технолога и снять небольшой фоторепортаж на производстве.',
      source: 'website',
      ipAddress: '77.234.12.89',
      isRead: false,
    },
  })

  console.log('✅ Заявки (CRM) созданы')

  // ============================================================
  // ИТОГО
  // ============================================================
  console.log('')
  console.log('🎉 База данных успешно заполнена!')
  console.log('')
  console.log('👤 Учётные записи:')
  console.log('   admin@pivovarna.ru / Admin123!  (SUPERADMIN)')
  console.log('   manager@pivovarna.ru / Manager123!  (MANAGER)')
  console.log('   editor@pivovarna.ru / Editor123!  (CONTENT_EDITOR)')
  console.log('')
  console.log('📊 Создано:')
  console.log('   3 пользователя')
  console.log('   4 категории продуктов, 9 сортов пива')
  console.log('   3 категории новостей, 5 статей')
  console.log('   3 категории галереи, 12 фотографий')
  console.log('   10 заявок (CRM)')
  console.log('   1 технолог, 1 компания, SEO, настройки сайта')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сидирования:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
