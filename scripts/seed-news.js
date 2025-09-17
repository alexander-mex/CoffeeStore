const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

const sampleNews = [
  {
    title: {
      uk: "Нова колекція кави з Ефіопії вже в продажу!",
      en: "New Ethiopian coffee collection now available!",
    },
    excerpt: {
      uk: "Відкрийте для себе унікальні смаки високогірної кави з регіону Сідамо",
      en: "Discover the unique flavors of highland coffee from the Sidamo region",
    },
    content: {
      uk: "Ми раді представити нашу нову колекцію кави з Ефіопії! Ці зерна вирощені на висоті понад 2000 метрів над рівнем моря в регіоні Сідамо, що надає їм неповторний фруктовий смак з нотками цитрусових та квітів. Наші партнери-фермери використовують традиційні методи обробки, що передаються з покоління в покоління. Кожна партія ретельно відбирається та обжарюється нашими експертами для досягнення ідеального балансу смаку та аромату.",
      en: "We are excited to introduce our new Ethiopian coffee collection! These beans are grown at an altitude of over 2000 meters above sea level in the Sidamo region, giving them a unique fruity flavor with notes of citrus and flowers. Our partner farmers use traditional processing methods passed down from generation to generation. Each batch is carefully selected and roasted by our experts to achieve the perfect balance of taste and aroma.",
    },
    image: "/placeholder.svg?height=400&width=600",
    author: "Олександр Коваленко",
    publishedAt: new Date("2024-01-15"),
    category: "products",
    featured: true,
    readTime: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: {
      uk: 'BlackCoffee отримав нагороду "Кращий обжарювач року"',
      en: 'BlackCoffee wins "Best Roaster of the Year" award',
    },
    excerpt: {
      uk: "На міжнародному конкурсі кави в Амстердамі наша команда здобула престижну нагороду",
      en: "At the international coffee competition in Amsterdam, our team won a prestigious award",
    },
    content: {
      uk: 'Ми пишаємося тим, що BlackCoffee було визнано "Кращим обжарювачем року" на престижному міжнародному конкурсі кави в Амстердамі. Це визнання нашої постійної роботи над удосконаленням процесу обжарювання та створенням унікальних смакових профілів. Журі високо оцінило нашу інноваційну технологію обжарювання та якість готового продукту. Дякуємо всім нашим клієнтам за підтримку та довіру!',
      en: 'We are proud that BlackCoffee has been recognized as "Best Roaster of the Year" at the prestigious international coffee competition in Amsterdam. This is recognition of our constant work on improving the roasting process and creating unique flavor profiles. The jury highly appreciated our innovative roasting technology and the quality of the finished product. Thank you to all our customers for your support and trust!',
    },
    image: "/placeholder.svg?height=400&width=600",
    author: "Марія Петренко",
    publishedAt: new Date("2024-01-10"),
    category: "awards",
    featured: false,
    readTime: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: {
      uk: "Майстер-клас з приготування кави вдома",
      en: "Home coffee brewing masterclass",
    },
    excerpt: {
      uk: "Приєднуйтесь до нашого безкоштовного онлайн майстер-класу 25 січня",
      en: "Join our free online masterclass on January 25th",
    },
    content: {
      uk: "25 січня о 19:00 ми проводимо безкоштовний онлайн майстер-клас з приготування кави вдома. Наш головний бариста Дмитро Іваненко розповість про різні методи заварювання, поділиться секретами ідеальної екстракції та відповість на всі ваші запитання. Ви дізнаєтеся про правильне співвідношення кави та води, температуру заварювання, час екстракції та багато іншого. Реєстрація обов'язкова на нашому сайті!",
      en: "On January 25th at 7:00 PM we are hosting a free online masterclass on home coffee brewing. Our head barista Dmytro Ivanenko will talk about different brewing methods, share secrets of perfect extraction and answer all your questions. You will learn about the correct coffee-to-water ratio, brewing temperature, extraction time and much more. Registration required on our website!",
    },
    image: "/placeholder.svg?height=400&width=600",
    author: "Дмитро Іваненко",
    publishedAt: new Date("2024-01-08"),
    category: "events",
    featured: false,
    readTime: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedNews() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("blackcoffee")
    const newsCollection = db.collection("news")

    // Clear existing news
    await newsCollection.deleteMany({})
    console.log("Cleared existing news")

    // Insert sample news
    const result = await newsCollection.insertMany(sampleNews)
    console.log(`Inserted ${result.insertedCount} news items`)

    console.log("News seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding news:", error)
  } finally {
    await client.close()
  }
}

seedNews()
