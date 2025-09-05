#!/bin/bash

# RightsGuard Deployment Script
# This script handles the complete deployment process for the RightsGuard Base Mini App

set -e  # Exit on any error

echo "🚀 Starting RightsGuard deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "NEXT_PUBLIC_PRIVY_APP_ID"
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        "OPENAI_API_KEY"
        "STRIPE_SECRET_KEY"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_error "Please set these variables before deploying."
        exit 1
    fi
    
    print_success "All required environment variables are set."
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed successfully."
}

# Run type checking
type_check() {
    print_status "Running TypeScript type checking..."
    npm run type-check
    print_success "Type checking passed."
}

# Run linting
lint_code() {
    print_status "Running ESLint..."
    npm run lint
    print_success "Linting passed."
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm test -- --coverage --watchAll=false
    print_success "All tests passed."
}

# Build the application
build_app() {
    print_status "Building the application..."
    npm run build
    print_success "Application built successfully."
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_success "Deployed to Vercel successfully."
    else
        print_warning "Vercel CLI not found. Please install it with: npm i -g vercel"
        print_status "You can also deploy manually by pushing to your connected Git repository."
    fi
}

# Setup database (if needed)
setup_database() {
    print_status "Checking database setup..."
    
    if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        print_status "Database service key found. You may need to run database migrations manually."
        print_status "Please ensure your Supabase database has the required tables."
        print_status "Refer to the README.md for the database schema."
    else
        print_warning "SUPABASE_SERVICE_ROLE_KEY not set. Database operations may be limited."
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    if [ -n "$VERCEL_URL" ]; then
        print_status "Checking deployment at: $VERCEL_URL"
        
        # Simple health check
        if curl -f -s "$VERCEL_URL" > /dev/null; then
            print_success "Deployment is accessible and responding."
        else
            print_error "Deployment health check failed."
            exit 1
        fi
    else
        print_warning "VERCEL_URL not set. Skipping deployment verification."
    fi
}

# Main deployment flow
main() {
    echo "🛡️  RightsGuard Base Mini App Deployment"
    echo "========================================"
    
    # Pre-deployment checks
    check_env_vars
    
    # Install and verify
    install_dependencies
    type_check
    lint_code
    
    # Run tests (optional - can be skipped with --skip-tests)
    if [[ "$*" != *"--skip-tests"* ]]; then
        run_tests
    else
        print_warning "Skipping tests as requested."
    fi
    
    # Build
    build_app
    
    # Database setup
    setup_database
    
    # Deploy
    if [[ "$*" != *"--build-only"* ]]; then
        deploy_vercel
        verify_deployment
    else
        print_warning "Build-only mode. Skipping deployment."
    fi
    
    echo ""
    print_success "🎉 Deployment process completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Verify your app is working at the deployed URL"
    echo "  2. Test the payment integration with Stripe"
    echo "  3. Ensure Supabase database is properly configured"
    echo "  4. Test the recording functionality on mobile devices"
    echo "  5. Verify emergency contact alerts are working"
    echo ""
    echo "📚 Documentation: https://github.com/vistara-apps/ce283aaa-99e7-4ea7-83da-1dbc54a2d4cd#readme"
    echo "🆘 Support: Create an issue on GitHub if you encounter problems"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "RightsGuard Deployment Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h        Show this help message"
        echo "  --skip-tests      Skip running tests during deployment"
        echo "  --build-only      Only build the app, don't deploy"
        echo ""
        echo "Environment variables required:"
        echo "  NEXT_PUBLIC_SUPABASE_URL"
        echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "  NEXT_PUBLIC_PRIVY_APP_ID"
        echo "  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        echo "  OPENAI_API_KEY"
        echo "  STRIPE_SECRET_KEY"
        echo ""
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
