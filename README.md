# KrowdKraft

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2024-blueviolet.svg)](https://hacktoberfest.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> Amplifying brands to Gen Z & Millennials through authentic community experiences| Powered by our developer community 

## About KrowdKraft

KrowdKraft is a community-driven organization dedicated to empowering individuals and businesses through technology, collaboration, and impactful events. We aim to amplify our partners' voices and bridge the gap between their brands and the GenZ & Millennial generations.

At the heart of our mission is a vibrant and growing developer community. We believe in the power of open-source and collaborative learning. This repository is not just the codebase for our official website - it's a living project where students, professionals, and tech enthusiasts can connect, build, and grow together. By contributing, you are directly helping us enhance a platform that supports and uplifts the next generation of tech talent.

We are excited to welcome you to our community and look forward to building a better future, together.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Small, fast state management
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) - Performant forms with validation
- **Email Service**: [Nodemailer](https://nodemailer.com/) - Email sending functionality
- **GitHub Integration**: Live repository stats via GitHub API with intelligent caching

## Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Git** for version control

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Email Configuration
EMAIL_USER=
EMAIL_PASS=

# Google Sheets Integration
GOOGLE_SHEETS_WEBHOOK_URL=
GOOGLE_SHEETS_PARTNERSHIP_WEBHOOK_URL=

# Medium profile username for articles
MEDIUM_USER_PROFILE = 

# Social Media & Public URLs
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/krowdkraft/
NEXT_PUBLIC_TWITTER_URL=https://x.com/KrowdKraft_
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/krowdkraft_/
NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/krowdkraft-official/30min

# GitHub API Configuration (Optional - for higher rate limits)
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO_OWNER=DarshanKrishna-DK
GITHUB_REPO_NAME=KrowdKraft
```

**Note**: The GitHub stats feature will work without a token, but with rate limits. For production use, we recommend setting up a GitHub token.

### Installation

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this repository to create your own copy.

2. **Clone your fork**
   
   ```bash
   git clone https://github.com/YOUR_USERNAME/KrowdKraft.git
   cd KrowdKraft
   ```

3. **Install dependencies**
   
   ```bash
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   
   ```bash
   # Email Configuration (Required for contact forms)
   EMAIL_USER=example@gmail.com
   EMAIL_PASS=your_16_character_app_password
   
   # Google Sheets Integration (Required for newsletter and partnerships)
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/EXAMPLE_ID/exec
   GOOGLE_SHEETS_PARTNERSHIP_WEBHOOK_URL=https://script.google.com/macros/s/EXAMPLE_ID/exec
   
   # Social Media Links (Public URLs - keep as provided)
   NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/krowdkraft/
   NEXT_PUBLIC_TWITTER_URL=https://x.com/KrowdKraft_
   NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/krowdkraft_/
   NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=https://chat.whatsapp.com/EXAMPLE_LINK
   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/krowdkraft-official/30min
   ```

5. **Start the development server**
   
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website running locally.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
KrowdKraft/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   │   ├── sections/        # Page section components
│   │   ├── ui/              # UI components (buttons, inputs, etc.)
│   │   └── common/          # Shared utility components
│   ├── data/                # Static data and content
│   ├── lib/                 # Utility functions
│   ├── store/               # State management
│   ├── styles/              # Global CSS styles
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets (images, icons)
└── docs/                    # Documentation files
```


## 📊 Community Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/DarshanKrishna-DK/KrowdKraft?style=for-the-badge&logo=github&color=yellow)
![GitHub forks](https://img.shields.io/github/forks/DarshanKrishna-DK/KrowdKraft?style=for-the-badge&logo=github&color=blue)
![GitHub issues](https://img.shields.io/github/issues/DarshanKrishna-DK/KrowdKraft?style=for-the-badge&logo=github&color=red)
![GitHub closed issues](https://img.shields.io/github/issues-closed/DarshanKrishna-DK/KrowdKraft?style=for-the-badge&logo=github&color=green)
![GitHub pull requests](https://img.shields.io/github/issues-pr/DarshanKrishna-DK/KrowdKraft?style=for-the-badge&logo=github&color=orange)
![GitHub contributors](https://img.shields.io/github/contributors/DarshanKrishna-DK/KrowdKraft?style=for-the-badge&logo=github&color=purple)

</div>

### 🏆 Top Contributors

<table>
  <tr>
<td align="center"><a href="https://github.com/DarshanKrishna-DK"><img src="https://avatars.githubusercontent.com/u/80464993?v=4" width="100px;" alt="DarshanKrishna-DK"/><br /><sub><b>DarshanKrishna-DK</b></sub></a><br />60 contributions</td>
<td align="center"><a href="https://github.com/Udith-creates"><img src="https://avatars.githubusercontent.com/u/189503580?v=4" width="100px;" alt="Udith-creates"/><br /><sub><b>Udith-creates</b></sub></a><br />8 contributions</td>
<td align="center"><a href="https://github.com/Nel4Nelson"><img src="https://avatars.githubusercontent.com/u/79995989?v=4" width="100px;" alt="Nel4Nelson"/><br /><sub><b>Nel4Nelson</b></sub></a><br />4 contributions</td>
<td align="center"><a href="https://github.com/HarjobandeepSingh"><img src="https://avatars.githubusercontent.com/u/81474463?v=4" width="100px;" alt="HarjobandeepSingh"/><br /><sub><b>HarjobandeepSingh</b></sub></a><br />4 contributions</td>
<td align="center"><a href="https://github.com/amitkushh"><img src="https://avatars.githubusercontent.com/u/140083127?v=4" width="100px;" alt="amitkushh"/><br /><sub><b>amitkushh</b></sub></a><br />3 contributions</td>
<td align="center"><a href="https://github.com/apps/github-actions"><img src="https://avatars.githubusercontent.com/in/15368?v=4" width="100px;" alt="github-actions[bot]"/><br /><sub><b>github-actions[bot]</b></sub></a><br />3 contributions</td>
  </tr>
</table>

<div align="center">
  <i>Stats updated daily via GitHub Actions</i>
</div>

---
## How to Contribute

We welcome contributions from developers of all skill levels! Whether you are fixing bugs, adding new features, improving documentation, or enhancing the user experience, your contributions are valuable.

### Quick Start for Contributors

1. Check out our [Issues](https://github.com/DarshanKrishna-DK/KrowdKraft/issues) page for open tasks
2. Look for issues labeled `good first issue` or `hacktoberfest` for beginner-friendly tasks
3. Read our detailed [Contributing Guide](./CONTRIBUTING.md) for the complete workflow
4. Join the discussion in issue comments before starting work

### Types of Contributions We Welcome

- **Bug Fixes**: Help us identify and fix issues
- **Feature Development**: Add new functionality or improve existing features
- **UI/UX Improvements**: Enhance the visual design and user experience
- **Performance Optimization**: Improve loading times and responsiveness
- **Documentation**: Improve README, add code comments, or create tutorials
- **Testing**: Add unit tests or integration tests
- **Accessibility**: Make the website more accessible to all users

For detailed contribution guidelines, please read our [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) to understand the standards we expect from our community.

## Support

If you have questions or need help getting started:

- Check existing [Issues](https://github.com/DarshanKrishna-DK/KrowdKraft/issues) for similar questions
- Create a new issue with the `question` label
- Review our [Contributing Guide](./CONTRIBUTING.md) for detailed information

## Acknowledgments

Thank you to all the contributors who help make KrowdKraft better! Your contributions, whether big or small, are greatly appreciated.

## Connect With Us

Stay updated with KrowdKraft and join our community:

- **LinkedIn**: [KrowdKraft](https://www.linkedin.com/company/krowdkraft/)
- **Twitter/X**: [@KrowdKraft_](https://x.com/KrowdKraft_)
- **Instagram**: [@krowdkraft_](https://www.instagram.com/krowdkraft_/)
- **WhatsApp Community**: [Join our community](https://chat.whatsapp.com/Ko9hqFs7hhtLJY1nePhkNO)
- **Schedule a Meeting**: [Book a call with us](https://calendly.com/krowdkraft-official/30min)

---

**Happy Contributing!** 🚀