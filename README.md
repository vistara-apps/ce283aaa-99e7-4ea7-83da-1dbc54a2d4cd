# RightsGuard - Base Mini App

**Your pocket guide to rights and safety.**

RightsGuard is a production-ready Next.js Base Mini App that provides one-page, mobile-optimized guides on user rights during police stops, multilingual scripts, and discreet recording capabilities.

## 🚀 Features

### Core Features

- **State-Specific Legal Guides**: One-page, mobile-optimized summaries of user rights tailored to specific U.S. states
- **Multilingual Scripts & Guidance**: Pre-written phrases and instructions in English and Spanish
- **Incident Recording & Sharing**: One-tap discreet audio/video recording with location tracking
- **Emergency Geo-Alerts**: Real-time location sharing with trusted contacts during emergencies

### Technical Features

- **Base Chain Integration**: Built for Base network with wallet connectivity
- **Payment Processing**: Stripe integration for guide purchases and subscriptions
- **AI-Powered Content**: OpenAI integration for dynamic script generation
- **Real-time Database**: Supabase for user data and incident management
- **IPFS Storage**: Pinata integration for decentralized file storage
- **PWA Support**: Offline capabilities and mobile app-like experience

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Privy for Web3 auth and wallet management
- **Database**: Supabase with real-time subscriptions
- **Payments**: Stripe for fiat payments
- **AI**: OpenAI for content generation
- **Storage**: Pinata for IPFS file storage
- **Blockchain**: Base chain integration via OnchainKit
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vistara-apps/ce283aaa-99e7-4ea7-83da-1dbc54a2d4cd.git
   cd ce283aaa-99e7-4ea7-83da-1dbc54a2d4cd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

### Base Configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=RightsGuard
NODE_ENV=development
```

### Supabase Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Privy Configuration

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

### OpenAI Configuration

```env
OPENAI_API_KEY=your_openai_api_key
```

### Stripe Configuration

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Additional Services

```env
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
NEYNAR_API_KEY=your_neynar_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

## 🗄 Database Setup

### Supabase Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  wallet_address TEXT,
  state_preference TEXT,
  paid_state_guides TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- State guides table
CREATE TABLE state_guides (
  guide_id TEXT PRIMARY KEY,
  state_name TEXT NOT NULL,
  content_url TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'es')),
  content JSONB NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recorded incidents table
CREATE TABLE recorded_incidents (
  incident_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  location JSONB NOT NULL,
  recording_url TEXT,
  alert_sent BOOLEAN NOT NULL DEFAULT FALSE,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trusted contacts table
CREATE TABLE trusted_contacts (
  contact_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  farcaster_id TEXT,
  relationship TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency alerts table
CREATE TABLE emergency_alerts (
  alert_id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES recorded_incidents(incident_id),
  contact_id TEXT NOT NULL REFERENCES trusted_contacts(contact_id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment intents table
CREATE TABLE payment_intents (
  intent_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(user_id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'USDC')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  guide_id TEXT REFERENCES state_guides(guide_id),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recorded_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Create policies (basic examples - customize as needed)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = user_id);
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📱 Base Mini App Integration

This app is designed to work as a Base Mini App within the Coinbase Wallet ecosystem:

1. **Frame Integration**: Optimized for Farcaster frames
2. **Wallet Connectivity**: Seamless Base wallet integration
3. **Mobile First**: Touch-optimized interface
4. **Offline Support**: PWA capabilities for offline access

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **Input Validation**: Zod schema validation
- **Rate Limiting**: API endpoint protection
- **Secure Recording**: Privacy-focused media capture
- **Encrypted Storage**: Secure data handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 📊 API Documentation

### Authentication

- `POST /api/auth/user` - Create user
- `GET /api/auth/user` - Get user data
- `PUT /api/auth/user` - Update user

### State Guides

- `GET /api/guides` - Get state guides
- `GET /api/guides/[id]` - Get specific guide

### Incidents

- `POST /api/incidents` - Create incident
- `GET /api/incidents` - Get user incidents

### Contacts

- `POST /api/contacts` - Create trusted contact
- `GET /api/contacts` - Get user contacts
- `PUT /api/contacts` - Update contact
- `DELETE /api/contacts` - Delete contact

### Payments

- `POST /api/payments/create-intent` - Create payment intent
- `GET /api/payments/create-intent` - Get payment status

### AI

- `POST /api/ai/generate-script` - Generate custom scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact:

- Email: support@rightsguard.app
- Discord: [RightsGuard Community](https://discord.gg/rightsguard)
- Documentation: [docs.rightsguard.app](https://docs.rightsguard.app)

## 🙏 Acknowledgments

- Built with [OnchainKit](https://onchainkit.xyz/)
- Powered by [Base](https://base.org/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**⚠️ Important Legal Notice**: This app provides general information about legal rights and is not a substitute for professional legal advice. Always consult with a qualified attorney for specific legal situations.
