# 📰 News Website — Next.js

A responsive news website built with Next.js and React, featuring an interactive About page, news coverage information, mission and vision statements, impact statistics, team profiles, frequently asked questions, and a subscription section.

## ✨ Features

- **About Page:** Displays website information and introduction.
- **News Coverage:** Presents coverage categories and descriptions.
- **Mission & Vision:** Communicates the platform's goals and direction.
- **Impact Statistics:** Displays key statistics dynamically.
- **Our Team:** Showcases team members, roles, and profile images.
- **Interactive FAQs:** Expandable questions and answers using React state.
- **Subscription Section:** Includes a call-to-action button for readers.
- **Reusable Components:** Shared Header and Footer components.
- **Dynamic Content:** Uses centralized data from `@/app/data/articles`.
- **Responsive Design:** CSS-based styling for the website layout.

## 🛠️ Technologies Used

- Next.js
- React
- TypeScript
- JavaScript (ES6+)
- HTML5
- CSS3

## 📁 Project Structure

```text
project/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── articles.ts
│   └── about/
│       └── page.tsx
├── public/
│   └── images/
├── package.json
└── README.md
```

*Note: The structure is illustrative; adjust it to match your actual project.*

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone <your-repository-url>
cd <project-folder>
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

**4. Open the website**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🧩 Main Components

- `Header`: Displays the website's navigation.
- `Footer`: Displays the footer section.
- `About`: Renders the About page and its interactive FAQ section.
- `articles`: Stores content for coverage, mission, vision, statistics, team members, FAQs, and images.

## 🔄 How It Works

The About page imports content from a centralized data file and renders sections dynamically using React's `map()` method. The `useState` hook manages the expandable FAQ items, allowing users to open and close questions interactively.

## 🚀 Future Improvements

- Connect the Subscribe button to a newsletter service.
- Add individual news article pages.
- Integrate a CMS or database for content management.
- Improve accessibility and mobile navigation.
- Add SEO metadata and social sharing features.

## 📄 License

Choose and include an appropriate license before distributing the project.
