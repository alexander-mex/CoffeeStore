// Seed script for BlackCoffee database
// Run this script to populate the database with initial data

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("blackcoffee")

    // Clear existing data
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("products").deleteMany({}),
      db.collection("categories").deleteMany({}),
      db.collection("news").deleteMany({}),
    ])

    console.log("Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12)
    const adminUser = {
      email: "admin@blackcoffee.com.ua",
      password: adminPassword,
      name: "Адміністратор",
      role: "admin",
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    await db.collection("users").insertOne(adminUser)
    console.log("Created admin user")

    // Create categories
    const categories = [
      {
        name: "Арабіка",
        slug: "arabica",
        description: "Найпопулярніший вид кави з м'яким смаком",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Робуста",
        slug: "robusta",
        description: "Міцна кава з високим вмістом кофеїну",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Купажі",
        slug: "blends",
        description: "Унікальні суміші різних сортів кави",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("categories").insertMany(categories)
    console.log("Created categories")

    // Create products
    const products = [
      {
        name: "Арабіка Бразилія Сантос",
        description: "Класична арабіка з м'якими нотками шоколаду та горіхів. Ідеально підходить для ранкової кави.",
        price: 450,
        oldPrice: 520,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.8,
        reviews: 124,
        isNew: true,
        isOnSale: true,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Бразилія",
        category: "arabica",
        roastLevel: "medium",
        flavor: ["шоколад", "горіхи", "карамель"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Колумбія Супремо",
        description: "Елітна колумбійська кава з яскравою кислинкою та фруктовими нотками.",
        price: 580,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.9,
        reviews: 89,
        isNew: true,
        isOnSale: false,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Колумбія",
        category: "arabica",
        roastLevel: "medium-light",
        flavor: ["цитрус", "ягоди", "квіти"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ефіопія Йоргачеф",
        description: "Унікальна кава з квітковими та фруктовими нотками. Батьківщина кави.",
        price: 650,
        oldPrice: 750,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.7,
        reviews: 156,
        isNew: false,
        isOnSale: true,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Ефіопія",
        category: "arabica",
        roastLevel: "light",
        flavor: ["квіти", "лимон", "чай"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Гватемала Антигуа",
        description: "Повнотіла кава з димними нотками та пряностями. Вирощена на вулканічних ґрунтах.",
        price: 620,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.6,
        reviews: 78,
        isNew: true,
        isOnSale: false,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Гватемала",
        category: "arabica",
        roastLevel: "medium-dark",
        flavor: ["дим", "пряності", "какао"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ямайка Блю Маунтін",
        description: "Найдорожча кава світу з неперевершеним смаком. Обмежена кількість.",
        price: 1200,
        oldPrice: 1400,
        image: "/placeholder.svg?height=300&width=300",
        rating: 5.0,
        reviews: 45,
        isNew: false,
        isOnSale: true,
        inStock: false,
        type: "beans",
        weight: "250г",
        origin: "Ямайка",
        category: "arabica",
        roastLevel: "medium",
        flavor: ["збалансований", "м'який", "елегантний"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Коста-Ріка Тарразу",
        description: "Збалансована кава з цитрусовими нотками та приємною кислинкою.",
        price: 540,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.5,
        reviews: 92,
        isNew: true,
        isOnSale: false,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Коста-Ріка",
        category: "arabica",
        roastLevel: "medium",
        flavor: ["цитрус", "мед", "ваніль"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Кенія АА",
        description: "Яскрава африканська кава з винними нотками та високою кислотністю.",
        price: 680,
        oldPrice: 780,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.8,
        reviews: 134,
        isNew: false,
        isOnSale: true,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Кенія",
        category: "arabica",
        roastLevel: "medium-light",
        flavor: ["вино", "смородина", "томат"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Гаваї Кона",
        description: "Рідкісна гавайська кава з м'яким смаком та низькою кислотністю.",
        price: 980,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.9,
        reviews: 67,
        isNew: true,
        isOnSale: false,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Гаваї",
        category: "arabica",
        roastLevel: "medium",
        flavor: ["м'який", "горіхи", "масло"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "В'єтнам Робуста",
        description: "Міцна робуста з високим вмістом кофеїну. Ідеально для еспресо.",
        price: 320,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.2,
        reviews: 203,
        isNew: false,
        isOnSale: false,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "В'єтнам",
        category: "robusta",
        roastLevel: "dark",
        flavor: ["міцний", "гіркий", "землистий"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Купаж "Ранкова свіжість"',
        description: "Збалансований купаж арабіки та робусти для ідеального ранку.",
        price: 420,
        oldPrice: 480,
        image: "/placeholder.svg?height=300&width=300",
        rating: 4.6,
        reviews: 167,
        isNew: false,
        isOnSale: true,
        inStock: true,
        type: "beans",
        weight: "250г",
        origin: "Купаж",
        category: "blends",
        roastLevel: "medium",
        flavor: ["збалансований", "енергійний", "приємний"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("products").insertMany(products)
    console.log("Created products")

    // Create news articles
    const news = [
      {
        title: "Нові сорти кави з Ефіопії вже в наявності",
        excerpt:
          "Ми раді представити унікальні сорти кави з високогірних плантацій Ефіопії. Відкрийте для себе не��овторний смак та аромат.",
        content: `
          <p>BlackCoffee з гордістю представляє нову колекцію ефіопської кави, яка тільки що прибула до нашого магазину. Ці унікальні сорти вирощені на висоті понад 2000 метрів над рівнем моря в регіоні Йоргачеф, що славиться своїми винятковими кліматичними умовами.</p>
          
          <p>Наша команда особисто відвідала плантації та відібрала найкращі зерна, які відрізняються яскравими квітковими та фруктовими нотками. Кожен сорт має свою унікальну історію та неповторний профіль смаку.</p>
          
          <p>Серед новинок ви знайдете:</p>
          <ul>
            <li>Йоргачеф Grade 1 - з нотками жасміну та лимона</li>
            <li>Сідамо - з ягідними відтінками та винною кислинкою</li>
            <li>Харар - з шоколадними та пряними нотками</li>
          </ul>
          
          <p>Всі сорти доступні як у зернах, так і в меленому вигляді. Поспішайте спробувати ці винятові кави - кількість обмежена!</p>
        `,
        image: "/placeholder.svg?height=400&width=600",
        publishedAt: new Date("2024-01-15"),
        readTime: 3,
        category: "Новинки",
        author: "Анна Коваленко",
        views: 245,
        isPublished: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        title: "Майстер-клас з приготування еспресо",
        excerpt:
          "Запрошуємо на безкоштовний майстер-клас, де ви дізнаєтеся секрети приготування ідеального еспресо від наших експертів.",
        content: `
          <p>25 січня о 14:00 в нашому шоу-румі відбудеться безкоштовний майстер-клас з приготування еспресо. Наш головний бариста поділиться професійними секретами та покаже, як приготувати ідеальну чашку кави.</p>
          
          <p>Програма майстер-класу:</p>
          <ul>
            <li>Вибір правильних зерен для еспресо</li>
            <li>Налаштування кавомолки та дозування</li>
            <li>Техніка темперування</li>
            <li>Контроль часу екстракції</li>
            <li>Мистецтво латте-арт</li>
          </ul>
          
          <p>Кількість місць обмежена - 15 учасників. Реєстрація обов'язкова за телефоном або на сайті.</p>
        `,
        image: "/placeholder.svg?height=400&width=600",
        publishedAt: new Date("2024-01-12"),
        readTime: 2,
        category: "Події",
        author: "Михайло Петренко",
        views: 189,
        isPublished: true,
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
      },
      {
        title: "Екологічна упаковка для всіх товарів",
        excerpt: "BlackCoffee переходить на повністю екологічну упаковку. Дбаємо про планету разом з вами.",
        content: `
          <p>З 1 лютого 2024 року BlackCoffee повністю переходить на екологічну упаковку для всіх своїх товарів. Це важливий крок у нашій місії зі збереження навколишнього середовища.</p>
          
          <p>Що змінюється:</p>
          <ul>
            <li>Пакети для кави виготовлені з біорозкладних матеріалів</li>
            <li>Коробки для доставки з переробленого картону</li>
            <li>Відмова від пластикових елементів</li>
            <li>Використання соєвих чорнил для друку</li>
          </ul>
          
          <p>Наша нова упаковка не тільки екологічна, але й краще зберігає свіжість кави завдяки інноваційним технологіям.</p>
        `,
        image: "/placeholder.svg?height=400&width=600",
        publishedAt: new Date("2024-01-10"),
        readTime: 4,
        category: "Екологія",
        author: "Олена Сидоренко",
        views: 312,
        isPublished: true,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
    ]

    await db.collection("news").insertMany(news)
    console.log("Created news articles")

    // Create indexes for better performance
    await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("products").createIndex({ name: "text", description: "text" }),
      db.collection("products").createIndex({ category: 1 }),
      db.collection("products").createIndex({ isNew: 1 }),
      db.collection("products").createIndex({ isOnSale: 1 }),
      db.collection("categories").createIndex({ slug: 1 }, { unique: true }),
      db.collection("news").createIndex({ publishedAt: -1 }),
      db.collection("news").createIndex({ category: 1 }),
    ])

    console.log("Created database indexes")
    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

// Run the seed function
seedDatabase()
