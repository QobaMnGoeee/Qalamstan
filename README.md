# TURAN STUDIO — статикалық сайт

Minecraft плагин, сервер сборка, карта дизайны және визуал дизайн қызметтерін ұсынатын
TURAN STUDIO студиясының толық статикалық multi-page сайты. Framework жоқ, build step жоқ,
backend жоқ — таза HTML, CSS және vanilla JavaScript.

## Іске қосу

Build құралы қажет емес. Кез келген статикалық сервермен ашыңыз:

```bash
python3 -m http.server 8080
# немесе
npx serve .
```

Содан кейін `http://localhost:8080` мекенжайын ашыңыз. `index.html`-ды тікелей
`file://` арқылы ашуға да болады, бірақ салыстырмалы жолдар кейбір браузерлерде
дұрыс жұмыс істемеуі мүмкін — сондықтан жергілікті серверді ұсынамыз.

## Құрылым

```
/
├── index.html                  Басты бет (hero, қызметтер, миссия, портфолио preview, ивент)
├── 404.html                    Бет табылмады беті
├── favicon.ico
├── manifest.json                Web app manifest (PWA иконкалары)
├── robots.txt
├── sitemap.xml
├── pages/
│   ├── services.html            Қызметтердің толық сипаттамасы
│   ├── portfolio.html           Сүзгіленетін жоба галереясы
│   ├── team.html                Рөл бойынша топталған команда
│   ├── contact.html             Байланыс формасы (визуал ғана) + Discord/әлеумет
│   ├── login.html                Кіру беті (client-side валидация, backend жоқ)
│   ├── register.html            Тіркелу беті (client-side валидация, backend жоқ)
│   ├── user-profile.html        Статикалық мысал деректермен профиль макеті
│   ├── privacy-policy.html      Sticky TOC-пен құпиялылық саясаты
│   └── terms-of-service.html    Sticky TOC-пен қызмет көрсету шарттары
├── css/
│   ├── style.css                 Дизайн токендер, reset, типографика, негізгі утилиталар
│   ├── components/
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   ├── cookie-banner.css
│   │   └── cards.css              Қызмет/портфолио/команда карточкалары
│   └── pages/
│       ├── home.css               Hero pattern, mission, event countdown
│       ├── forms.css              Auth беттер мен байланыс формасы
│       ├── profile.css            Профиль макеті
│       └── inner-pages.css        Page header, breadcrumbs, service detail, filter bar, legal TOC
├── js/
│   ├── script.js                  Navbar toggle, footer жыл, filter chips, countdown, форма guard
│   └── utils/
│       ├── cookie-consent.js      localStorage негізіндегі cookie banner логикасы
│       └── validation.js          Login/register клиент жақтағы валидация, password toggle
└── assets/
    ├── images/
    │   ├── logo/                  Favicon негізінде генерацияланған PNG нұсқалар (icon, og-image)
    │   ├── portfolio/             Портфолио карточкаларына арналған placeholder суреттер (.webp)
    │   └── team/                  Команда мүшелеріне арналған placeholder аватарлар (.webp)
    └── fonts/                     Бос — қаріптер Google Fonts CDN арқылы жүктеледі (төмендегі ескертуді қараңыз)
```

## Дизайн жүйесі

- **Түстер:** қараңғы негіз (`#0E1116`), алтын-күңгірт акцент (`#C9932E`), жасыл-сүр
  екінші акцент (`#5B8C7B`) — Discord/CTA элементтеріне.
- **Қаріптер:** дисплей үшін `Unbounded` (геометриялық, бренд сипатты), негізгі мәтін үшін
  `Inter`, утилита/сан мәліметтер үшін `JetBrains Mono` (countdown, breadcrumb, eyebrow).
- **Қолтаңба элемент:** hero фонындағы баяу айналатын, Түркі-көшпенді геометриялық
  8-қырлы жұлдыз (kun-mushel) нақышынан тұратын ambient lattice — екі қабат, әртүрлі
  жылдамдықпен, `prefers-reduced-motion` құрметтеледі.
- Барлық түс/қаріп/аралық мәндер `css/style.css`-тегі CSS custom properties арқылы беріледі.

## Маңызды ескертулер

- **Assets қасақана толтырылмаған.** Пайдаланушының өтініші бойынша нақты логотип,
  портфолио скриншоттары және команда фотосуреттері жүктелмеді. Орнына:
  - `assets/images/logo/` ішінде favicon-нан алынған SVG-негізді PNG нұсқалар бар
    (browser tab, apple-touch-icon, Open Graph, manifest үшін жұмыс істейді).
  - `assets/images/portfolio/` мен `assets/images/team/` ішінде жеңіл, брендтік түс
    палитрасына сай placeholder суреттер бар — өндірістік суреттермен ауыстырыңыз.
  - Барлық `<img>` тегтерінде сипаттамалы `alt` мәтіні бар, сондықтан суреттерді
    дәл сол файл атауымен ауыстыру жеткілікті.
- **Қаріптер CDN арқылы жүктеледі** (`fonts.googleapis.com`), себебі бұл орта
  сол доменге тікелей желі рұқсатын бермейді. Prod ортасында ауыстырғыңыз келсе,
  қаріп файлдарын `assets/fonts/`-қа жүктеп, `css/style.css` басындағы `@import`
  жолын `@font-face` анықтамаларына ауыстырыңыз.
- **Backend жоқ.** Login, register және contact беттеріндегі формалар тек клиент
  жағында форматты тексереді (email форматы, пароль ұзындығы, парольдердің
  сәйкестігі, міндетті өрістер). Ешбір деректер серверге жіберілмейді немесе
  сақталмайды. Әр форманың астында бұл туралы ашық ескерту (`auth-demo-notice` /
  `profile-demo-notice`) көрсетілген.
- **Cookie banner** `localStorage` арқылы келісімді есте сақтайды (`turanstudio-cookie-consent`
  кілті). Браузер localStorage-ты қолдамаса немесе бұғаттаса, банер сессия сайын
  қайта көрсетіледі — бұл қасақана graceful fallback.
- **SEO:** әр бетте бірегей `<title>`, `meta description`, `canonical`, Open Graph
  тегтері бар. `index.html`-де JSON-LD `Organization` schema қосылған. Login,
  register және profile беттері `robots.txt`/`sitemap.xml`-де индекстен шығарылған.

## Кодтау конвенциялары

- Барлық HTML/CSS/JS файлдарында **түсініктемелер жоқ** — өтініш бойынша.
- CSS BEM-ге жақын, компонент негізді class атаулармен жазылған (`.card`, `.navbar-link`,
  `.form-input`), препроцессор жоқ.
- JS vanilla, модуль жүйесі жоқ (`<script>` тег арқылы тікелей қосылады), function-негізді.
- Барлық ішкі сілтемелер салыстырмалы (`pages/...`, `../index.html`), сондықтан жоба кез
  келген ішкі каталогқа орналастырылса да жұмыс істейді.
