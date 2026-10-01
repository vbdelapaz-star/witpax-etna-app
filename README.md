# WITPax ETNA — Interactive Assessment & Priority Gap Portal

WITPax ETNA is a responsive web application designed for TVET welding instructors undergoing capacity building with SEABERY Soldamatic simulators. The application features a 8-part baseline assessment form wizard, interactive priority gap matrix calculations ($Gap = Importance - Ability$), diagnostic knowledge checks, local storage state persistence, dynamic Chart.js analytics, and print-ready report generation.

## Features

- **8-Step Assessment Form Wizard:**
  - Part I: Personal & Professional Profile
  - Part II: Current Teaching Assignment & Class Obstacles
  - Part III: Technical Equipment & Process Confidence Ratings
  - Part IV: Simulator & Digital Experience
  - Part V: Curriculum & Instructional Alignment Needs
  - Part VI: Open Forum & Qualitative Expectations
  - Part VII: Live Priority Gap Auto-Calculator ($Gap = Importance - Ability$)
  - Part VIII: 10-Question Multiple Choice Diagnostic Knowledge Check
- **Analytics Dashboard:** Visualizes priority gaps and experience metrics using Chart.js.
- **Client-Side Data Storage:** Manages participant records via browser `localStorage`.
- **Data Export & Import:** Full export support for JSON and CSV file formats.
- **Printable Executive Summary:** Formatted for direct PDF printing.

## Deployment to GitHub Pages

1. **Initialize Git repository & commit files:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of WITPax ETNA application"
