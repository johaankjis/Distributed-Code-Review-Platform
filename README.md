# Distributed Code Review Platform

A modern, intelligent distributed code review platform that streamlines the code review process by integrating with GitHub and providing smart reviewer assignment, workload balancing, and comprehensive review analytics.

## 🎯 Overview

The Distributed Code Review Platform is designed to help development teams manage code reviews more efficiently. It automatically tracks pull requests across repositories, intelligently assigns reviewers based on expertise and workload, and provides real-time insights into review progress and team performance.

## ✨ Key Features

- **GitHub Integration**: Seamless integration with GitHub for automatic pull request tracking
- **Smart Reviewer Assignment**: Intelligent reviewer assignment based on expertise, workload, and availability
- **Real-time Dashboard**: Comprehensive dashboard showing review status, team workload, and key metrics
- **Workload Balancing**: Automatic distribution of reviews to prevent reviewer burnout
- **Review Analytics**: Track review times, completion rates, and team performance metrics
- **Notifications**: Real-time notifications for review assignments and updates
- **Webhook Support**: Automatic syncing with GitHub through webhooks
- **Multi-Repository Support**: Manage code reviews across multiple repositories

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom components
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and context
- **Charts**: Recharts for data visualization

### Backend
- **Framework**: Ruby on Rails 7.1 (API mode)
- **Language**: Ruby 3.2.0
- **API Client**: Octokit for GitHub API integration
- **Authentication**: JWT and BCrypt
- **Background Jobs**: Sidekiq with Redis

### Infrastructure
- **Database**: PostgreSQL 15
- **Cache & Queue**: Redis 7
- **Containerization**: Docker with Docker Compose
- **Web Server**: Puma (for Rails backend)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 20.x or higher
- **Ruby**: 3.2.0
- **Docker**: 24.x or higher
- **Docker Compose**: 2.x or higher
- **Git**: For version control
- **GitHub Account**: For OAuth integration

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/johaankjis/Distributed-Code-Review-Platform.git
cd Distributed-Code-Review-Platform
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/github/callback

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database Configuration (Docker defaults)
DATABASE_URL=postgresql://postgres:postgres@db:5432/code_review_development

# Redis Configuration (Docker defaults)
REDIS_URL=redis://redis:6379/0

# Environment
NODE_ENV=development
```

### 3. Start Services with Docker Compose

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Redis on port 6379
- Next.js application on port 3000

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🔧 Development Setup

### Without Docker

#### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

#### Backend Setup

```bash
cd backend

# Install Ruby dependencies
bundle install

# Set up database
rails db:create db:migrate

# Load sample data (optional)
rails db:seed

# Start Rails server
rails server -p 4000
```

## 📊 Database Schema

The platform uses the following core entities:

- **Users**: GitHub users with authentication details
- **Repositories**: Connected GitHub repositories
- **Pull Requests**: Tracked PRs with metadata (additions, deletions, changed files)
- **Reviews**: Review assignments with status tracking (pending, in_progress, completed)
- **Review Comments**: Comments associated with reviews
- **Reviewer Assignments**: History of reviewer assignments
- **Notifications**: User notifications for review activities

See `scripts/001_create_database_schema.sql` for the complete schema definition.

## 🗂️ Project Structure

```
.
├── app/                      # Next.js application directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── dashboard/       # Dashboard API
│   │   ├── pull-requests/   # PR management API
│   │   └── webhooks/        # GitHub webhook handlers
│   ├── dashboard/           # Dashboard pages
│   └── layout.tsx           # Root layout
├── backend/                  # Rails backend
│   ├── app/
│   │   └── models/          # ActiveRecord models
│   └── config/              # Rails configuration
├── components/               # React components
│   ├── ui/                  # UI primitives (buttons, cards, etc.)
│   ├── dashboard-header.tsx
│   ├── pull-request-list.tsx
│   ├── reviewer-workload.tsx
│   └── stats-cards.tsx
├── lib/                      # Utility functions and helpers
├── scripts/                  # Database initialization scripts
├── styles/                   # Global styles
├── docker-compose.yml        # Docker services configuration
├── Dockerfile               # Production Docker image
└── package.json             # Node.js dependencies
```

## 🔐 GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
3. Copy the Client ID and Client Secret to your `.env` file

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/github` - Initiate GitHub OAuth flow
- `GET /api/auth/github/callback` - OAuth callback handler

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/pull-requests` - List all pull requests

### Pull Requests
- `GET /api/pull-requests` - List pull requests with filters
- `GET /api/pull-requests/:id` - Get pull request details
- `POST /api/pull-requests/:id/assign` - Assign reviewers

### Webhooks
- `POST /api/webhooks/github` - GitHub webhook receiver

## 🎨 Features in Detail

### Smart Reviewer Assignment
The platform uses several factors to assign reviewers:
- Historical expertise with similar code
- Current workload and active reviews
- Average review time
- Code complexity analysis

### Workload Balancing
- Real-time tracking of active reviews per reviewer
- Priority-based review assignment
- Automatic workload redistribution

### Review Analytics
- Average review time per reviewer
- Review completion rates
- Pull request complexity scores
- Team performance metrics

## 🧪 Testing

```bash
# Frontend tests (when added)
npm test

# Backend tests
cd backend
bundle exec rspec
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Code Review**: All changes require code review
3. **Testing**: Ensure all tests pass before merging
4. **Documentation**: Update documentation for new features

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d db
docker-compose exec app rails db:create db:migrate
```

### Port Conflicts
If ports 3000, 4000, 5432, or 6379 are in use, update the port mappings in `docker-compose.yml`.

### GitHub Webhook Issues
Ensure your webhook URL is publicly accessible (use ngrok for local development):
```bash
ngrok http 3000
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **johaankjis** - Initial work

## 🙏 Acknowledgments

- Built with Next.js, React, and Rails
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions

---

**Note**: This is a development platform. For production deployment, ensure proper security configurations, environment variables, and SSL certificates are in place.
