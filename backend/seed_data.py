import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Course, Lesson
from exams.models import Exam, Question, Choice

def seed():
    # Check if course exists and delete it to force fresh seed of lessons/exams
    title = "Full Stack Web Development with React & Django"
    deleted_count, _ = Course.objects.filter(title=title).delete()
    if deleted_count:
        print(f"Deleted existing course: {title}")

    # Create a Course
    course = Course.objects.create(
        title=title,
        description="Learn how to build modern web applications using Django REST Framework and React.",
        category='Web Development',
        difficulty='intermediate'
    )
    print(f"Created course: {course.title}")
    
    # Add Lessons
    Lesson.objects.create(
        course=course,
        title="Introduction to Django",
        content="### Welcome to Django\nDjango is a high-level Python web framework...",
        code_snippet="import django\nprint(django.get_version())",
        order=1
    )
    Lesson.objects.create(
        course=course,
        title="Building APIs with DRF",
        content="### Django REST Framework\nLearn how to build powerful APIs...",
        code_snippet="from rest_framework import generics\nclass MyView(generics.ListAPIView): pass",
        order=2
    )
    Lesson.objects.create(
        course=course,
        title="React Basics",
        content="### Getting Started with React\nReact is a declarative, efficient, and flexible JavaScript library...",
        code_snippet="const App = () => <h1>Hello React</h1>;",
        order=3
    )

    # Add Exam
    exam = Exam.objects.create(
        course=course,
        title="Full Stack Fundamentals Exam",
        description="Test your knowledge on React and Django integration.",
        duration_minutes=15,
        passing_score=70
    )

    # Add Questions
    q1 = Question.objects.create(exam=exam, text="Which HTTP method is typically used to create a new resource in a REST API?", points=25)
    Choice.objects.create(question=q1, text="GET", is_correct=False)
    Choice.objects.create(question=q1, text="POST", is_correct=True)
    Choice.objects.create(question=q1, text="PUT", is_correct=False)
    Choice.objects.create(question=q1, text="DELETE", is_correct=False)

    q2 = Question.objects.create(
        exam=exam, 
        text="What hook is used to handle side effects in a React functional component?", 
        points=25,
        code="useEffect(() => {\n  document.title = `You clicked ${count} times`;\n});"
    )
    Choice.objects.create(question=q2, text="useState", is_correct=False)
    Choice.objects.create(question=q2, text="useEffect", is_correct=True)
    Choice.objects.create(question=q2, text="useContext", is_correct=False)
    Choice.objects.create(question=q2, text="useReducer", is_correct=False)

    q3 = Question.objects.create(exam=exam, text="What is the primary database used by Moorfo in production?", points=25)
    Choice.objects.create(question=q3, text="PostgreSQL", is_correct=True)
    Choice.objects.create(question=q3, text="MySQL", is_correct=False)
    Choice.objects.create(question=q3, text="SQLite", is_correct=False)
    Choice.objects.create(question=q3, text="MongoDB", is_correct=False)

    q4 = Question.objects.create(
        exam=exam, 
        text="In Django, which file is used to define the API endpoint paths?", 
        points=25,
        code="urlpatterns = [\n    path('admin/', admin.site.urls),\n    path('api/', include('api.urls')),\n]"
    )
    Choice.objects.create(question=q4, text="models.py", is_correct=False)
    Choice.objects.create(question=q4, text="serializers.py", is_correct=False)
    Choice.objects.create(question=q4, text="urls.py", is_correct=True)
    Choice.objects.create(question=q4, text="views.py", is_correct=False)

    print(f"Created exam and questions for: {course.title}")

    # --- Computer Science Asoslari (Uzbek) ---
    cs_title = "Kompyuter Fanlari Asoslari"
    Course.objects.filter(title=cs_title).delete()
    
    cs_course = Course.objects.create(
        title=cs_title,
        description="Kompyuter fanlarining asosiy tushunchalari, algoritmlar va ma'lumotlar tuzilmalarini o'rganing.",
        category='Computer Science',
        difficulty='beginner'
    )
    print(f"Created course: {cs_course.title}")

    cs_lessons = [
        ("Kompyuter fanlariga kirish", "Kompyuter fanlari nima va u hayotimizda qanday o'rin tutadi?"),
        ("Ikkilik (Binary) sanoq sistemasi", "Nima uchun kompyuterlar faqat 0 va 1 larni tushunadi?"),
        ("Sanoq sistemalari (Sakkizlik va O'n oltilik)", "Hexadecimal va Octal sistemalarning ahamiyati."),
        ("Mantiqiy amallar (AND, OR, NOT)", "Mantiqiy elementlarning ishlash prinsipi."),
        ("Murakkab mantiqiy elementlar (XOR, NAND, NOR)", "Mantiqiy sxemalarni qurish."),
        ("Ma'lumotlarni kodlash (ASCII va Unicode)", "Matnlar kompyuterda qanday saqlanadi?"),
        ("CPU: Markaziy protsessor", "Protsessorning ishlash bosqichlari (Fetch-Decode-Execute)."),
        ("Xotira turlari (RAM va ROM)", "Vaqtinchalik va doimiy xotiraning farqi."),
        ("Kesh (Cache) xotira", "Protsessor tezligini oshirish mexanizmlari."),
        ("Kirish-chiqish qurilmalari", "Input va Output qurilmalarining o'zaro aloqasi."),
        ("Operatsion sistemalar asoslari", "OS nima va u qanday vazifalarni bajaradi?"),
        ("Jarayonlarni boshqarish (Process Management)", "Multitasking va Scheduler tushunchasi."),
        ("Xotirani boshqarish (Memory Management)", "Virtual xotira va paging."),
        ("Fayl sistemalari", "Fayllar diskda qanday joylashadi?"),
        ("Kompyuter tarmoqlari asoslari", "Tarmoq turlari (LAN, WAN) va topologiyalar."),
        ("OSI modeli: Yuqori qatlamlar", "App, Presentation va Session layerlari."),
        ("OSI modeli: Quyi qatlamlar", "Network, Data Link va Physical layerlari."),
        ("TCP/IP protokollar oilasi", "Internetning asosi - TCP va IP protokollari."),
        ("IP manzillar (IPv4 va IPv6)", "Tarmoqdagi qurilmalarni identifikatsiya qilish."),
        ("DNS va HTTP protokollari", "Veb-saytlar qanday yuklanadi?"),
        ("Algoritmlarga kirish", "Algoritm nima va uning xossalari."),
        ("Algoritmlarning murakkabligi (Big O)", "Vaqt va xotira murakkabligini tahlil qilish."),
        ("Chiziqli qidiruv (Linear Search)", "Oddiy qidiruv algoritmi."),
        ("Binar qidiruv (Binary Search)", "Saralangan ma'lumotlarda tezkor qidiruv."),
        ("Pufaksimon saralash (Bubble Sort)", "Eng sodda saralash algoritmi."),
        ("Tezkor saralash (Quick Sort)", "Divide and Conquer usuli."),
        ("Ma'lumotlar tuzilmalari: Stek (Stack)", "LIFO prinsipi."),
        ("Ma'lumotlar tuzilmalari: Navbat (Queue)", "FIFO prinsipi."),
        ("Ma'lumotlar tuzilmalari: Daraxtlar (Trees)", "Iyerarxik ma'lumotlarni saqlash."),
        ("Kiberxavfsizlik va Etika", "Parollar, viruslar va xavfsiz internet."),
    ]

    for i, (l_title, l_content) in enumerate(cs_lessons):
        Lesson.objects.create(
            course=cs_course,
            title=l_title,
            content=f"### {l_title}\n\n{l_content}\n\nUshbu darsda siz kompyuter fanlarining muhim qismlaridan biri haqida tushunchaga ega bo'lasiz.",
            order=i + 1
        )

    cs_exam = Exam.objects.create(
        course=cs_course,
        title="Kompyuter Fanlari Yakuniy Imtihoni",
        description="30 ta dars bo'yicha bilimlaringizni sinab ko'ring. 60 ta savol.",
        duration_minutes=60,
        passing_score=70
    )

    # 60 SAVOL GENERATSIYASI
    cs_questions = [
        ("Kompyuterda ma'lumotlarning eng kichik birligi nima?", "Bit", ["Bayt", "Bit", "Kilobayt", "Gigabayt"]),
        ("1 bayt necha bitga teng?", "8 bit", ["4 bit", "8 bit", "16 bit", "32 bit"]),
        ("Markaziy protsessor (CPU) ning asosiy vazifasi nima?", "Buyruqlarni bajarish", ["Ma'lumotlarni saqlash", "Buyruqlarni bajarish", "Tasvirlarni chiqarish", "Internetga ulanish"]),
        ("Qaysi xotira turi vaqtinchalik hisoblanadi?", "RAM", ["HDD", "SSD", "RAM", "ROM"]),
        ("Algoritm nima?", "Muammoni yechish ketma-ketligi", ["Dastur kodi", "Muammoni yechish ketma-ketligi", "Kompyuter qismi", "Matn muharriri"]),
        ("HTTP nima?", "Veb-protokol", ["Operatsion sistema", "Veb-protokol", "Dasturlash tili", "Xotira turi"]),
        ("DNS ning vazifasi nima?", "Domen nomini IP ga aylantirish", ["Fayl yuklash", "Domen nomini IP ga aylantirish", "Elektron pochta yuborish", "Rasmlarni tahrirlash"]),
        ("ASCII jadvalida 'A' harfi qaysi son bilan kodlangan?", "65", ["65", "97", "48", "32"]),
        ("Binary tizimda 10 soni o'nlik tizimda nechaga teng?", "2", ["1", "2", "3", "4"]),
        ("Qaysi algoritm 'bo'lib tashla va hukmronlik qil' usulida ishlaydi?", "Quick Sort", ["Bubble Sort", "Quick Sort", "Linear Search", "Selection Sort"]),
        # 11-20
        ("Operatsion sistemaga misol keltiring", "Linux", ["Linux", "Python", "HTML", "MySQL"]),
        ("SSDsiz kompyuter qanday ishlaydi?", "Sekinroq", ["Ishlamaydi", "Tezroq", "Sekinroq", "Bir xil"]),
        ("IP manzil nima?", "Qurilmaning tarmoqdagi manzili", ["Foydalanuvchi nomi", "Qurilmaning tarmoqdagi manzili", "Parol", "Fayl nomi"]),
        ("IPv4 necha bitdan iborat?", "32 bit", ["32 bit", "64 bit", "128 bit", "16 bit"]),
        ("IPv6 necha bitdan iborat?", "128 bit", ["32 bit", "64 bit", "128 bit", "16 bit"]),
        ("XOR mantiqiy amali qachon true qaytaradi?", "Kirishlar har xil bo'lsa", ["Ikkalasi true bo'lsa", "Kirishlar har xil bo'lsa", "Ikkalasi false bo'lsa", "Hech qachon"]),
        ("Stek (Stack) qaysi usulda ishlaydi?", "LIFO", ["FIFO", "LIFO", "FILO", "Random"]),
        ("Navbat (Queue) qaysi usulda ishlaydi?", "FIFO", ["FIFO", "LIFO", "FILO", "Random"]),
        ("Virtual xotira nima uchun kerak?", "RAM yetmaganda diskdan foydalanish", ["Tezlikni oshirish", "RAM yetmaganda diskdan foydalanish", "Ma'lumotni o'chirish", "Internet tezligi"]),
        ("Kiberxavfsizlikda 'Phishing' nima?", "Soxta saytlar orqali aldash", ["Virus yuborish", "Soxta saytlar orqali aldash", "Parolni buzish", "Ma'lumotni o'g'irlash"]),
        # 21-30
        ("LAN nima?", "Mahalliy tarmoq", ["Global tarmoq", "Mahalliy tarmoq", "Simsiz tarmoq", "Sun'iy intellekt"]),
        ("Kompyuterning 'miya'si nima?", "CPU", ["RAM", "GPU", "CPU", "Motherboard"]),
        ("Ikkilik tizimda 1+1 nechaga teng?", "10", ["2", "1", "10", "11"]),
        ("Binar qidiruv algoritmi qanday massivda ishlaydi?", "Saralangan", ["Ixtiyoriy", "Saralangan", "Katta", "Kichik"]),
        ("Pufaksimon saralashning eng yomon vaqt murakkabligi nima?", "O(n^2)", ["O(n)", "O(log n)", "O(n^2)", "O(1)"]),
        ("Boole mantiqi kimning nomi bilan atalgan?", "George Boole", ["Alan Turing", "George Boole", "John von Neumann", "Ada Lovelace"]),
        ("ALU nima?", "Arifmetik-mantiqiy qurilma", ["Xotira bloki", "Arifmetik-mantiqiy qurilma", "Boshqaruv bloki", "Kirish qurilmasi"]),
        ("ROM xotiradagi ma'lumot nima bo'ladi?", "O'chmaydi", ["O'chib ketadi", "O'chmaydi", "O'zgaradi", "Yangilanadi"]),
        ("Bus (Shina) nima?", "Ma'lumot tashuvchi yo'l", ["Avtobus", "Ma'lumot tashuvchi yo'l", "Dastur", "Foydalanuvchi"]),
        ("Kernel nima?", "OS ning o'zagi", ["Dastur", "OS ning o'zagi", "Fayl", "Xotira"]),
        # 31-40
        ("Deadlock nima?", "Jarayonlarning bir-birini kutib qolishi", ["Kompyuter o'chishi", "Jarayonlarning bir-birini kutib qolishi", "Xotira to'lishi", "Internet uzilishi"]),
        ("GUI nima?", "Grafik foydalanuvchi interfeysi", ["Matunli interfeys", "Grafik foydalanuvchi interfeysi", "Dastur kodi", "Server"]),
        ("Kompyuter virusi nima?", "Zararli dastur", ["Fayl", "Zararli dastur", "Antivirus", "Hardware"]),
        ("Firewall vazifasi nima?", "Tarmoq xavfsizligini nazorat qilish", ["Fayl yuklash", "Tarmoq xavfsizligini nazorat qilish", "Antivirus o'rnatish", "Internetni tezlashtirish"]),
        ("SQL nima uchun ishlatiladi?", "Ma'lumotlar bazasi bilan ishlash", ["Veb-sayt yaratish", "Ma'lumotlar bazasi bilan ishlash", "Rasm chizish", "Video tahrirlash"]),
        ("Primary Key nima?", "Yagona identifikator", ["Oddiy ustun", "Yagona identifikator", "Parol", "Fayl turi"]),
        ("Database Normalization nima uchun kerak?", "Ma'lumotlar takrorlanishini kamaytirish", ["Xotirani kamaytirish", "Ma'lumotlar takrorlanishini kamaytirish", "Tezlikni oshirish", "Xavfsizlik"]),
        ("Router nima?", "Tarmoqlararo ma'lumot yo'naltiruvchi", ["Kompyuter", "Tarmoqlararo ma'lumot yo'naltiruvchi", "Kabel", "Antenna"]),
        ("MAC manzil nima?", "Qurilmaning fizik manzili", ["Internet manzil", "Qurilmaning fizik manzili", "Foydalanuvchi nomi", "Parol"]),
        ("Wi-Fi qaysi to'lqinlarda ishlaydi?", "Radio to'lqinlar", ["Nur", "Radio to'lqinlar", "Tovush", "Elektr"]),
        # 41-50
        ("HTML nima?", "Belgilash tili", ["Dasturlash tili", "Belgilash tili", "Baza turi", "OS"]),
        ("JavaScript asosan qayerda ishlaydi?", "Brauzerda", ["Serverda", "Brauzerda", "CPUda", "Diskda"]),
        ("Compiler nima?", "Kodni mashina tiliga o'giruvchi", ["Matn muharriri", "Kodni mashina tiliga o'giruvchi", "Brauzer", "Antivirus"]),
        ("Interpreter va Compiler farqi nima?", "Kod bajarilish usulida", ["Tezlikda", "Kod bajarilish usulida", "Rangida", "Hajmida"]),
        ("Bug (Xato) atamasi qaysi hayvondan olingan?", "Qo'ng'iz", ["Sichqon", "Qo'ng'iz", "Chivin", "Ot"]),
        ("Cloud Computing nima?", "Masofaviy hisoblash xizmatlari", ["Bulutlarni o'rganish", "Masofaviy hisoblash xizmatlari", "Yomg'ir prognozi", "Internet tezligi"]),
        ("SaaS nima?", "Software as a Service", ["System as a service", "Software as a Service", "Storage as a service", "Server as a service"]),
        ("AI (Sun'iy intellekt) nima?", "Mashinalarning fikrlashi", ["Robot", "Mashinalarning fikrlashi", "Dastur", "Kamera"]),
        ("Machine Learning nima?", "Mashina orqali o'rganish", ["Robot yasash", "Mashina orqali o'rganish", "Kodni o'chirish", "Hakerlik"]),
        ("Big Data nima?", "Ulkan hajmdagi ma'lumotlar", ["Katta kompyuter", "Ulkan hajmdagi ma'lumotlar", "Katta server", "Katta fayl"]),
        # 51-60
        ("IoT nima?", "Buyumlar interneti", ["Internet of things", "Buyumlar interneti", "Internet of tools", "Internal of things"]),
        ("Blockchain nima?", "Zanjirsimon ma'lumotlar bazasi", ["Zanjir", "Zanjirsimon ma'lumotlar bazasi", "Pul", "Hamyon"]),
        ("Bitcoin nima?", "Kriptovalyuta", ["Qog'oz pul", "Kriptovalyuta", "Karta", "Oltin"]),
        ("Open Source nima?", "Ochiq kodli dastur", ["Bepul dastur", "Ochiq kodli dastur", "Pullik dastur", "Yopiq dastur"]),
        ("Git nima?", "Versiyalarni boshqarish tizimi", ["Dasturlash tili", "Versiyalarni boshqarish tizimi", "Veb-sayt", "Server"]),
        ("GitHub nima?", "Git repozitoriylari xostingi", ["Dastur", "Git repozitoriylari xostingi", "Social tarmoq", "Brauzer"]),
        ("Linux o'zagini kim yaratgan?", "Linus Torvalds", ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Mark Zuckerberg"]),
        ("WWW nima?", "World Wide Web", ["World Wide Web", "Web Wide World", "World Web Wide", "West Wide Web"]),
        ("RAM va ROM farqi?", "RAM o'chuvchan, ROM o'chmas", ["RAM kichik, ROM katta", "RAM o'chuvchan, ROM o'chmas", "RAM sekin, ROM tez", "Farqi yo'q"]),
        ("Superkompyuter nima uchun kerak?", "Murakkab hisob-kitoblar uchun", ["O'yin o'ynash uchun", "Murakkab hisob-kitoblar uchun", "Video ko'rish uchun", "Matn yozish uchun"]),
    ]

    for text, correct, options in cs_questions:
        q = Question.objects.create(exam=cs_exam, text=text, points=100 / 60)
        for opt in options:
            Choice.objects.create(question=q, text=opt, is_correct=(opt == correct))

    print(f"Created exam and 60 questions for: {cs_course.title}")

if __name__ == "__main__":
    seed()
