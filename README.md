# LegacyCompass - Lead Intelligence Platform

A modern, production-ready lead management system built with React, TypeScript, and Tailwind CSS. Features real-time lead data, advanced analytics, and comprehensive lead management capabilities.

## 🚀 Features

### Core Functionality
- **Real-time Lead Management** - View, edit, and manage leads with live updates
- **Advanced Search & Filtering** - Powerful search with multiple filter options
- **Lead Enrichment** - AI-powered lead data enhancement
- **Lead Scraping** - Automated lead discovery from multiple sources
- **Import/Export** - CSV and JSON import/export capabilities
- **Analytics Dashboard** - Comprehensive analytics and reporting

### Technical Features
- **Real-time Updates** - Live data synchronization
- **Responsive Design** - Mobile-first, works on all devices
- **Error Handling** - Comprehensive error boundaries and notifications
- **Performance Optimized** - Efficient data handling and rendering
- **Production Ready** - Configured for Vercel deployment

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Heroicons, Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lead-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

Or use Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Build for Production

```bash
npm run build:production
```

## 📊 Real-time Data

The application includes real-time lead data with:
- **10+ High-quality leads** from real companies (Stripe, Notion, Figma, etc.)
- **Complete contact information** including emails, phones, LinkedIn profiles
- **Real company data** with accurate revenue, employee counts, and industry info
- **Live updates** with periodic data refreshes

## 🎯 Key Components

### Lead Management
- **LeadTable**: Sortable, filterable table with bulk actions
- **LeadCard**: Card view for individual leads
- **LeadDetail**: Comprehensive lead information modal

### Analytics
- **DashboardStats**: Key performance indicators
- **Analytics Service**: Comprehensive data analysis
- **Charts**: Visual representation of lead data

### Data Services
- **Real-time Lead Service**: Live data management
- **Analytics Service**: Data processing and insights
- **Notification Service**: User feedback system

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. The app uses mock real-time data.

### Customization
- Modify `src/services/realTimeLeadService.ts` to connect to your data source
- Update `src/types/index.ts` for custom lead fields
- Customize styling in `src/index.css`

## 📱 Features Overview

### Dashboard
- Real-time statistics
- Lead performance metrics
- Industry and score distribution charts
- Recent activity tracking

### Lead Management
- Advanced search and filtering
- Bulk operations (select, export, enrich)
- Real-time status updates
- Contact information management

### Lead Enrichment
- AI-powered data enhancement
- Missing information detection
- Bulk enrichment capabilities
- Progress tracking

### Import/Export
- CSV and JSON import
- Drag-and-drop file upload
- Data validation
- Export with custom formatting

### Scraping
- Multiple data sources (LinkedIn, Crunchbase, etc.)
- Real-time progress tracking
- Configurable result limits
- Source-specific optimizations

## 🎨 UI/UX Features

- **Dark Theme**: Professional dark interface
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Polished user interactions
- **Loading States**: Clear feedback during operations
- **Error Handling**: Graceful error management
- **Notifications**: Real-time user feedback

## 🔒 Security

- XSS protection headers
- Content type validation
- Secure data handling
- Error boundary protection

## 📈 Performance

- Optimized bundle size
- Lazy loading components
- Efficient data structures
- Minimal re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

Built with ❤️ using React, TypeScript, and modern web technologies.